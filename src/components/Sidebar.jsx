import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaYoutube, FaUser, FaHistory, FaVideo, FaUpload, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
import { SidebarContext } from '../context/SidebarContext';

export default function Sidebar() {
  const { user, hasChannel, logout } = useContext(EnhancedAuthContext);
  const { isOpen, closeMobileSidebar } = useContext(SidebarContext);
  const location = useLocation();

  // Navigation items
  const navigation = [
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Shorts', href: '/shorts', icon: FaYoutube },
    { name: 'Subscriptions', href: '/subscriptions', icon: FaUser },
    { name: 'History', href: '/history', icon: FaHistory },
    { name: 'Library', href: '/library', icon: FaVideo },
  ];

  // User navigation items after some item show login 
  const userNavigation = [
    { name: 'My Channel', href: '/channel/me', icon: FaUser, show: hasChannel },
    { name: 'Upload', href: '/upload', icon: FaUpload, show: hasChannel },
    { name: 'Create Channel', href: '/create-channel', icon: FaUser, show: !hasChannel },
    { name: 'Sign Out', href: '/logout', icon: FaSignOutAlt },
  ];

  const handleLogout = () => {
    logout();
    closeMobileSidebar();
  };

  return (
    <nav className="p-4 overflow-y-auto h-full flex flex-col bg-white shadow-lg md:rounded-r-lg">
      {/* Mobile close button */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileSidebar}>
          <FaYoutube className="w-8 h-8 text-red-600" />
          <span className="text-xl font-bold text-gray-800">YouTube</span>
        </Link>
        <button
          onClick={closeMobileSidebar}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close mobile sidebar"
        >
          <FaTimes className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Main navigation */}
      <div className="space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all
              ${location.pathname === item.href 
                ? 'bg-red-500 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
              ${!isOpen && 'justify-center'}
            `}
            onClick={closeMobileSidebar}
          >
            <item.icon className={`h-5 w-5 ${isOpen && 'mr-4'}`} />
            {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* User navigation */}
      {user && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          {isOpen && (
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {hasChannel ? 'My Channel' : 'Account'}
            </h3>
          )}
          <div className={`mt-2 space-y-1 ${!isOpen && 'space-y-2'}`}>
            {userNavigation.map((item) => (
              item.show !== false && (
                <Link
                  key={item.name}
                  to={item.href === '/logout' ? '#' : item.href}
                  onClick={() => {
                    if (item.name === 'Sign Out') {
                      handleLogout();
                    } else {
                      closeMobileSidebar();
                    }
                  }}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all
                    ${location.pathname === item.href 
                      ? 'bg-red-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                    ${!isOpen && 'justify-center'}
                  `}
                >
                  <item.icon className={`h-4 w-4 ${isOpen && 'mr-4'}`} />
                  {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}