import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Verbazon
              </span>
            </Link>
            <p className="text-sm">
              Revolutionizing the way readers interact with books through AI and voice technology.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="hover:text-white transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/browse?category=fiction" className="hover:text-white transition-colors">
                  Fiction
                </Link>
              </li>
              <li>
                <Link to="/browse?category=non-fiction" className="hover:text-white transition-colors">
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link to="/browse?category=new-releases" className="hover:text-white transition-colors">
                  New Releases
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">For Authors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/author/dashboard" className="hover:text-white transition-colors">
                  Author Dashboard
                </Link>
              </li>
              <li>
                <Link to="/author/upload" className="hover:text-white transition-colors">
                  Upload a Book
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Author Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Voice Recording Tips
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-sm text-center">
          <p>© {new Date().getFullYear()} Verbazon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;