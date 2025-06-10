import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Home, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) return null;

  return (
    <nav className="bg-dark-900 border-b border-primary-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-accent-400" />
            <span className="text-xl font-bold text-white">MoviePoll</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            {user.isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-secondary-400 hover:text-secondary-300 transition-colors duration-200"
              >
                <span>Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800 rounded-lg mt-2">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-md transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-dark-700 rounded-md transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 px-3 py-2 text-secondary-400 hover:text-secondary-300 hover:bg-dark-700 rounded-md transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-dark-700 rounded-md transition-all duration-200 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;