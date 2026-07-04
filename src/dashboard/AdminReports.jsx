import { useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend
} from 'chart.js';
import { formatPrice } from '../utils/constants';
import { Bar } from 'react-chartjs-2';
import { FiDownload, FiCalendar } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const REPORT_TYPES = [
  { label: 'Revenues', value: 125430, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Bookings', value: '8,542', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Users', value: '24,532', color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Revenue/Avg', value: 180, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const BREAKDOWN = [
  { label: 'Hotels', amount: 52000 },
  { label: 'Flights', amount: 35000 },
  { label: 'Tours', amount: 22000 },
  { label: 'Cars', amount: 11000 },
  { label: 'Buses', amount: 5430 },
];

const AdminReports = () => {
  const [selectedType, setSelectedType] = useState('Revenues');

  // Dynamic chart datasets based on selected report type
  const getChartData = () => {
    switch (selectedType) {
      case 'Bookings':
        return {
          labels: ['24 May', '26 May', '28 May', '30 May', '1 Jun', '3 Jun', '5 Jun'],
          datasets: [{
            label: 'Bookings',
            data: [450, 720, 580, 920, 680, 890, 810],
            backgroundColor: '#10b981',
            borderRadius: 6,
            borderSkipped: false,
          }],
        };
      case 'Users':
        return {
          labels: ['24 May', '26 May', '28 May', '30 May', '1 Jun', '3 Jun', '5 Jun'],
          datasets: [{
            label: 'New Users',
            data: [1500, 1800, 1620, 2100, 1950, 2300, 2210],
            backgroundColor: '#f59e0b',
            borderRadius: 6,
            borderSkipped: false,
          }],
        };
      case 'Revenue/Avg':
        return {
          labels: ['24 May', '26 May', '28 May', '30 May', '1 Jun', '3 Jun', '5 Jun'],
          datasets: [{
            label: 'Avg Revenue (₹)',
            data: [140, 160, 150, 190, 175, 185, 180],
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
            borderSkipped: false,
          }],
        };
      case 'Revenues':
      default:
        return {
          labels: ['24 May', '26 May', '28 May', '30 May', '1 Jun', '3 Jun', '5 Jun'],
          datasets: [{
            label: 'Revenue (₹)',
            data: [8000, 12000, 9500, 15000, 11000, 14000, 13500],
            backgroundColor: '#4f46e5',
            borderRadius: 6,
            borderSkipped: false,
          }],
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Type & Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Report Type</h3>
          <div className="space-y-4">
            {REPORT_TYPES.map((r, i) => {
              const isSelected = selectedType === r.label;
              return (
                <label
                  key={i}
                  onClick={() => setSelectedType(r.label)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300 group-hover:border-gray-400'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    isSelected ? 'text-primary-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                  } flex-1`}>{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 capitalize">{selectedType} Report</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600">
                <FiCalendar size={14} />
                <span>May 2025</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <FiDownload size={14} /> Export
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {REPORT_TYPES.map((r, i) => (
              <div key={i} className={`rounded-xl p-4 transition-all ${r.bg} ${selectedType === r.label ? 'ring-2 ring-primary-500/25 scale-[1.02]' : ''}`}>
                <p className="text-xs text-gray-500 mb-1">{r.label}</p>
                <p className={`text-xl font-bold ${r.color}`}>{typeof r.value === 'number' ? formatPrice(r.value, 'INR', 'INR') : r.value}</p>
              </div>
            ))}
          </div>

          <div className="h-56">
            <Bar
              data={getChartData()}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: '#f3f4f6', borderDash: [4, 4] }, border: { display: false } },
                  x: { grid: { display: false }, border: { display: false } }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown by Service */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-5">Revenue Breakdown by Service</h3>
        <div className="space-y-4">
          {BREAKDOWN.map((b, i) => {
            const max = 52000;
            const val = typeof b.amount === 'string' ? parseInt(b.amount.replace(/[^0-9]/g, ''), 10) : Number(b.amount);
            const pct = Math.round((val / max) * 100);
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{b.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{formatPrice(b.amount, 'INR', 'INR')}</span>
                    <span className="text-xs text-gray-400">{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${colors[i]}`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
