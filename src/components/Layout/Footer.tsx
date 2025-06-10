import React from 'react';
import { Film, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo and Brand - Centered */}
          <div className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-accent-400" />
            <span className="text-xl font-bold text-white">MoviePoll</span>
          </div>

          {/* Copyright and Love Message - Centered */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
            <span>© {currentYear} MoviePoll. All rights reserved.</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for movie lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;