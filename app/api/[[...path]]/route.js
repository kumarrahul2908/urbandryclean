import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDb, COLLECTIONS } from '@/lib/mongodb'
import { ensureSeeded } from '@/lib/seed'
import {
  hashPassword, verifyPassword, signAdminToken, verifyAdminToken,
  setAuthCookie, clearAuthCookie, getCurrentAdmin, AUTH_COOKIE
} from '@/lib/auth'

function json(data, status = 200) { return NextResponse.json(data, { status }) }
async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) return null
  return admin
}

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

// Compute discounted price when a single numeric MRP is available.
function computeFinalPrice(mrp, pct) {
  const n = Number(mrp)
  if (Number.isFinite(n) && Number.isFinite(pct)) {
    return String(Math.round((n - (n * pct) / 100) * 100) / 100)
  }
  return null
}

async function bootIfNeeded() {
  try { await ensureSeeded() } catch (e) { console.error('Seed error:', e) }
}

// ---------------- GET ----------------
export async function GET(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const path = p.join('/')
  const db = await getDb()

  if (path === '' || path === 'health') {
    return json({ status: 'ok', service: 'Urban Dry Clean', timestamp: new Date().toISOString() })
  }

  if (path === 'admin/me') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    return json({ admin: { email: admin.email, role: admin.role } })
  }

  if (path === 'admin/prices') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    const items = await db.collection(COLLECTIONS.price_items).find({}).sort({ category: 1, display_order: 1 }).toArray()
    return json({ items })
  }

  if (path === 'admin/stats') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
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

  if (path === 'admin/price-history') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    const items = await db.collection(COLLECTIONS.price_history).find({}).sort({ at: -1 }).limit(200).toArray()
    return json({ items })
  }

  // Public endpoints
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

  return json({ error: 'Not found' }, 404)
}

// ---------------- POST ----------------
export async function POST(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const path = p.join('/')
  const db = await getDb()

  if (path === 'admin/login') {
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const email = String(body?.email || '').toLowerCase().trim()
    const password = String(body?.password || '')
    if (!email || !password) return json({ error: 'Email and password required' }, 400)
    const admin = await db.collection(COLLECTIONS.admins).findOne({ email })
    if (!admin) return json({ error: 'Invalid credentials' }, 401)
    const ok = await verifyPassword(password, admin.password_hash)
    if (!ok) return json({ error: 'Invalid credentials' }, 401)
    const token = await signAdminToken({ sub: admin._id, email: admin.email, role: admin.role })
    await setAuthCookie(token)
    await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'login', user: admin.email, at: new Date() })
    return json({ ok: true, admin: { email: admin.email, role: admin.role } })
  }

  if (path === 'admin/logout') {
    const admin = await getCurrentAdmin()
    if (admin) await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'logout', user: admin.email, at: new Date() })
    await clearAuthCookie()
    return json({ ok: true })
  }

  if (path === 'admin/change-password') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const current = String(body?.current || '')
    const next = String(body?.next || '')
    if (next.length < 8) return json({ error: 'New password must be at least 8 characters' }, 400)
    const doc = await db.collection(COLLECTIONS.admins).findOne({ email: admin.email })
    if (!doc) return json({ error: 'Not found' }, 404)
    const ok = await verifyPassword(current, doc.password_hash)
    if (!ok) return json({ error: 'Current password is incorrect' }, 401)
    const password_hash = await hashPassword(next)
    await db.collection(COLLECTIONS.admins).updateOne({ _id: doc._id }, { $set: { password_hash, updated_at: new Date() } })
    await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'password_changed', user: admin.email, at: new Date() })
    return json({ ok: true })
  }

  if (path === 'admin/prices') {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const clean = sanitizePrice(body)
    if (!clean.name || !clean.category) return json({ error: 'Name and category are required' }, 400)
    const now = new Date()
    const doc = {
      _id: uuidv4(),
      category: clean.category,
      name: clean.name,
      service_type: clean.service_type || 'Dry Cleaning',
      dc_price: clean.dc_price || '',
      si_price: clean.si_price || '',
      mrp: clean.mrp === undefined ? null : clean.mrp,
      discount_percent: typeof clean.discount_percent === 'number' ? clean.discount_percent : 25,
      unit: clean.unit || 'Per Piece',
      active: clean.active !== false,
      special: !!clean.special,
      note: clean.note || '',
      display_order: clean.display_order || 999,
      created_at: now, updated_at: now,
    }
    // If dc_price wasn't provided but a single-value mrp is, compute automatically
    if (!doc.dc_price && doc.mrp && !String(doc.mrp).includes('/')) {
      const computed = computeFinalPrice(doc.mrp, doc.discount_percent)
      if (computed !== null) doc.dc_price = computed
    }
    await db.collection(COLLECTIONS.price_items).insertOne(doc)
    await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'price_created', user: admin.email, target: doc._id, at: new Date() })
    return json({ ok: true, item: doc })
  }

  if (path === 'enquiry') {
    try {
      const body = await request.json()
      await db.collection('enquiries').insertOne({ _id: uuidv4(), ...body, at: new Date() })
      return json({ status: 'received', echo: body })
    } catch { return json({ error: 'Invalid payload' }, 400) }
  }

  return json({ error: 'Not found' }, 404)
}

// ---------------- PUT ----------------
export async function PUT(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  const path = p.join('/')
  const db = await getDb()

  // /api/admin/prices/:id
  if (p[0] === 'admin' && p[1] === 'prices' && p[2]) {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    let body
    try { body = await request.json() } catch { return json({ error: 'Invalid payload' }, 400) }
    const id = p[2]
    const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    if (!existing) return json({ error: 'Not found' }, 404)
    const clean = sanitizePrice(body)
    // Auto-compute dc_price when discount changed and mrp is a single number
    if (clean.discount_percent !== undefined && (clean.mrp || existing.mrp) && !String(clean.mrp || existing.mrp).includes('/')) {
      const computed = computeFinalPrice(clean.mrp || existing.mrp, clean.discount_percent)
      if (computed !== null) clean.dc_price = clean.dc_price || computed
    }
    clean.updated_at = new Date()
    await db.collection(COLLECTIONS.price_items).updateOne({ _id: id }, { $set: clean })
    await db.collection(COLLECTIONS.price_history).insertOne({
      _id: uuidv4(), item_id: id, item_name: existing.name,
      old: { dc_price: existing.dc_price, si_price: existing.si_price, mrp: existing.mrp, discount_percent: existing.discount_percent, active: existing.active },
      new: clean, user: admin.email, at: new Date(),
    })
    await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'price_updated', user: admin.email, target: id, at: new Date() })
    const item = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    return json({ ok: true, item })
  }

  return json({ error: 'Not found' }, 404)
}

// ---------------- DELETE ----------------
export async function DELETE(request, { params }) {
  await bootIfNeeded()
  const p = (await params)?.path || []
  if (p[0] === 'admin' && p[1] === 'prices' && p[2]) {
    const admin = await requireAdmin()
    if (!admin) return json({ error: 'Unauthorized' }, 401)
    const db = await getDb()
    const id = p[2]
    const existing = await db.collection(COLLECTIONS.price_items).findOne({ _id: id })
    if (!existing) return json({ error: 'Not found' }, 404)
    await db.collection(COLLECTIONS.price_items).deleteOne({ _id: id })
    await db.collection(COLLECTIONS.audit_log).insertOne({ _id: uuidv4(), action: 'price_deleted', user: admin.email, target: id, target_name: existing.name, at: new Date() })
    return json({ ok: true })
  }
  return json({ error: 'Not found' }, 404)
}
