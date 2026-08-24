import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URL
const dbName = process.env.DB_NAME || 'urban_dry_clean'

if (!uri) throw new Error('MONGO_URL is not set')

let cached = globalThis._mongo
if (!cached) {
  cached = globalThis._mongo = { client: null, promise: null }
}

export async function getDb() {
  if (cached.client) return cached.client.db(dbName)
  if (!cached.promise) {
    cached.promise = new MongoClient(uri, { maxPoolSize: 10 }).connect()
  }
  cached.client = await cached.promise
  return cached.client.db(dbName)
}

export const COLLECTIONS = {
  admins: 'admins',
  price_items: 'price_items',
  services: 'services',
  faqs: 'faqs',
  promotions: 'promotions',
  settings: 'settings',
  price_history: 'price_history',
  audit_log: 'audit_log',
  seed_meta: 'seed_meta',
}
