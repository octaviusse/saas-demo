import { execSync } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

describe('Build-time data generation', () => {
  const root = process.cwd();
  const demoDb = path.join(root, 'demo.db');
  const outputJson = path.join(root, 'src', 'mockData.json');

  beforeAll(async () => {
    // Clean any existing outputs
    await fs.rm(outputJson, { force: true });
    await fs.rm(demoDb, { force: true });
  });

  test('seed database and generate mockData.json', async () => {
    // Run seeding and generation scripts
    execSync('node scripts/seed-database.js', { stdio: 'inherit' });
    execSync('node generate-mock-data.js', { stdio: 'inherit' });

    // Validate file exists
    const exists = await fs.stat(outputJson).then(() => true).catch(() => false);
    expect(exists).toBe(true);

    const raw = await fs.readFile(outputJson, 'utf-8');
    const data = JSON.parse(raw);

    // Basic structure validation
    expect(data).toHaveProperty('metrics');
    expect(typeof data.metrics.mrr).toBe('number');
    expect(typeof data.metrics.activeCustomers).toBe('number');
    expect(typeof data.metrics.subscriptionsCount).toBe('number');
    expect(typeof data.metrics.invoicesCount).toBe('number');

    expect(Array.isArray(data.latestInvoices)).toBe(true);
    expect(Array.isArray(data.recentActivity)).toBe(true);

    if (data.latestInvoices.length > 0) {
      const inv = data.latestInvoices[0];
      expect(inv).toHaveProperty('invoiceNumber');
      expect(inv).toHaveProperty('customerName');
      expect(typeof inv.amount).toBe('number');
    }
  }, 20000);
});
