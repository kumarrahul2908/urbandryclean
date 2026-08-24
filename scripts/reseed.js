// One-time cleanup: force re-seed of settings/faqs with corrected 201318 address.
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

;(async () => {
  const c = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
  await c.connect()
  const db = c.db(process.env.DB_NAME || 'urban_dry_clean')
  await db.collection('settings').deleteOne({ _id: 'business' })
  await db.collection('faqs').updateOne({ display_order: 7 }, { $set: { a: 'Phone / WhatsApp: +91 97101 08181. Address: SF-17, Eros Mart, Eros Sampoornam, Sector 2, Greater Noida West, Uttar Pradesh 201318.' } })
  await db.collection('faqs').updateOne({ display_order: 8 }, { $set: { a: 'SF-17, Eros Mart, Eros Sampoornam, Sector 2, Greater Noida West, Uttar Pradesh 201318.' } })
  await db.collection('seed_meta').deleteOne({ _id: 'v1' })
  console.log('Cleanup done. Next API call will re-seed settings.')
  await c.close()
})().catch(e => { console.error(e); process.exit(1) })
