import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, BookOpen, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${searchQuery}`);
    setSearchQuery('');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Verbazon
            </span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex flex-grow mx-8 max-w-2xl relative"
          >
            <input
              type="text"
              placeholder="Search for interactive books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="hover:text-blue-400 transition-colors">
              Browse
            </Link>
            {currentUser?.isAuthor && (
              <Link to="/author/dashboard" className="hover:text-blue-400 transition-colors">
                Author Dashboard
              </Link>
            )}
            {currentUser ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  {currentUser.profilePicture ? (
                    <img 
                      src={currentUser.profilePicture} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span>{currentUser.name}</span>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">
                    Profile
                  </Link>
                  {currentUser?.isAuthor && (
                    <Link to="/author/upload" className="block px-4 py-2 hover:bg-gray-700">
                      Upload Book
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut()} 
                    className="w-full text-left px-4 py-2 hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/signin" 
                  className="hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white" 
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile search - only shown on mobile */}
        <form 
          onSubmit={handleSearch} 
          className="mt-3 md:hidden flex relative"
        >
          <input
            type="text"
            placeholder="Search for interactive books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </form>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 py-3 space-y-3">
            <Link 
              to="/browse" 
              className="block hover:text-blue-400 transition-colors py-2"
              onClick={toggleMenu}
            >
              Browse
            </Link>
            {currentUser?.isAuthor && (
              <Link 
                to="/author/dashboard" 
                className="block hover:text-blue-400 transition-colors py-2"
                onClick={toggleMenu}
              >
                Author Dashboard
              </Link>
            )}
            {currentUser?.isAuthor && (
              <Link 
                to="/author/upload" 
                className="block hover:text-blue-400 transition-colors py-2"
                onClick={toggleMenu}
              >
                Upload Book
              </Link>
            )}
            {currentUser ? (
              <>
                <Link 
                  to="/profile" 
                  className="block hover:text-blue-400 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }} 
                  className="w-full text-left hover:text-blue-400 transition-colors py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/signin" 
                  className="block hover:text-blue-400 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors inline-block"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;