// TypeScript type definitions for application data

export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  company: string | null;
  created_at: string;
}

export interface Subscription {
  subscription_id: number;
  customer_id: number;
  plan_name: string;
  monthly_amount: number;
  status: 'active' | 'canceled';
  start_date: string;
  canceled_at: string | null;
}

export interface Invoice {
  invoice_id: number;
  customer_id: number;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  created_at: string;
}

export interface InvoiceWithCustomer extends Invoice {
  invoiceNumber: string;
  customerName: string;
}

export interface Event {
  event_id: number;
  event_type: string;
  message: string;
  created_at: string;
}

export interface MetricsSummary {
  mrr: number;
  activeCustomers: number;
  subscriptionsCount: number;
  invoicesCount: number;
}

export interface MockData {
  metrics: MetricsSummary;
  latestInvoices: InvoiceWithCustomer[];
  recentActivity: Event[];
}
