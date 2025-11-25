// Database Seed Script
// Populates demo.db with mock SaaS business data

import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'demo.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Ensure schema exists (allows running seed directly without external sqlite CLI)
try {
  const schemaSql = readFileSync(join(__dirname, '..', 'schema.sql'), 'utf-8');
  db.exec(schemaSql);
  console.log('✓ Applied schema.sql');
} catch (err) {
  console.warn('⚠️  Could not apply schema.sql, continuing (it may already exist)');
}

console.log('🌱 Seeding database...');

// Clear existing data
db.exec(`
  DELETE FROM events;
  DELETE FROM invoices;
  DELETE FROM subscriptions;
  DELETE FROM customers;
`);

// Reset sqlite_sequence to ensure AUTOINCREMENT sequences start from 1 on fresh databases
try {
  db.exec("DELETE FROM sqlite_sequence;");
} catch (err) {
  // sqlite_sequence table doesn't exist on some older SQLite versions; ignore errors
}

// Sample data
const customers = [
  { name: 'Alice Johnson', email: 'alice@techcorp.com', company: 'TechCorp', created_at: '2024-01-15T10:30:00Z' },
  { name: 'Bob Smith', email: 'bob@startupco.com', company: 'StartupCo', created_at: '2024-01-20T14:45:00Z' },
  { name: 'Carol White', email: 'carol@innovate.io', company: 'Innovate Inc', created_at: '2024-02-01T09:00:00Z' },
  { name: 'David Brown', email: 'david@enterprise.com', company: 'Enterprise Ltd', created_at: '2024-02-10T11:20:00Z' },
  { name: 'Emma Davis', email: 'emma@digital.com', company: 'Digital Solutions', created_at: '2024-02-15T16:30:00Z' },
  { name: 'Frank Wilson', email: 'frank@solutions.net', company: 'Solutions Network', created_at: '2024-03-01T08:15:00Z' },
  { name: 'Grace Lee', email: 'grace@consulting.com', company: 'Grace Consulting', created_at: '2024-03-05T13:45:00Z' },
  { name: 'Henry Taylor', email: 'henry@marketing.io', company: 'Marketing Pro', created_at: '2024-03-10T10:00:00Z' },
  { name: 'Iris Martinez', email: 'iris@analytics.com', company: 'Analytics Hub', created_at: '2024-03-15T15:20:00Z' },
  { name: 'Jack Anderson', email: 'jack@cloudify.com', company: 'Cloudify Systems', created_at: '2024-03-20T12:30:00Z' },
  { name: 'Kate Robinson', email: 'kate@freelance.com', company: null, created_at: '2024-04-01T09:45:00Z' },
  { name: 'Liam Thomas', email: 'liam@designstudio.com', company: 'Design Studio', created_at: '2024-04-05T14:00:00Z' },
  { name: 'Mia Jackson', email: 'mia@finance.com', company: 'Finance Plus', created_at: '2024-04-10T11:30:00Z' },
  { name: 'Noah Harris', email: 'noah@ecommerce.com', company: 'eCommerce Pro', created_at: '2024-04-15T16:45:00Z' },
  { name: 'Olivia Clark', email: 'olivia@healthtech.com', company: 'HealthTech', created_at: '2024-04-20T10:15:00Z' },
];

// Insert customers
const insertCustomer = db.prepare('INSERT INTO customers (name, email, company, created_at) VALUES (?, ?, ?, ?)');
const insertMany = db.transaction((items) => {
  for (const item of items) insertCustomer.run(item.name, item.email, item.company, item.created_at);
});
insertMany(customers);
console.log(`✓ Inserted ${customers.length} customers`);


// Insert subscriptions
const plans = ['Starter', 'Pro', 'Enterprise', 'Basic', 'Premium'];
const planAmounts = { Starter: 5000, Pro: 15000, Enterprise: 50000, Basic: 3000, Premium: 25000 };
const subscriptions = [];

for (let i = 1; i <= 12; i++) {
  const customerId = (i % 15) + 1;
  const plan = plans[i % plans.length];
  const status = Math.random() > 0.2 ? 'active' : 'canceled';
  const startDate = `2024-0${Math.min(Math.floor(i / 4) + 1, 9)}-01`;
  const canceledAt = status === 'canceled' ? `2024-0${Math.min(Math.floor(i / 4) + 2, 9)}-15T10:00:00Z` : null;
  
  subscriptions.push({
    customer_id: customerId,
    plan_name: plan,
    monthly_amount: planAmounts[plan],
    status,
    start_date: startDate,
    canceled_at: canceledAt
  });
}

const insertSubscription = db.prepare('INSERT INTO subscriptions (customer_id, plan_name, monthly_amount, status, start_date, canceled_at) VALUES (?, ?, ?, ?, ?, ?)');
// (local) Debug logging removed for deterministic seeding in CI / Docker
const insertSubscriptions = db.transaction((items) => {
  for (const item of items) {
    insertSubscription.run(item.customer_id, item.plan_name, item.monthly_amount, item.status, item.start_date, item.canceled_at);
  }
});
insertSubscriptions(subscriptions);
console.log(`✓ Inserted ${subscriptions.length} subscriptions`);

// Insert invoices
const invoices = [];
const statuses = ['paid', 'unpaid', 'overdue'];

for (let i = 1; i <= 25; i++) {
  const customerId = (i % 15) + 1;
  const amount = [3000, 5000, 15000, 25000, 50000][i % 5];
  const status = statuses[i % 3];
  const month = Math.min(Math.floor(i / 6) + 1, 11);
  const day = (i % 28) + 1;
  const createdAt = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String((i * 3) % 24).padStart(2, '0')}:00:00Z`;
  
  invoices.push({
    customer_id: customerId,
    amount,
    status,
    created_at: createdAt
  });
}

const insertInvoice = db.prepare('INSERT INTO invoices (customer_id, amount, status, created_at) VALUES (?, ?, ?, ?)');
const insertInvoices = db.transaction((items) => {
  for (const item of items) {
    insertInvoice.run(item.customer_id, item.amount, item.status, item.created_at);
  }
});
insertInvoices(invoices);
console.log(`✓ Inserted ${invoices.length} invoices`);

// Insert events
const eventTypes = [
  'subscription_created',
  'subscription_canceled',
  'invoice_paid',
  'invoice_created',
  'customer_created'
];

const events = [
  { type: 'customer_created', message: 'Customer Alice Johnson registered', created_at: '2024-01-15T10:30:00Z' },
  { type: 'subscription_created', message: 'Alice Johnson started Pro Plan subscription', created_at: '2024-02-01T10:30:00Z' },
  { type: 'customer_created', message: 'Customer Bob Smith registered', created_at: '2024-01-20T14:45:00Z' },
  { type: 'subscription_created', message: 'Bob Smith started Starter Plan subscription', created_at: '2024-02-01T11:00:00Z' },
  { type: 'invoice_created', message: 'Invoice INV-000001 created for Alice Johnson', created_at: '2024-03-01T00:00:00Z' },
  { type: 'invoice_paid', message: 'Invoice INV-000001 paid by Alice Johnson', created_at: '2024-03-05T14:30:00Z' },
  { type: 'customer_created', message: 'Customer Carol White registered', created_at: '2024-02-01T09:00:00Z' },
  { type: 'subscription_created', message: 'Carol White started Enterprise Plan subscription', created_at: '2024-02-15T10:00:00Z' },
  { type: 'invoice_created', message: 'Invoice INV-000005 created for Carol White', created_at: '2024-03-15T00:00:00Z' },
  { type: 'subscription_canceled', message: 'Emma Davis canceled Premium Plan subscription', created_at: '2024-04-10T16:45:00Z' },
  { type: 'customer_created', message: 'Customer David Brown registered', created_at: '2024-02-10T11:20:00Z' },
  { type: 'invoice_paid', message: 'Invoice INV-000008 paid by Frank Wilson', created_at: '2024-04-15T10:20:00Z' },
  { type: 'subscription_created', message: 'Grace Lee started Basic Plan subscription', created_at: '2024-03-20T13:45:00Z' },
  { type: 'invoice_created', message: 'Invoice INV-000012 created for Henry Taylor', created_at: '2024-04-20T00:00:00Z' },
  { type: 'customer_created', message: 'Customer Iris Martinez registered', created_at: '2024-03-15T15:20:00Z' },
];

const insertEvent = db.prepare('INSERT INTO events (event_type, message, created_at) VALUES (?, ?, ?)');
const insertEvents = db.transaction((items) => {
  for (const item of items) {
    insertEvent.run(item.type, item.message, item.created_at);
  }
});
insertEvents(events);
console.log(`✓ Inserted ${events.length} events`);

// Verify data
const counts = {
  customers: db.prepare('SELECT COUNT(*) as count FROM customers').get().count,
  subscriptions: db.prepare('SELECT COUNT(*) as count FROM subscriptions').get().count,
  invoices: db.prepare('SELECT COUNT(*) as count FROM invoices').get().count,
  events: db.prepare('SELECT COUNT(*) as count FROM events').get().count
};

console.log('\n📊 Database Summary:');
console.log(`   Customers: ${counts.customers}`);
console.log(`   Subscriptions: ${counts.subscriptions}`);
console.log(`   Invoices: ${counts.invoices}`);
console.log(`   Events: ${counts.events}`);
console.log('\n✅ Database seeding complete!');

db.close();
