import React, { useContext, useState, useEffect } from 'react';
import { EnhancedAuthContext } from '../context/EnhancedAuthContext';
import { SidebarContext } from '../context/SidebarContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUpload, FaUserCircle, FaSearch, FaYoutube, FaSignOutAlt, FaCog } from 'react-icons/fa';  // Import necessary icons

export default function Header() {
  const { user, channel, hasChannel, logout, loading } = useContext(EnhancedAuthContext);
  const { toggleSidebar, toggleMobileSidebar } = useContext(SidebarContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // New state for mobile search
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
      // Close mobile search bar if click is outside
      if (isMobileSearchOpen && !event.target.closest('.mobile-search-container')) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileSearchOpen]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileSearchOpen(false); //  Close search bar after search
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // toggle sidebar
  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {  
      toggleMobileSidebar();// Toggle mobile sidebar
    } else {
      toggleSidebar();
    }
  };

  // toggle mobile search bar
  const handleToggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Render header
  if (loading) {
    return (
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    // Header component
    <header className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <FaYoutube className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold hidden sm:block">YouTube</span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden sm:flex">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
            >
              <FaSearch className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Mobile Search Icon */}
          <button
            onClick={handleToggleMobileSearch}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors sm:hidden"
            aria-label="Open search bar"
          >
            <FaSearch className="w-5 h-5" />
          </button>

          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <>
              {hasChannel ? (
                <Link
                  to="/upload"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Upload video"
                >
                  <FaUpload className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  to="/create-channel"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
                >
                  Create Channel
                </Link>
              )}

              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaUserCircle className="w-8 h-8 text-gray-600" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="font-semibold text-sm">{user.username}</div>
                      {channel && (
                        <div className="text-xs text-gray-600 mt-1">{channel.name}</div>
                      )}
                    </div>
                    {channel && (
                      <>
                        <Link
                          to={`/channel/${channel._id}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUserCircle className="h-4 w-4" /> View Channel
                        </Link>
                        <Link
                          to="/studio"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="h-4 w-4" /> Studio Channel
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                    >
                      <FaSignOutAlt className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/*  Mobile Search bar (conditionally rendered) */}
      {isMobileSearchOpen && (
        <div className="mobile-search-container bg-white px-4 py-2 border-b sm:hidden">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
            >
              <FaSearch className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}