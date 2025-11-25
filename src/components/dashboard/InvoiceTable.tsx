// Invoice Table Component
// Displays latest invoices with customer information

import React from 'react';
import { formatCurrency, formatDate } from '../../services/formatters';
import type { InvoiceWithCustomer } from '../../types/data';

export interface InvoiceTableProps {
  invoices: InvoiceWithCustomer[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices }) => {
  if (invoices.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400 text-center">No invoices found</p>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-900/30';
      case 'unpaid':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'overdue':
        return 'text-red-400 bg-red-900/30';
      default:
        return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Invoice #</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Created at</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr 
                key={invoice.invoice_id} 
                className="border-b border-gray-700 last:border-b-0 hover:bg-gray-750"
              >
                <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-6 py-4 text-sm text-white">
                  {invoice.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {formatCurrency(invoice.amount)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(invoice.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
