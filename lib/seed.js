import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { getDb, COLLECTIONS } from './mongodb'

// Existing approved price list — preserved verbatim from /app/lib/pricelist.js.
const SEED_PRICES = [
  // MEN'S WEAR
  { category: 'mens',  name: 'Shirt / T-Shirt',                     dc: '105',       si: '49',         mrp: '140',      order: 1 },
  { category: 'mens',  name: 'Trouser / Pant',                      dc: '113',       si: '59',         mrp: '150',      order: 2 },
  { category: 'mens',  name: 'Pyjama / Dhoti',                      dc: '98',        si: '59',         mrp: '130',      order: 3 },
  { category: 'mens',  name: 'Jeans',                               dc: '113',       si: '69',         mrp: '150',      order: 4 },
  { category: 'mens',  name: 'Shorts',                              dc: '90',        si: '49',         mrp: '120',      order: 5 },
  { category: 'mens',  name: 'Kurta (Plain / Embroidered)',         dc: '120 / 299', si: '59 / 149',   mrp: '160',      order: 6 },
  { category: 'mens',  name: 'Waistcoat',                           dc: '187',       si: '120',        mrp: '249',      order: 7 },
  { category: 'mens',  name: 'Sweater / Sweatshirt',                dc: '187',       si: '120',        mrp: '249',      order: 8 },
  { category: 'mens',  name: 'Coat / Blazer',                       dc: '299',       si: '169',        mrp: '399',      order: 9 },
  { category: 'mens',  name: 'Jacket (Non Leather / Leather)',      dc: '299 / 749', si: '149 / 499',  mrp: '399 / 999',order: 10 },
  { category: 'mens',  name: 'Suit (2 Piece / 3 Piece)',            dc: '374 / 524', si: '229 / 349',  mrp: '499 / 699',order: 11 },
  { category: 'mens',  name: 'Sherwani',                            dc: '749',       si: '399',        mrp: '999',      order: 12 },
  { category: 'mens',  name: 'Long Coat / Overcoat',                dc: '374',       si: '249',        mrp: '499',      order: 13 },
  // WOMEN'S WEAR
  { category: 'womens', name: 'Top / Shirt / T-Shirt (Plain)',              dc: '105',        si: '49',           mrp: '140',       order: 1 },
  { category: 'womens', name: 'Trouser / Palazzo',                          dc: '113',        si: '59',           mrp: '150',       order: 2 },
  { category: 'womens', name: 'Salwar / Churidar / Pyjama (Plain)',         dc: '98',         si: '59',           mrp: '130',       order: 3 },
  { category: 'womens', name: 'Jeans',                                      dc: '113',        si: '69',           mrp: '150',       order: 4 },
  { category: 'womens', name: 'Kurta / Kurti (Plain / Embroidered)',        dc: '120 / 299',  si: '59 / 149',     mrp: '160 / 399', order: 5 },
  { category: 'womens', name: 'Skirt Plain (Short / Long)',                 dc: '120 / 199',  si: '79 / 125',     mrp: '160 / 265', order: 6 },
  { category: 'womens', name: 'Saree (Plain / Embroidered)',                dc: '199 / 399',  si: '99 / 199',     mrp: '249 / 499', order: 7 },
  { category: 'womens', name: 'Saree Silk',                                 dc: '249',        si: '125',          mrp: '299',       order: 8 },
  { category: 'womens', name: 'Coat / Blazer',                              dc: '299',        si: '169',          mrp: '399',       order: 9 },
  { category: 'womens', name: 'Sweater / Sweatshirt',                       dc: '187',        si: '120',          mrp: '249',       order: 10 },
  { category: 'womens', name: 'Ladies 2 pc Suit (Indianwear) (Plain / With Work)', dc: '217 / 299', si: '125',   mrp: '289 / 399', order: 11 },
  { category: 'womens', name: 'Jacket (Non Leather / Leather)',             dc: '299 / 749',  si: '149 / 499',    mrp: '399 / 999', order: 12 },
  { category: 'womens', name: 'Lehenga (Plain / Embroidered)',              dc: '499 / 749',  si: '249 / 399',    mrp: '665 / 999', order: 13 },
  { category: 'womens', name: 'Lehenga — Bridal',                           dc: '1499',       si: '799',          mrp: '1499',      order: 14 },
  { category: 'womens', name: 'Shawl (Light / Medium / Heavy)',             dc: '249 / 349 / 449', si: '149 / 199 / 249', mrp: '315 / 465 / 599', order: 15 },
  { category: 'womens', name: 'Shawl Pashmina',                             dc: '1099',       si: '499',          mrp: '—',         order: 16 },
  { category: 'womens', name: 'Choli (Plain / Medium / Heavy)',             dc: '149 / 249 / 399', si: '79 / 125 / 199', mrp: '—',   order: 17 },
  { category: 'womens', name: 'Blouse / Dupatta (Plain / Medium / Heavy)',  dc: '90 / 199 / 299',  si: '49 / 125 / 199',  mrp: '120 / 265 / 399', order: 18 },
  { category: 'womens', name: 'Long Coat / Overcoat',                       dc: '374',        si: '249',          mrp: '499',       order: 19 },
  { category: 'womens', name: 'Polishing — Saree',                          dc: '200',        si: '—',            mrp: '—',         order: 20 },
  // HOUSEHOLD
  { category: 'household', name: 'Blinds Per Panel',                        dc: '149',       si: '79',   mrp: null, order: 1 },
  { category: 'household', name: 'Curtain Per Panel (Plain / Lining)',      dc: '199 / 299', si: '99 / 149', mrp: null, order: 2 },
  { category: 'household', name: 'Bedsheet (Single / Double)',              dc: '199 / 249', si: '99 / 125', mrp: null, order: 3 },
  { category: 'household', name: 'Dohar',                                   dc: '249',       si: '120',  mrp: null, order: 4 },
  { category: 'household', name: 'Blanket (Single / Double)',               dc: '299 / 374', si: '199 / 249', mrp: null, order: 5, special: true },
  { category: 'household', name: 'Quilt (Single / Double)',                 dc: '337 / 412', si: '220 / 279', mrp: null, order: 6, special: true },
  { category: 'household', name: 'Pillow / Cushion Cover',                  dc: '99',        si: '49',   mrp: null, order: 7 },
  { category: 'household', name: 'Pillow / Cushion',                        dc: '199',       si: '99',   mrp: null, order: 8 },
  { category: 'household', name: 'Table Cover / Cloth',                     dc: '149',       si: '75',   mrp: null, order: 9 },
  { category: 'household', name: 'Towel Hand',                              dc: '49',        si: '35',   mrp: null, order: 10 },
  { category: 'household', name: 'Towel Bath',                              dc: '99',        si: '49',   mrp: null, order: 11 },
  { category: 'household', name: 'Dhurrie / Rug',                           dc: '399',       si: '199',  mrp: null, order: 12 },
  { category: 'household', name: 'Carpet / sq. ft.',                        dc: '39',        si: '—',    mrp: null, order: 13 },
]

const SEED_SERVICES = [
  { slug: 'dry-cleaning',      name: 'Dry Cleaning',            desc: 'Solvent-based cleaning for delicate and formal garments.',          icon: 'Shirt',          order: 1 },
  { slug: 'laundry',           name: 'Laundry',                 desc: 'Everyday wash, dry and fold for regular wear.',                    icon: 'WashingMachine', order: 2 },
  { slug: 'steam-iron',        name: 'Steam Iron',              desc: 'Crisp, wrinkle-free finishing for shirts, trousers and more.',     icon: 'Wind',           order: 3 },
  { slug: 'blanket-cleaning',  name: 'Blanket Cleaning',        desc: 'Thorough cleaning for single, double and heavy blankets.',         icon: 'Bed',            order: 4 },
  { slug: 'quilt-cleaning',    name: 'Quilt / Rajai Cleaning',  desc: 'Careful cleaning for quilts and rajais of all sizes.',             icon: 'Layers',         order: 5 },
  { slug: 'saree-cleaning',    name: 'Saree Cleaning',          desc: 'Gentle care for sarees, including delicate silk and embroidery.',  icon: 'Crown',          order: 6 },
  { slug: 'suit-blazer',       name: 'Suit & Blazer Cleaning',  desc: 'Professional dry cleaning and pressing for suits and blazers.',    icon: 'Briefcase',      order: 7 },
  { slug: 'jacket-coat',       name: 'Jacket & Coat Cleaning',  desc: 'Care for jackets, coats and heavy winterwear.',                    icon: 'Wand2',          order: 8 },
  { slug: 'curtain-cleaning',  name: 'Curtain Cleaning',        desc: 'Cleaning for curtains and drapes of various fabrics.',             icon: 'Scissors',       order: 9 },
  { slug: 'carpet-cleaning',   name: 'Carpet Cleaning',         desc: 'Cleaning for rugs and carpets to refresh your interiors.',         icon: 'HomeIcon',       order: 10 },
]

const SEED_FAQS = [
  { q: 'Do you offer pickup and delivery?', a: 'Yes, Urban Dry Clean offers doorstep pickup and delivery within our service area. Availability depends on your location and operational availability — please confirm on WhatsApp when booking.', order: 1 },
  { q: 'How can I book a pickup?',          a: 'You can book a pickup by sending a WhatsApp message to +91 97101 08181 or by calling the same number. Our team will confirm the pickup time and other details.', order: 2 },
  { q: 'How can I check the price?',        a: 'Visit our Price List page for current rates. For item-specific queries, message us on WhatsApp and we will share the confirmed price.', order: 3 },
  { q: 'Do you clean blankets and quilts?', a: 'Yes, we clean single and double blankets, quilts and rajais. Current rates are listed under the Household section of the Price List.', order: 4 },
  { q: 'Do you clean suits and blazers?',   a: 'Yes, we dry clean suits (2-piece and 3-piece), blazers and coats with careful handling and neat finishing.', order: 5 },
  { q: 'Do you clean sarees?',              a: 'Yes, we clean sarees including plain, embroidered and silk sarees. Prices vary by fabric and work.', order: 6 },
  { q: 'How can I contact Urban Dry Clean?', a: 'Phone / WhatsApp: +91 97101 08181. Address: SF-17, Eros Mart, Eros Sampoornam, Sector 2, Patwari, Greater Noida, Uttar Pradesh 201306.', order: 7 },
  { q: 'Where is Urban Dry Clean located?', a: 'SF-17, Eros Mart, Eros Sampoornam, Sector 2, Patwari, Greater Noida, Uttar Pradesh 201306.', order: 8 },
  { q: 'Which areas do you serve?',         a: 'We primarily serve Greater Noida West and nearby areas. Please share your location on WhatsApp to confirm service availability.', order: 9 },
  { q: 'How can I get the latest price list?', a: 'You can view the latest price list on our Price List page, or request the current rates on WhatsApp.', order: 10 },
]

const SEED_SETTINGS = {
  business_name: 'Urban Dry Clean',
  phone: '+91 97101 08181',
  whatsapp: '+91 97101 08181',
  address_line1: 'Shop SF17, 2nd Floor, S-Mart Eros Sampoornam',
  address_line2: 'Sector 2, Patwari, Greater Noida',
  city: 'Greater Noida',
  state: 'Uttar Pradesh',
  pin: '201306',
  service_area: 'Greater Noida West',
  maps_url: '',
  hours: '',
}

const SEED_PROMOTION = {
  title: 'FLAT 25% OFF',
  description: 'On All Dry-Cleaning Items',
  discount_percent: 25,
  applies_to: 'Dry Cleaning',
  active: true,
  start_date: null,
  end_date: null,
}

let seedRunning = null

export async function ensureSeeded() {
  if (seedRunning) return seedRunning
  seedRunning = (async () => {
    const db = await getDb()
    const meta = await db.collection(COLLECTIONS.seed_meta).findOne({ _id: 'v1' })
    if (meta?.done) return { seeded: false }

    // Create indexes
    await db.collection(COLLECTIONS.admins).createIndex({ email: 1 }, { unique: true })
    await db.collection(COLLECTIONS.price_items).createIndex({ category: 1, display_order: 1 })
    await db.collection(COLLECTIONS.services).createIndex({ slug: 1 }, { unique: true })

    // Seed admin
    const email = (process.env.ADMIN_EMAIL || 'admin@urbandryclean.in').toLowerCase().trim()
    const password = process.env.ADMIN_PASSWORD || 'UrbanAdmin@2026'
    const existing = await db.collection(COLLECTIONS.admins).findOne({ email })
    if (!existing) {
      const password_hash = await bcrypt.hash(password, 10)
      await db.collection(COLLECTIONS.admins).insertOne({
        _id: uuidv4(), email, password_hash,
        role: 'super', created_at: new Date(), updated_at: new Date(),
      })
    }

    // Seed prices (only if collection is empty)
    const priceCount = await db.collection(COLLECTIONS.price_items).countDocuments()
    if (priceCount === 0) {
      const now = new Date()
      const docs = SEED_PRICES.map(p => ({
        _id: uuidv4(),
        category: p.category,
        name: p.name,
        service_type: 'Dry Cleaning',
        dc_price: p.dc,
        si_price: p.si,
        mrp: p.mrp,
        discount_percent: 25,
        variants: p.name.includes('/') ? null : null,
        unit: 'Per Piece',
        active: true,
        special: !!p.special,
        note: '',
        display_order: p.order,
        created_at: now,
        updated_at: now,
      }))
      await db.collection(COLLECTIONS.price_items).insertMany(docs)
    }

    // Seed services
    const svcCount = await db.collection(COLLECTIONS.services).countDocuments()
    if (svcCount === 0) {
      const now = new Date()
      await db.collection(COLLECTIONS.services).insertMany(
        SEED_SERVICES.map(s => ({ _id: uuidv4(), ...s, active: true, created_at: now, updated_at: now }))
      )
    }

    // Seed FAQs
    const faqCount = await db.collection(COLLECTIONS.faqs).countDocuments()
    if (faqCount === 0) {
      const now = new Date()
      await db.collection(COLLECTIONS.faqs).insertMany(
        SEED_FAQS.map(f => ({ _id: uuidv4(), q: f.q, a: f.a, active: true, display_order: f.order, created_at: now, updated_at: now }))
      )
    }

    // Seed settings
    const settingsDoc = await db.collection(COLLECTIONS.settings).findOne({ _id: 'business' })
    if (!settingsDoc) {
      await db.collection(COLLECTIONS.settings).insertOne({ _id: 'business', ...SEED_SETTINGS, updated_at: new Date() })
    }

    // Seed promotion
    const promoCount = await db.collection(COLLECTIONS.promotions).countDocuments()
    if (promoCount === 0) {
      await db.collection(COLLECTIONS.promotions).insertOne({
        _id: uuidv4(), ...SEED_PROMOTION, created_at: new Date(), updated_at: new Date(),
      })
    }

    await db.collection(COLLECTIONS.seed_meta).updateOne(
      { _id: 'v1' }, { $set: { done: true, at: new Date() } }, { upsert: true }
    )
    return { seeded: true }
  })()
  try { return await seedRunning } finally { seedRunning = null }
}
