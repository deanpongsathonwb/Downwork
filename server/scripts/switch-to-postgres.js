/**
 * Switch Prisma schema from SQLite to PostgreSQL for deployment.
 * Usage: node scripts/switch-to-postgres.js
 * 
 * This replaces:
 * 1. provider = "sqlite" → provider = "postgresql"
 * 2. String @default("[]") → Json @default("[]")  (for JSON array fields)
 * 3. String? (for JSON nullable) → Json? (like offerData, metadata, skills in Review)
 */
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Switch provider
schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');

// Switch JSON array fields (String @default("[]") → Json @default("[]"))
schema = schema.replace(/(\w+)\s+String\s+@default\("\[\]"\)/g, '$1   Json     @default("[]")');

// Switch offerData and metadata to Json
schema = schema.replace(/offerData\s+String\?/g, 'offerData       Json?');
schema = schema.replace(/metadata\s+String\?/g, 'metadata  Json?');

// Switch skills in Review (nullable JSON)
// Be careful: only the one in Review model that's String?
schema = schema.replace(/(model Review[\s\S]*?)skills\s+String\?/m, '$1skills       Json?');

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema switched to PostgreSQL mode.');
console.log('Now update .env with your PostgreSQL DATABASE_URL and run:');
console.log('  npx prisma generate');
console.log('  npx prisma db push');
console.log('  npx ts-node prisma/seed.ts');
