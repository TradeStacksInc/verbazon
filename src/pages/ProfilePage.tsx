import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Save, BookOpen, ShoppingCart, Clock, Heart } from 'lucide-react';
import { mockBooks } from '../data/mockData';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'library' | 'history' | 'favorites' | 'settings'>('library');
  
  // Mock user's books
  const userBooks = mockBooks.slice(0, 4); // First 4 books for demo
  const userHistory = mockBooks.slice(4, 8); // Next 4 books for demo
  const userFavorites = mockBooks.slice(2, 6); // Mixed 4 books for demo

  if (!currentUser) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">You need to be signed in to view your profile.</p>
          <Link to="/signin" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-700">
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
              <p className="text-gray-400 mb-3">{currentUser.email}</p>
              {currentUser.isAuthor && (
                <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  Author
                </span>
              )}
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                {currentUser.isAuthor && (
                  <Link 
                    to="/author/dashboard" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    Author Dashboard
                  </Link>
                )}
                <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === 'library' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              My Library
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === 'history' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="h-4 w-4 mr-2" />
              Reading History
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === 'favorites' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === 'settings' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'library' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Library</h2>
                <Link to="/browse" className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Browse Books
                </Link>
              </div>
              
              {userBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {userBooks.map(book => (
                    <div key={book.id} className="flex flex-col">
                      <Link to={`/book/${book.id}`} className="group">
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg">
                          <img 
                            src={book.coverImage} 
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h3 className="font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{book.author.name}</p>
                      </Link>
                      <div className="mt-auto pt-2 flex space-x-2">
                        <Link 
                          to={`/read/${book.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded flex-grow text-center"
                        >
                          Read
                        </Link>
                        <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-1 px-2 rounded">
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your library is empty</h3>
                  <p className="text-gray-400 mb-6">
                    Discover and purchase interactive books to build your collection.
                  </p>
                  <Link 
                    to="/browse" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg inline-flex items-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Browse Books
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Reading History</h2>
              
              {userHistory.length > 0 ? (
                <div className="space-y-4">
                  {userHistory.map(book => (
                    <div 
                      key={book.id}
                      className="bg-gray-750 rounded-lg overflow-hidden flex hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-16 sm:w-24 flex-shrink-0">
                        <img 
                          src={book.coverImage} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{book.title}</h3>
                          <span className="text-gray-400 text-sm">Yesterday</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{book.author.name}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-blue-400">34%</span> completed
                            <div className="w-32 h-1 bg-gray-700 rounded-full mt-1">
                              <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                          <Link 
                            to={`/read/${book.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded"
                          >
                            Continue
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reading history yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start reading books to track your progress.
                  </p>
                  <Link 
                    to="/browse" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                  >
                    Find Books to Read
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Favorite Books</h2>
              
              {userFavorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {userFavorites.map(book => (
                    <div key={book.id} className="flex flex-col">
                      <Link to={`/book/${book.id}`} className="group">
                        <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg relative">
                          <img 
                            src={book.coverImage} 
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute top-2 right-2">
                            <Heart className="h-5 w-5 text-red-500 fill-current" />
                          </div>
                        </div>
                        <h3 className="font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{book.author.name}</p>
                      </Link>
                      <div className="mt-auto pt-2 flex space-x-2">
                        <Link 
                          to={`/read/${book.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded flex-grow text-center"
                        >
                          Read
                        </Link>
                        <button className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-2 rounded">
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                  <p className="text-gray-400 mb-6">
                    Mark books as favorites to add them to your collection.
                  </p>
                  <Link 
                    to="/browse" 
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                  >
                    Browse Books
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        defaultValue={currentUser.name}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue={currentUser.email}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-400 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-400 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="new-password"
                          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirm-password"
                          className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-300">
                        Receive email notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="marketing-emails"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-300">
                        Receive marketing emails
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dark-mode"
                        type="checkbox"
                        className="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        defaultChecked
                      />
                      <label htmlFor="dark-mode" className="ml-2 block text-sm text-gray-300">
                        Use dark theme
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center">
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Settings icon component
const Settings: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export default ProfilePage;