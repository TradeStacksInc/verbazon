import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookOpen, DollarSign, BarChart2, Users, ChevronDown, Download, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockBooks } from '../data/mockData';

const AuthorDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('last30Days');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Filter mock books to show only those belonging to the current author
  const authorBooks = mockBooks.slice(0, 5); // For demo purposes, just show first 5 books
  
  // Mock statistics
  const stats = {
    revenue: {
      last30Days: 1287.45,
      last3Months: 3562.78,
      lastYear: 12453.92,
      allTime: 18765.30
    },
    readers: {
      last30Days: 342,
      last3Months: 1203,
      lastYear: 4521,
      allTime: 6832
    },
    interactions: {
      last30Days: 1876,
      last3Months: 6234,
      lastYear: 23567,
      allTime: 35421
    }
  };

  if (!currentUser?.isAuthor) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Author Access Required</h1>
          <p className="mb-6">You need an author account to access this dashboard.</p>
          <Link to="/author/signup" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
            Create Author Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Author Dashboard</h1>
          <Link 
            to="/author/upload" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Upload New Book
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('books')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'books'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              My Books
            </button>
            <button
              onClick={() => setSelectedTab('analytics')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'analytics'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setSelectedTab('payouts')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'payouts'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Payouts
            </button>
          </nav>
        </div>
        
        {/* Time Period Selector */}
        <div className="flex justify-end mb-6">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="last30Days">Last 30 Days</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="lastYear">Last Year</option>
              <option value="allTime">All Time</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        {selectedTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-6 w-6 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium">Revenue</h3>
                </div>
                <p className="text-3xl font-bold mb-1">${stats.revenue[selectedPeriod as keyof typeof stats.revenue].toFixed(2)}</p>
                <p className="text-sm text-gray-400">
                  {selectedPeriod === 'last30Days' && '+12.5% from previous period'}
                  {selectedPeriod === 'last3Months' && '+8.3% from previous period'}
                  {selectedPeriod === 'lastYear' && '+24.1% from previous period'}
                  {selectedPeriod === 'allTime' && 'Lifetime earnings'}
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">Readers</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{stats.readers[selectedPeriod as keyof typeof stats.readers].toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  {selectedPeriod === 'last30Days' && '+8.2% from previous period'}
                  {selectedPeriod === 'last3Months' && '+11.5% from previous period'}
                  {selectedPeriod === 'lastYear' && '+18.7% from previous period'}
                  {selectedPeriod === 'allTime' && 'Total unique readers'}
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <BarChart2 className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="text-lg font-medium">Interactions</h3>
                </div>
                <p className="text-3xl font-bold mb-1">{stats.interactions[selectedPeriod as keyof typeof stats.interactions].toLocaleString()}</p>
                <p className="text-sm text-gray-400">
                  {selectedPeriod === 'last30Days' && '+15.3% from previous period'}
                  {selectedPeriod === 'last3Months' && '+12.8% from previous period'}
                  {selectedPeriod === 'lastYear' && '+22.5% from previous period'}
                  {selectedPeriod === 'allTime' && 'Total voice and text interactions'}
                </p>
              </div>
            </div>
            
            {/* Recent Books */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Books</h2>
                <Link to="/author/books" className="text-blue-500 hover:text-blue-400 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-4 font-medium">Book</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Sales</th>
                      <th className="pb-4 font-medium">Revenue</th>
                      <th className="pb-4 font-medium">Interactions</th>
                      <th className="pb-4 font-medium">Rating</th>
                      <th className="pb-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {authorBooks.map(book => (
                      <tr key={book.id} className="hover:bg-gray-750">
                        <td className="py-4">
                          <div className="flex items-center">
                            <img 
                              src={book.coverImage} 
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded mr-3"
                            />
                            <div>
                              <p className="font-medium">{book.title}</p>
                              <p className="text-sm text-gray-400">Published {book.publishedDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                            Live
                          </span>
                        </td>
                        <td className="py-4">{(book.reviewCount * 3).toLocaleString()}</td>
                        <td className="py-4">${(book.price * book.reviewCount * 3).toFixed(2)}</td>
                        <td className="py-4">{(book.reviewCount * 15).toLocaleString()}</td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{book.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <Link to={`/book/${book.id}`} className="text-blue-500 hover:text-blue-400">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-blue-600 p-2 rounded-full mr-4">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Sale</p>
                      <p className="text-sm text-gray-400">Someone purchased "The Quantum Paradox"</p>
                      <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-green-600 p-2 rounded-full mr-4">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Reader</p>
                      <p className="text-sm text-gray-400">A new reader started "Whispers in the Labyrinth"</p>
                      <p className="text-xs text-gray-500 mt-1">45 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-purple-600 p-2 rounded-full mr-4">
                      <BarChart2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">High Engagement</p>
                      <p className="text-sm text-gray-400">"The Quantum Paradox" had 35 voice interactions today</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-750 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-yellow-600 p-2 rounded-full mr-4">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">New Review</p>
                      <p className="text-sm text-gray-400">You received a 5-star review on "The Last Lighthouse"</p>
                      <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {selectedTab === 'books' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Books</h2>
              <Link 
                to="/author/upload" 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Upload New Book
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorBooks.map(book => (
                <div key={book.id} className="bg-gray-750 rounded-lg overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/3">
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-medium mb-1">{book.title}</h3>
                      <div className="flex items-center mb-3">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm ml-1">{book.rating.toFixed(1)}</span>
                        <span className="text-gray-400 text-sm ml-2">({book.reviewCount})</span>
                      </div>
                      <div className="mb-3">
                        <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                          Live
                        </span>
                      </div>
                      <div className="text-sm mb-4">
                        <p>Sales: {(book.reviewCount * 3).toLocaleString()}</p>
                        <p>Revenue: ${(book.price * book.reviewCount * 3).toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/book/${book.id}`} 
                          className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Link>
                        <button className="text-gray-400 hover:text-white text-sm flex items-center">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-750 rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center p-8">
                <Link 
                  to="/author/upload" 
                  className="flex flex-col items-center text-gray-400 hover:text-white transition-colors"
                >
                  <PlusCircle className="h-10 w-10 mb-2" />
                  <span>Upload New Book</span>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Reader Analytics</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-750 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Interactive analytics chart would appear here</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Readers</p>
                  <p className="text-xl font-bold">{stats.readers[selectedPeriod as keyof typeof stats.readers].toLocaleString()}</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Avg. Reading Time</p>
                  <p className="text-xl font-bold">42 min</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
                  <p className="text-xl font-bold">76%</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">New Readers</p>
                  <p className="text-xl font-bold">+128</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Interaction Analytics</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-750 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Interactive analytics chart would appear here</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Total Interactions</p>
                  <p className="text-xl font-bold">{stats.interactions[selectedPeriod as keyof typeof stats.interactions].toLocaleString()}</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Voice Interactions</p>
                  <p className="text-xl font-bold">{Math.floor(stats.interactions[selectedPeriod as keyof typeof stats.interactions] * 0.42).toLocaleString()}</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Text Interactions</p>
                  <p className="text-xl font-bold">{Math.floor(stats.interactions[selectedPeriod as keyof typeof stats.interactions] * 0.58).toLocaleString()}</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Avg. per Reader</p>
                  <p className="text-xl font-bold">14.3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Top Questions Asked</h2>
                <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="font-medium">Who is the main character based on?</p>
                  <p className="text-sm text-gray-400 mt-1">Asked 127 times</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="font-medium">What inspired you to write this story?</p>
                  <p className="text-sm text-gray-400 mt-1">Asked 98 times</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="font-medium">Will there be a sequel?</p>
                  <p className="text-sm text-gray-400 mt-1">Asked 86 times</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="font-medium">What does the ending symbolize?</p>
                  <p className="text-sm text-gray-400 mt-1">Asked 74 times</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="font-medium">How long did it take you to write this book?</p>
                  <p className="text-sm text-gray-400 mt-1">Asked 65 times</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === 'payouts' && (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Earnings Summary</h2>
                <button className="text-blue-500 hover:text-blue-400 text-sm flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Download Report
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Current Balance</p>
                  <p className="text-2xl font-bold">${(stats.revenue[selectedPeriod as keyof typeof stats.revenue] * 0.3).toFixed(2)}</p>
                  <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded">
                    Withdraw
                  </button>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Lifetime Earnings</p>
                  <p className="text-2xl font-bold">${stats.revenue.allTime.toFixed(2)}</p>
                  <p className="text-xs text-green-400 mt-1">+24.5% from last year</p>
                </div>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Next Payout</p>
                  <p className="text-2xl font-bold">May 15, 2025</p>
                  <p className="text-xs text-gray-400 mt-1">Estimated: $945.23</p>
                </div>
              </div>
              
              <h3 className="font-medium mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Description</th>
                      <th className="pb-4 font-medium">Book</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    <tr>
                      <td className="py-3">Apr 28, 2025</td>
                      <td className="py-3">Monthly Payout</td>
                      <td className="py-3">All Books</td>
                      <td className="py-3 text-green-400">+$1,256.78</td>
                      <td className="py-3">
                        <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Apr 15, 2025</td>
                      <td className="py-3">Special Promotion</td>
                      <td className="py-3">The Quantum Paradox</td>
                      <td className="py-3 text-green-400">+$342.50</td>
                      <td className="py-3">
                        <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Mar 31, 2025</td>
                      <td className="py-3">Monthly Payout</td>
                      <td className="py-3">All Books</td>
                      <td className="py-3 text-green-400">+$987.45</td>
                      <td className="py-3">
                        <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Mar 15, 2025</td>
                      <td className="py-3">Bonus - High Engagement</td>
                      <td className="py-3">Whispers in the Labyrinth</td>
                      <td className="py-3 text-green-400">+$150.00</td>
                      <td className="py-3">
                        <span className="bg-green-900 text-green-300 text-xs py-1 px-2 rounded-full">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
              
              <div className="bg-gray-750 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-900 p-2 rounded mr-3">
                      <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10C2 7.79086 3.79086 6 6 6H18C20.2091 6 22 7.79086 22 10V14C22 16.2091 20.2091 18 18 18H6C3.79086 18 2 16.2091 2 14V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 10H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 14H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Bank Account</p>
                      <p className="text-sm text-gray-400">
                        •••• •••• •••• 4278
                      </p>
                    </div>
                  </div>
                  <span className="bg-blue-900 text-blue-300 text-xs py-1 px-2 rounded-full">
                    Default
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-purple-900 p-2 rounded mr-3">
                      <svg className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-400">
                        author@example.com
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-500 hover:text-blue-400 text-sm">
                    Make Default
                  </button>
                </div>
              </div>
              
              <button className="mt-6 text-blue-500 hover:text-blue-400 flex items-center">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add New Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Star component
const Star: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className="h-5 w-5"
    fill="currentColor"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default AuthorDashboardPage;