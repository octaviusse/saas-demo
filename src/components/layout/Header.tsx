// Header Component (optional for future use)

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>
    </header>
  );
};

export default Header;
