// KPI Card Component
// Displays a single metric with label and formatted value

import React from 'react';
import { formatCurrency, formatNumber } from '../../services/formatters';

export interface KpiCardProps {
  label: string;
  value: number;
  format?: 'currency' | 'number';
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, format = 'number' }) => {
  const formattedValue = format === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-gray-400 text-sm font-medium mb-2">{label}</h3>
      <p className="text-white text-3xl font-bold">{formattedValue}</p>
    </div>
  );
};

export default KpiCard;
