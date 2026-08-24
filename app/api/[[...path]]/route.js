import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { ensureSeeded } from '@/lib/seed'
import {
  hashPassword, verifyPassword, signAdminToken,
  setAuthCookie, clearAuthCookie, getCurrentAdmin,
} from '@/lib/auth'
import { validatePasswordStrength } from '@/lib/passwords'
import { itemsToCsv, parseCsv, REQUIRED_IMPORT_COLUMNS } from '@/lib/csv'

function json(data, status = 200) { return NextResponse.json(data, { status }) }
async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) return null
  return admin
}
async function bootIfNeeded() { try { await ensureSeeded() } catch (e) { console.error('Seed error:', e) } }

function clientIp(request) {
  const h = request.headers
  return (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
}

// ---------- Login rate limiting (per IP + email) ----------
const RL_WINDOW_MS = 15 * 60 * 1000 // 15 min
const RL_MAX = 5
async function checkRateLimit(db, key) {
  const now = Date.now()
  const doc = await db.collection('login_attempts').findOne({ _id: key })
  if (!doc) return { blocked: false, remaining: RL_MAX, retryAfter: 0 }
  const fresh = (doc.attempts || []).filter(t => now - t < RL_WINDOW_MS)
  if (fresh.length >= RL_MAX) {
    const oldest = Math.min(...fresh)
    const retryAfter = Math.max(0, RL_WINDOW_MS - (now - oldest))
    return { blocked: true, remaining: 0, retryAfter }
  }
  return { blocked: false, remaining: RL_MAX - fresh.length, retryAfter: 0 }
}
async function recordFailedLogin(db, key) {
  const now = Date.now()
  await db.collection('login_attempts').updateOne(
    { _id: key },
    { $push: { attempts: now }, $setOnInsert: { first_at: new Date() } },
    { upsert: true }
  )
  // Prune older-than-window
  const doc = await db.collection('login_attempts').findOne({ _id: key })
  if (doc?.attempts) {
    const fresh = doc.attempts.filter(t => now - t < RL_WINDOW_MS)
    await db.collection('login_attempts').updateOne({ _id: key }, { $set: { attempts: fresh } })
  }
}
async function clearRateLimit(db, key) {
  await db.collection('login_attempts').deleteOne({ _id: key })
}

// ---------- Helpers ----------
function sanitizePrice(body) {
  const clean = {}
  const strFields = ['category', 'name', 'service_type', 'dc_price', 'si_price', 'mrp', 'unit', 'note']
  strFields.forEach(k => { if (typeof body[k] === 'string') clean[k] = body[k].trim() })
  if (body.mrp === null || body.mrp === '') clean.mrp = null
  if (typeof body.discount_percent === 'number' && body.discount_percent >= 0 && body.discount_percent <= 100) clean.discount_percent = body.discount_percent
  if (typeof body.active === 'boolean') clean.active = body.active
  if (typeof body.special === 'boolean') clean.special = body.special
  if (typeof body.display_order === 'number') clean.display_order = body.display_order
  return clean
}
function computeFinalPrice(mrp, pct) {
  const n = Number(mrp)
  if (Number.isFinite(n) && Number.isFinite(pct)) {
    return String(Math.round((n - (n * pct) / 100) * 100) / 100)
  }
  return null
}
async function writeAudit(db, action, user, extra = {}) {
  await db.collection(COLLECTIONS.audit_log).insertOne({
    _id: uuidv4(), action, user, at: new Date(), ...extra,
  })
}

// =====================================================================
// GET
// =====================================================================
export async function GET(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const path = p.join('/')
  const db = await getDb()
  const url = new URL(request.url)

  // ---------- Public ----------
  if (path === '' || path === 'health') return json({ status: 'ok', service: 'Urban Dry Clean', timestamp: new Date().toISOString() })
  if (path === 'public/prices') {
    const items = await db.collection(COLLECTIONS.price_items).find({ active: true }).sort({ category: 1, display_order: 1 }).toArray()
    return json({ items })
  }
  if (path === 'public/services') {
    const items = await db.collection(COLLECTIONS.services).find({ active: true }).sort({ display_order: 1 }).toArray()
    return json({ items })
  }
  if (path === 'public/faqs') {
    const items = await db.collection(COLLECTIONS.faqs).find({ active: true }).sort({ display_order: 1 }).toArray()
    return json({ items })
  }
  if (path === 'public/settings') {
    const doc = await db.collection(COLLECTIONS.settings).findOne({ _id: 'business' })
    return json({ settings: doc || null })
  }
  if (path === 'public/promotion') {
    const doc = await db.collection(COLLECTIONS.promotions).findOne({ active: true })
    return json({ promotion: doc || null })
  }

  // ---------- Admin (protected) ----------
  const admin = await requireAdmin()
  if (path.startsWith('admin/')) {
    if (!admin) return json({ error: 'Unauthorized' }, 401)
  }

  if (path === 'admin/me') return json({ admin: { email: admin.email, role: admin.role } })

  if (path === 'admin/stats') {
    const [priceTotal, priceActive, svcTotal, svcActive, promos, activePromos, faqTotal] = await Promise.all([
      db.collection(COLLECTIONS.price_items).countDocuments(),
      db.collection(COLLECTIONS.price_items).countDocuments({ active: true }),
      db.collection(COLLECTIONS.services).countDocuments(),
      db.collection(COLLECTIONS.services).countDocuments({ active: true }),
      db.collection(COLLECTIONS.promotions).countDocuments(),
      db.collection(COLLECTIONS.promotions).countDocuments({ active: true }),
      db.collection(COLLECTIONS.faqs).countDocuments(),
    ])
    return json({ priceTotal, priceActive, svcTotal, svcActive, promos, activePromos, faqTotal })
  }

  if (path === 'admin/prices') {
    const items = await db.collection(COLLECTIONS.price_items).find({}).sort({ category: 1, display_order: 1 }).toArray()
    return json({ items })
  }

  if (path === 'admin/prices/export') {
    const items = await db.collection(COLLECTIONS.price_items).find({}).sort({ category: 1, display_order: 1 }).toArray()
    await writeAudit(db, 'csv_export', admin.email, { count: items.length })
    const csv = itemsToCsv(items)
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="urban-dry-clean-prices-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  if (path === 'admin/services') {
    const items = await db.collection(COLLECTIONS.services).find({}).sort({ display_order: 1 }).toArray()
    return json({ items })
  }
  if (path === 'admin/faqs') {
    const items = await db.collection(COLLECTIONS.faqs).find({}).sort({ display_order: 1 }).toArray()
    return json({ items })
  }
  if (path === 'admin/settings') {
    const doc = await db.collection(COLLECTIONS.settings).findOne({ _id: 'business' })
    return json({ settings: doc || null })
  }
  if (path === 'admin/promotions') {
    const items = await db.collection(COLLECTIONS.promotions).find({}).sort({ updated_at: -1 }).toArray()
    return json({ items })
  }

  if (path === 'admin/price-history') {
    const q = {}
    const itemId = url.searchParams.get('item_id')
    if (itemId) q.item_id = itemId
    const search = url.searchParams.get('q')
    if (search) q.item_name = { $regex: search, $options: 'i' }
    const items = await db.collection(COLLECTIONS.price_history).find(q).sort({ at: -1 }).limit(500).toArray()
    return json({ items })
  }

  if (path === 'admin/audit-log') {
    const q = {}
    const action = url.searchParams.get('action')
    if (action) q.action = action
    const user = url.searchParams.get('user')
    if (user) q.user = user
    const items = await db.collection(COLLECTIONS.audit_log).find(q).sort({ at: -1 }).limit(500).toArray()
    return json({ items })
  }

  return json({ error: 'Not found' }, 404)
}

// =====================================================================
// POST
// =====================================================================
export async function POST(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const path = p.join('/')
  const db = await getDb()

  // ---------- Auth ----------
  if (path === 'admin/login') {
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const email = String(body?.email || '').toLowerCase().trim()
    const password = String(body?.password || '')
    if (!email || !password) return json({ error: 'Email and password required' }, 400)
    const ip = clientIp(request)
    const rlKey = `${ip}:${email}`
    const rl = await checkRateLimit(db, rlKey)
    if (rl.blocked) {
      return json({ error: 'Too many attempts. Try again later.', retryAfter: Math.ceil(rl.retryAfter / 1000) }, 429)
    }
    const admin = await db.collection(COLLECTIONS.admins).findOne({ email })
    // Constant-time-ish: always compute bcrypt to avoid revealing whether email exists.
    const hash = admin?.password_hash || '$2a$10$abcdefghijklmnopqrstuu.aaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const ok = await verifyPassword(password, hash)
    if (!admin || !ok) {
      await recordFailedLogin(db, rlKey)
      return json({ error: 'Invalid credentials' }, 401)
    }
    await clearRateLimit(db, rlKey)
    const token = await signAdminToken({ sub: admin._id, email: admin.email, role: admin.role, v: admin.token_version || 0 })
    await setAuthCookie(token)
    await writeAudit(db, 'login', admin.email, { ip })
    return json({ ok: true, admin: { email: admin.email, role: admin.role } })
  }

  if (path === 'admin/logout') {
    const admin = await getCurrentAdmin()
    if (admin) await writeAudit(db, 'logout', admin.email)
    await clearAuthCookie()
    return json({ ok: true })
  }

  if (path === 'enquiry') {
    try {
      const body = await request.json()
      await db.collection('enquiries').insertOne({ _id: uuidv4(), ...body, at: new Date() })
      return json({ status: 'received', echo: body })
    } catch { return json({ error: 'Invalid payload' }, 400) }
  }

  // Everything below requires admin.
  const admin = await requireAdmin()
  if (!admin) return json({ error: 'Unauthorized' }, 401)

  if (path === 'admin/change-password') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const current = String(body?.current || '')
    const next = String(body?.next || '')
    const err = validatePasswordStrength(next)
    if (err) return json({ error: err }, 400)
    const doc = await db.collection(COLLECTIONS.admins).findOne({ email: admin.email })
    if (!doc) return json({ error: 'Not found' }, 404)
    const ok = await verifyPassword(current, doc.password_hash)
    if (!ok) return json({ error: 'Current password is incorrect' }, 401)
    const password_hash = await hashPassword(next)
    await db.collection(COLLECTIONS.admins).updateOne(
      { _id: doc._id },
      { $set: { password_hash, updated_at: new Date() }, $inc: { token_version: 1 } }
    )
    await writeAudit(db, 'password_changed', admin.email)
    await clearAuthCookie()
    return json({ ok: true, message: 'Password changed. Please log in again.' })
  }

  // ---------- Prices ----------
  if (path === 'admin/prices') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const clean = sanitizePrice(body)
    if (!clean.name || !clean.category) return json({ error: 'Name and category are required' }, 400)
    const now = new Date()
    const doc = {
      _id: uuidv4(), category: clean.category, name: clean.name,
      service_type: clean.service_type || 'Dry Cleaning',
      dc_price: clean.dc_price || '', si_price: clean.si_price || '',
      mrp: clean.mrp === undefined ? null : clean.mrp,
      discount_percent: typeof clean.discount_percent === 'number' ? clean.discount_percent : 25,
      unit: clean.unit || 'Per Piece',
      active: clean.active !== false, special: !!clean.special,
      note: clean.note || '', display_order: clean.display_order || 999,
      created_at: now, updated_at: now,
    }
    if (!doc.dc_price && doc.mrp && !String(doc.mrp).includes('/')) {
      const c = computeFinalPrice(doc.mrp, doc.discount_percent); if (c !== null) doc.dc_price = c
    }
    await db.collection(COLLECTIONS.price_items).insertOne(doc)
    await writeAudit(db, 'price_created', admin.email, { target: doc._id, name: doc.name })
    return json({ ok: true, item: doc })
  }

  // Bulk update: /admin/prices/bulk
  if (p[0] === 'admin' && p[1] === 'prices' && p[2] === 'bulk') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const ids = Array.isArray(body?.ids) ? body.ids : []
    const op = String(body?.op || '')
    const val = Number(body?.value)
    const preview = !!body?.preview
    if (!ids.length) return json({ error: 'No items selected' }, 400)
    const items = await db.collection(COLLECTIONS.price_items).find({ _id: { $in: ids } }).toArray()
    if (items.length !== ids.length) return json({ error: 'Some items not found' }, 400)

    const changes = []
    for (const it of items) {
      const change = { _id: it._id, name: it.name, old: {}, new: {} }
      if (op === 'increase' || op === 'decrease') {
        // Applies to dc_price if numeric single-value
        if (!it.dc_price || String(it.dc_price).includes('/')) { change.skipped = 'multi-variant or empty price'; changes.push(change); continue }
        const cur = Number(it.dc_price)
        if (!Number.isFinite(cur)) { change.skipped = 'non-numeric price'; changes.push(change); continue }
        const factor = op === 'increase' ? 1 + val / 100 : 1 - val / 100
        const nx = Math.round(cur * factor * 100) / 100
        change.old.dc_price = it.dc_price; change.new.dc_price = String(nx)
      } else if (op === 'set_discount') {
        if (!(val >= 0 && val <= 100)) return json({ error: 'Discount must be 0-100' }, 400)
        change.old.discount_percent = it.discount_percent; change.new.discount_percent = val
        if (it.mrp && !String(it.mrp).includes('/')) {
          const c = computeFinalPrice(it.mrp, val); if (c !== null) { change.old.dc_price = it.dc_price; change.new.dc_price = c }
        }
      } else if (op === 'enable') {
        change.old.active = it.active; change.new.active = true
      } else if (op === 'disable') {
        change.old.active = it.active; change.new.active = false
      } else {
        return json({ error: 'Unknown op' }, 400)
      }
      changes.push(change)
    }

    if (preview) return json({ preview: true, changes })

    // Commit — sequential updates + history writes
    const now = new Date()
    for (const ch of changes) {
      if (ch.skipped) continue
      const set = { ...ch.new, updated_at: now }
      await db.collection(COLLECTIONS.price_items).updateOne({ _id: ch._id }, { $set: set })
      await db.collection(COLLECTIONS.price_history).insertOne({
        _id: uuidv4(), item_id: ch._id, item_name: ch.name, old: ch.old, new: ch.new,
        user: admin.email, at: new Date(), source: 'bulk',
      })
    }
    await writeAudit(db, 'bulk_update', admin.email, { count: changes.filter(c => !c.skipped).length, op })
    return json({ ok: true, applied: changes.filter(c => !c.skipped).length, changes })
  }

  // Restore from history
  if (p[0] === 'admin' && p[1] === 'price-history' && p[3] === 'restore') {
    const historyId = p[2]
    const h = await db.collection(COLLECTIONS.price_history).findOne({ _id: historyId })
    if (!h) return json({ error: 'History entry not found' }, 404)
    const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: h.item_id })
    if (!existing) return json({ error: 'Original item not found' }, 404)
    const restoreValues = h.old || {}
    const now = new Date()
    await db.collection(COLLECTIONS.price_items).updateOne({ _id: h.item_id }, { $set: { ...restoreValues, updated_at: now } })
    await db.collection(COLLECTIONS.price_history).insertOne({
      _id: uuidv4(), item_id: h.item_id, item_name: existing.name,
      old: { dc_price: existing.dc_price, si_price: existing.si_price, mrp: existing.mrp, discount_percent: existing.discount_percent, active: existing.active },
      new: restoreValues, user: admin.email, at: new Date(), source: 'restore',
    })
    await writeAudit(db, 'price_restored', admin.email, { target: h.item_id, from_history: historyId })
    return json({ ok: true })
  }

  // CSV import preview
  if (path === 'admin/prices/import-preview') {
    const form = await request.formData().catch(() => null)
    if (!form) return json({ error: 'No file uploaded' }, 400)
    const file = form.get('file')
    if (!file || typeof file === 'string') return json({ error: 'No file uploaded' }, 400)
    const text = await file.text()
    const { headers, data } = parseCsv(text)
    const missing = REQUIRED_IMPORT_COLUMNS.filter(c => !headers.includes(c))
    if (missing.length) return json({ error: `Missing required columns: ${missing.join(', ')}` }, 400)
    const existingById = new Map()
    const allExisting = await db.collection(COLLECTIONS.price_items).find({}).toArray()
    allExisting.forEach(i => existingById.set(i._id, i))
    const errors = [], newRows = [], updates = [], unchanged = []
    data.forEach((row, idx) => {
      const rowNum = idx + 2 // header is row 1
      if (!row.category || !row.name) { errors.push({ row: rowNum, error: 'category and name are required' }); return }
      if (row.discount_percent && (isNaN(Number(row.discount_percent)) || Number(row.discount_percent) < 0 || Number(row.discount_percent) > 100)) {
        errors.push({ row: rowNum, error: 'discount_percent must be 0-100' }); return
      }
      const id = row.id?.trim()
      const parsed = {
        category: row.category.trim(),
        name: row.name.trim(),
        service_type: row.service_type?.trim() || 'Dry Cleaning',
        mrp: row.mrp?.trim() || null,
        discount_percent: row.discount_percent ? Number(row.discount_percent) : 25,
        dc_price: row.dc_price?.trim() || '',
        si_price: row.si_price?.trim() || '',
        unit: row.unit?.trim() || 'Per Piece',
        active: row.active?.trim().toLowerCase() !== 'false',
        special: row.special?.trim().toLowerCase() === 'true',
        display_order: row.display_order ? Number(row.display_order) : 999,
      }
      if (id && existingById.has(id)) {
        const ex = existingById.get(id)
        const changed = Object.keys(parsed).some(k => String(parsed[k] ?? '') !== String(ex[k] ?? ''))
        if (changed) updates.push({ id, row: rowNum, current: ex, next: parsed })
        else unchanged.push({ id, row: rowNum })
      } else {
        newRows.push({ row: rowNum, next: parsed })
      }
    })
    return json({ preview: true, errors, newRows, updates, unchanged, total: data.length })
  }

  // CSV import commit
  if (path === 'admin/prices/import-commit') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const newRows = Array.isArray(body?.newRows) ? body.newRows : []
    const updates = Array.isArray(body?.updates) ? body.updates : []
    const now = new Date()
    // Sequential (Mongo standalone has no txn); still emit history for every change.
    let applied = 0
    try {
      for (const n of newRows) {
        const doc = { _id: uuidv4(), ...n.next, created_at: now, updated_at: now }
        if (!doc.dc_price && doc.mrp && !String(doc.mrp).includes('/')) {
          const c = computeFinalPrice(doc.mrp, doc.discount_percent); if (c !== null) doc.dc_price = c
        }
        await db.collection(COLLECTIONS.price_items).insertOne(doc)
        applied++
      }
      for (const u of updates) {
        const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: u.id })
        if (!existing) continue
        await db.collection(COLLECTIONS.price_items).updateOne({ _id: u.id }, { $set: { ...u.next, updated_at: now } })
        await db.collection(COLLECTIONS.price_history).insertOne({
          _id: uuidv4(), item_id: u.id, item_name: existing.name,
          old: { dc_price: existing.dc_price, si_price: existing.si_price, mrp: existing.mrp, discount_percent: existing.discount_percent, active: existing.active },
          new: u.next, user: admin.email, at: new Date(), source: 'csv_import',
        })
        applied++
      }
      await writeAudit(db, 'csv_import', admin.email, { applied, new: newRows.length, updated: updates.length })
      return json({ ok: true, applied })
    } catch (e) {
      return json({ error: `Import failed: ${e.message}` }, 500)
    }
  }

  // ---------- Services ----------
  if (path === 'admin/services') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const name = String(body?.name || '').trim()
    if (!name) return json({ error: 'Name required' }, 400)
    const slug = String(body?.slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const now = new Date()
    const doc = {
      _id: uuidv4(), slug, name,
      desc: String(body?.desc || '').trim(),
      long_desc: String(body?.long_desc || '').trim(),
      icon: String(body?.icon || 'Shirt').trim(),
      active: body?.active !== false,
      display_order: Number(body?.display_order) || 999,
      created_at: now, updated_at: now,
    }
    try { await db.collection(COLLECTIONS.services).insertOne(doc) }
    catch (e) { return json({ error: 'Slug must be unique' }, 400) }
    await writeAudit(db, 'service_created', admin.email, { target: doc._id, name })
    return json({ ok: true, item: doc })
  }

  // ---------- FAQs ----------
  if (path === 'admin/faqs') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const q = String(body?.q || '').trim()
    const a = String(body?.a || '').trim()
    if (!q || !a) return json({ error: 'Question and answer are required' }, 400)
    const now = new Date()
    const doc = { _id: uuidv4(), q, a, active: body?.active !== false, display_order: Number(body?.display_order) || 999, created_at: now, updated_at: now }
    await db.collection(COLLECTIONS.faqs).insertOne(doc)
    await writeAudit(db, 'faq_created', admin.email, { target: doc._id })
    return json({ ok: true, item: doc })
  }

  // ---------- Promotions ----------
  if (path === 'admin/promotions') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const doc = {
      _id: uuidv4(),
      title: String(body?.title || '').trim(),
      description: String(body?.description || '').trim(),
      discount_percent: Number(body?.discount_percent) || 0,
      applies_to: String(body?.applies_to || 'Dry Cleaning').trim(),
      active: !!body?.active,
      start_date: body?.start_date || null,
      end_date: body?.end_date || null,
      created_at: new Date(), updated_at: new Date(),
    }
    if (!doc.title) return json({ error: 'Title is required' }, 400)
    await db.collection(COLLECTIONS.promotions).insertOne(doc)
    await writeAudit(db, 'promotion_created', admin.email, { target: doc._id })
    return json({ ok: true, item: doc })
  }

  return json({ error: 'Not found' }, 404)
}

// =====================================================================
// PUT
// =====================================================================
export async function PUT(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const db = await getDb()
  const admin = await requireAdmin()
  if (!admin) return json({ error: 'Unauthorized' }, 401)

  // Prices
  if (p[0] === 'admin' && p[1] === 'prices' && p[2] && p[2] !== 'bulk' && p[2] !== 'import-preview' && p[2] !== 'import-commit') {
    const id = p[2]
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    if (!existing) return json({ error: 'Not found' }, 404)
    const clean = sanitizePrice(body)
    if (clean.discount_percent !== undefined && (clean.mrp || existing.mrp) && !String(clean.mrp || existing.mrp).includes('/')) {
      const c = computeFinalPrice(clean.mrp || existing.mrp, clean.discount_percent)
      if (c !== null) clean.dc_price = clean.dc_price || c
    }
    clean.updated_at = new Date()
    await db.collection(COLLECTIONS.price_items).updateOne({ _id: id }, { $set: clean })
    await db.collection(COLLECTIONS.price_history).insertOne({
      _id: uuidv4(), item_id: id, item_name: existing.name,
      old: { dc_price: existing.dc_price, si_price: existing.si_price, mrp: existing.mrp, discount_percent: existing.discount_percent, active: existing.active },
      new: clean, user: admin.email, at: new Date(), source: 'edit',
    })
    await writeAudit(db, 'price_updated', admin.email, { target: id, name: existing.name })
    const item = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    return json({ ok: true, item })
  }

  // Settings (single doc)
  if (p[0] === 'admin' && p[1] === 'settings') {
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const allowed = ['business_name','phone','whatsapp','address_line1','address_line2','city','state','pin','service_area','maps_url','hours','website']
    const set = { updated_at: new Date() }
    for (const k of allowed) if (typeof body[k] === 'string') set[k] = body[k].trim()
    await db.collection(COLLECTIONS.settings).updateOne({ _id: 'business' }, { $set: set }, { upsert: true })
    await writeAudit(db, 'settings_updated', admin.email, { fields: Object.keys(set).filter(k => k !== 'updated_at') })
    const doc = await db.collection(COLLECTIONS.settings).findOne({ _id: 'business' })
    return json({ ok: true, settings: doc })
  }

  // Services
  if (p[0] === 'admin' && p[1] === 'services' && p[2]) {
    const id = p[2]
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const set = { updated_at: new Date() }
    for (const k of ['name','desc','long_desc','icon']) if (typeof body[k] === 'string') set[k] = body[k].trim()
    if (typeof body.slug === 'string' && body.slug.trim()) set.slug = body.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (typeof body.active === 'boolean') set.active = body.active
    if (typeof body.display_order === 'number') set.display_order = body.display_order
    const r = await db.collection(COLLECTIONS.services).updateOne({ _id: id }, { $set: set })
    if (r.matchedCount === 0) return json({ error: 'Not found' }, 404)
    await writeAudit(db, 'service_updated', admin.email, { target: id })
    return json({ ok: true })
  }

  // FAQs
  if (p[0] === 'admin' && p[1] === 'faqs' && p[2]) {
    const id = p[2]
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const set = { updated_at: new Date() }
    for (const k of ['q','a']) if (typeof body[k] === 'string') set[k] = body[k].trim()
    if (typeof body.active === 'boolean') set.active = body.active
    if (typeof body.display_order === 'number') set.display_order = body.display_order
    const r = await db.collection(COLLECTIONS.faqs).updateOne({ _id: id }, { $set: set })
    if (r.matchedCount === 0) return json({ error: 'Not found' }, 404)
    await writeAudit(db, 'faq_updated', admin.email, { target: id })
    return json({ ok: true })
  }

  // Promotions
  if (p[0] === 'admin' && p[1] === 'promotions' && p[2]) {
    const id = p[2]
    let body; try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const set = { updated_at: new Date() }
    for (const k of ['title','description','applies_to','start_date','end_date']) if (typeof body[k] === 'string') set[k] = body[k].trim()
    if (typeof body.discount_percent === 'number' && body.discount_percent >= 0 && body.discount_percent <= 100) set.discount_percent = body.discount_percent
    if (typeof body.active === 'boolean') {
      set.active = body.active
      // Only one active promotion at a time — if activating, deactivate others.
      if (body.active) await db.collection(COLLECTIONS.promotions).updateMany({ _id: { $ne: id } }, { $set: { active: false, updated_at: new Date() } })
    }
    const r = await db.collection(COLLECTIONS.promotions).updateOne({ _id: id }, { $set: set })
    if (r.matchedCount === 0) return json({ error: 'Not found' }, 404)
    await writeAudit(db, 'promotion_updated', admin.email, { target: id, active: set.active })
    return json({ ok: true })
  }

  return json({ error: 'Not found' }, 404)
}

// =====================================================================
// DELETE
// =====================================================================
export async function DELETE(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const db = await getDb()
  const admin = await requireAdmin()
  if (!admin) return json({ error: 'Unauthorized' }, 401)

  if (p[0] === 'admin' && p[1] === 'prices' && p[2]) {
    const id = p[2]
    const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    if (!existing) return json({ error: 'Not found' }, 404)
    await db.collection(COLLECTIONS.price_items).deleteOne({ _id: id })
    await writeAudit(db, 'price_deleted', admin.email, { target: id, name: existing.name })
    return json({ ok: true })
  }
  if (p[0] === 'admin' && p[1] === 'services' && p[2]) {
    const id = p[2]
    const existing = await db.collection(COLLECTIONS.services).findOne({ _id: id })
    if (!existing) return json({ error: 'Not found' }, 404)
    await db.collection(COLLECTIONS.services).deleteOne({ _id: id })
    await writeAudit(db, 'service_deleted', admin.email, { target: id, name: existing.name })
    return json({ ok: true })
  }
  if (p[0] === 'admin' && p[1] === 'faqs' && p[2]) {
    const id = p[2]
    await db.collection(COLLECTIONS.faqs).deleteOne({ _id: id })
    await writeAudit(db, 'faq_deleted', admin.email, { target: id })
    return json({ ok: true })
  }
  if (p[0] === 'admin' && p[1] === 'promotions' && p[2]) {
    const id = p[2]
    await db.collection(COLLECTIONS.promotions).deleteOne({ _id: id })
    await writeAudit(db, 'promotion_deleted', admin.email, { target: id })
    return json({ ok: true })
  }
  return json({ error: 'Not found' }, 404)
}
