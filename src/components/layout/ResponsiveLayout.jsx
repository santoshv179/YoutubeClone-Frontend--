import React, { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function ResponsiveLayout({ children }) {
  const { isOpen, isMobileOpen, closeMobileSidebar } = useContext(SidebarContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <Header />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block transition-all duration-300 ease-in-out ${
          isOpen ? 'w-64' : 'w-20'
        }`}>
          <Sidebar />
        </aside>

        {/* Mobile Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${
          isOpen ? 'md:ml-64' : 'md:ml-20'
        }`}>
          <div className="p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
