import React from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'skills', label: 'Skills' },
    { id: 'swaps', label: 'Swaps' },
    { id: 'profile', label: 'Profile' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillSwap
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              
              <button
                onClick={() => setCurrentPage('settings')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;