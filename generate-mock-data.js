// Build-Time Data Generation Script
// Reads from demo.db and generates src/mockData.json

import Database from 'better-sqlite3';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'demo.db');
const outputPath = join(__dirname, 'src', 'mockData.json');

// Exit codes
const EXIT_SUCCESS = 0;
const EXIT_DB_NOT_FOUND = 1;
const EXIT_SCHEMA_INVALID = 2;
const EXIT_FILE_SYSTEM_ERROR = 3;
const EXIT_DATA_VALIDATION_ERROR = 4;

try {
  // Open database
  let db;
  try {
    db = new Database(dbPath, { readonly: true });
  } catch (error) {
    console.error(`❌ Error: Database file not found at ${dbPath}`);
    process.exit(EXIT_DB_NOT_FOUND);
  }

  // Verify schema
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    const requiredTables = ['customers', 'subscriptions', 'invoices', 'events'];
    
    for (const table of requiredTables) {
      if (!tableNames.includes(table)) {
        console.error(`❌ Error: Missing required table '${table}' in database`);
        db.close();
        process.exit(EXIT_SCHEMA_INVALID);
      }
    }
  } catch (error) {
    console.error('❌ Error: Invalid database schema');
    console.error(error.message);
    db.close();
    process.exit(EXIT_SCHEMA_INVALID);
  }

  // Compute MRR (Monthly Recurring Revenue)
  const mrrResult = db.prepare(`
    SELECT COALESCE(SUM(monthly_amount), 0) as mrr
    FROM subscriptions
    WHERE status = 'active'
  `).get();
  
  // Count active customers (distinct customers with at least one active subscription)
  const activeCustomersResult = db.prepare(`
    SELECT COUNT(DISTINCT customer_id) as count
    FROM subscriptions
    WHERE status = 'active'
  `).get();
  
  // Count all subscriptions
  const subscriptionsCountResult = db.prepare(`
    SELECT COUNT(*) as count
    FROM subscriptions
  `).get();
  
  // Count all invoices
  const invoicesCountResult = db.prepare(`
    SELECT COUNT(*) as count
    FROM invoices
  `).get();

  // Validate metrics
  if (activeCustomersResult.count === 0) {
    console.warn('⚠️  Warning: No active customers found in database');
  }

  const metrics = {
    mrr: mrrResult.mrr,
    activeCustomers: activeCustomersResult.count,
    subscriptionsCount: subscriptionsCountResult.count,
    invoicesCount: invoicesCountResult.count
  };

  // Fetch latest 10 invoices with customer names
  const latestInvoices = db.prepare(`
    SELECT 
      i.invoice_id,
      i.customer_id,
      i.amount,
      i.status,
      i.created_at,
      c.name as customerName
    FROM invoices i
    JOIN customers c ON i.customer_id = c.customer_id
    ORDER BY i.created_at DESC
    LIMIT 10
  `).all();

  // Format invoice numbers
  const formattedInvoices = latestInvoices.map(invoice => ({
    invoice_id: invoice.invoice_id,
    invoiceNumber: `INV-${String(invoice.invoice_id).padStart(6, '0')}`,
    customer_id: invoice.customer_id,
    customerName: invoice.customerName,
    amount: invoice.amount,
    status: invoice.status,
    created_at: invoice.created_at
  }));

  // Fetch latest 10 events
  const recentActivity = db.prepare(`
    SELECT event_id, event_type, message, created_at
    FROM events
    ORDER BY created_at DESC
    LIMIT 10
  `).all();

  // Close database
  db.close();

  // Construct output data
  const mockData = {
    metrics,
    latestInvoices: formattedInvoices,
    recentActivity
  };

  // Validate output data
  if (!mockData.metrics || typeof mockData.metrics.mrr !== 'number') {
    console.error('❌ Error: Invalid metrics data structure');
    process.exit(EXIT_DATA_VALIDATION_ERROR);
  }

  if (!Array.isArray(mockData.latestInvoices) || !Array.isArray(mockData.recentActivity)) {
    console.error('❌ Error: Invalid array data structure');
    process.exit(EXIT_DATA_VALIDATION_ERROR);
  }

  // Write to file
  try {
    writeFileSync(outputPath, JSON.stringify(mockData, null, 2), 'utf-8');
  } catch (error) {
    console.error(`❌ Error: Cannot write to ${outputPath}`);
    console.error(error.message);
    process.exit(EXIT_FILE_SYSTEM_ERROR);
  }

  // Success output
  console.log(`✓ Generated src/mockData.json with ${formattedInvoices.length} invoices and ${recentActivity.length} events`);
  console.log(`  MRR: ${metrics.mrr} DZD`);
  console.log(`  Active Customers: ${metrics.activeCustomers}`);
  console.log(`  Total Subscriptions: ${metrics.subscriptionsCount}`);
  console.log(`  Total Invoices: ${metrics.invoicesCount}`);
  
  process.exit(EXIT_SUCCESS);

} catch (error) {
  console.error('❌ Unexpected error during data generation:');
  console.error(error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }
  process.exit(EXIT_DATA_VALIDATION_ERROR);
}
