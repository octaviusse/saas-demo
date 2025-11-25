import { useEffect } from 'react';
import mockData from './mockData.json';
import Sidebar from './components/layout/Sidebar';
import KpiCard from './components/dashboard/KpiCard';
import InvoiceTable from './components/dashboard/InvoiceTable';
import ActivityFeed from './components/dashboard/ActivityFeed';
import { analytics } from './services/analytics';
import type { MockData } from './types/data';

const data = mockData as MockData;

function App() {
  // Track dashboard view on component mount
  useEffect(() => {
    analytics.track('dashboard_viewed', {
      page: 'dashboard',
      mrr: data.metrics.mrr,
      activeCustomers: data.metrics.activeCustomers,
      subscriptionsCount: data.metrics.subscriptionsCount,
      invoicesCount: data.metrics.invoicesCount
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Dashboard Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mini SaaS Dashboard</h1>
            <p className="text-gray-400">Mock SaaS metrics powered by SQLite at build-time</p>
          </header>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard 
              label="Monthly Recurring Revenue" 
              value={data.metrics.mrr} 
              format="currency" 
            />
            <KpiCard 
              label="Active Customers" 
              value={data.metrics.activeCustomers} 
            />
            <KpiCard 
              label="Total Subscriptions" 
              value={data.metrics.subscriptionsCount} 
            />
            <KpiCard 
              label="Total Invoices" 
              value={data.metrics.invoicesCount} 
            />
          </div>

          {/* Latest Invoices Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest Invoices</h2>
            <InvoiceTable invoices={data.latestInvoices} />
          </section>

          {/* Recent Activity Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <ActivityFeed events={data.recentActivity} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
