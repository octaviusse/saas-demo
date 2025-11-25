// Sidebar Component
// Navigation and branding sidebar

import React from 'react';

const Sidebar: React.FC = () => {
  const appName = import.meta.env.VITE_APP_NAME || 'SaaS Demo';
  const environment = import.meta.env.VITE_ENV || 'development';

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 flex flex-col">
      {/* Branding */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Deployed on</p>
            <p className="text-blue-400 font-bold text-sm">PivoCloud</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <a 
              href="#" 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-700 text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <button 
              disabled 
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Customers</span>
            </button>
          </li>
          <li>
            <button 
              disabled 
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Invoices</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* App Configuration Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <p className="font-medium text-white">{appName}</p>
          <p className="text-gray-500 capitalize">{environment}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
