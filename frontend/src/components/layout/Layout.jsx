import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/**
 * Root layout shell in strict monochrome theme.
 */
export default function Layout({ children, userName = 'User' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* TopBar */}
      <TopBar onMenuClick={() => setSidebarOpen(true)} userName={userName} />

      {/* Main content area */}
      <main
        className="transition-all duration-300 pt-[65px] lg:ml-64 min-h-screen bg-[#000000]"
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
