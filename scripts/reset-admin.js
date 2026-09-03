// Reset admin password to the env-configured default.
const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

;(async () => {
  const c = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
  await c.connect()
  const db = c.db(process.env.DB_NAME || 'urban_dry_clean')
  const email = (process.env.ADMIN_EMAIL || 'admin@urbandryclean.in').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || 'UrbanAdmin@2026'
  const hash = await bcrypt.hash(password, 10)
  const r = await db.collection('admins').updateOne(
    { email },
    { $set: { password_hash: hash, updated_at: new Date() }, $inc: { token_version: 1 } }
  )
  console.log('Reset admin password for', email, 'matched:', r.matchedCount)
  // Also clear any lingering rate-limit blocks
  const del = await db.collection('login_attempts').deleteMany({})
  console.log('Cleared', del.deletedCount, 'rate-limit records')
  await c.close()
})().catch(e => { console.error(e); process.exit(1) })
