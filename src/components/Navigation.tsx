import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, User, Bell, LogOut, Menu, X, Settings, Star } from 'lucide-react';

const Navigation: React.FC = () => {
  const { userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Dashboard
              </a>
              <a href="#browse" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Skills
              </a>
              <a href="#requests" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                My Requests
              </a>
              {userData?.isAdmin && (
                <a href="#admin" className="text-purple-600 hover:text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-purple-50 border border-purple-200">
                  Admin Panel
                </a>
              )}
            </div>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm hover:border-gray-400 transition-colors"
              />
            </div>
            
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors transform hover:scale-110" />
              {notifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                {userData?.profilePhoto ? (
                  <img src={userData.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-700">{userData?.name}</p>
                <p className="text-xs text-gray-500">
                  {userData?.isAdmin && <span className="text-purple-600 font-medium">Admin • </span>}
                  {userData?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors transform hover:scale-110"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a href="#dashboard" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a href="#browse" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Browse Skills
            </a>
            <a href="#requests" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              My Requests
            </a>
            {userData?.isAdmin && (
              <a href="#admin" className="text-purple-600 hover:text-purple-700 block px-3 py-2 rounded-md text-base font-medium">
                Admin Panel
              </a>
            )}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;