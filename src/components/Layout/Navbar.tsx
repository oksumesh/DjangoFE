import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Home, User, LogOut, Menu, X, Ticket, Search, Heart, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Red Curtain</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:block">{user.name}</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm border-t border-gray-600 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {/* Home */}
            <Link
              to="/"
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </Link>

            {/* Polls */}
            <Link
              to="/polls"
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive('/polls') 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Ticket className="h-6 w-6" />
              <span className="text-xs font-medium">Polls</span>
            </Link>

            {/* Search */}
            <Link
              to="/search"
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive('/search') 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Search className="h-6 w-6" />
              <span className="text-xs font-medium">Search</span>
            </Link>

            {/* Favorites */}
            <Link
              to="/favorites"
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive('/favorites') 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Heart className="h-6 w-6" />
              <span className="text-xs font-medium">Favorites</span>
            </Link>

            {/* Notifications */}
            <Link
              to="/notifications"
              className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive('/notifications') 
                  ? 'text-orange-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Bell className="h-6 w-6" />
              <span className="text-xs font-medium">Alerts</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;