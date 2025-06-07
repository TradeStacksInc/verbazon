import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquare, Mic, ShoppingCart, Share2, BookOpen, Heart } from 'lucide-react';
import { mockBooks } from '../data/mockData';
import { BookDetail } from '../types';

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundBook = mockBooks.find(b => b.id === id);
      if (foundBook) {
        setBook({
          ...foundBook,
          pages: Math.floor(Math.random() * 400) + 100,
          language: 'English',
          isbn: `978-${Math.floor(Math.random() * 10000000000)}`,
          sampleContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, velit vel bibendum bibendum, nunc nisl bibendum nunc, eget bibendum nunc nisl vel velit. Sed euismod, velit vel bibendum bibendum, nunc nisl bibendum nunc, eget bibendum nunc nisl vel velit. Sed euismod, velit vel bibendum bibendum, nunc nisl bibendum nunc, eget bibendum nunc nisl vel velit. Sed euismod, velit vel bibendum bibendum, nunc nisl bibendum nunc, eget bibendum nunc nisl vel velit. Sed euismod, velit vel bibendum bibendum, nunc nisl bibendum nunc, eget bibendum nunc nisl vel velit.'
        });
      }
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/browse" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        {/* Book Header */}
        <div className="bg-gray-800 rounded-lg overflow-hidden p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={book.coverImage} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {book.hasVoice && (
                  <div className="absolute top-3 right-3 bg-blue-600 rounded-full p-2\" title="Voice Enabled">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Book Info */}
            <div className="md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-gray-300 mb-4">by {book.author.name}</p>
              
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-300">
                  {book.rating.toFixed(1)} ({book.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mb-6">
                <div className="text-2xl font-bold text-white mb-1">${book.price.toFixed(2)}</div>
                <p className="text-green-400 text-sm">
                  Available in interactive format with voice capabilities
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center transition-colors">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now
                </button>
                <Link 
                  to={`/read/${book.id}`}
                  className="bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white 
                            py-3 px-6 rounded-lg flex items-center transition-colors"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Reading
                </Link>
                <button className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg flex items-center transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {book.categories.map((category, index) => (
                  <Link 
                    key={index} 
                    to={`/browse?category=${category}`}
                    className="bg-gray-700 py-1 px-3 rounded-full text-sm hover:bg-gray-600 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-6 font-medium text-sm transition-colors ${
                activeTab === 'description' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-6 font-medium text-sm transition-colors ${
                activeTab === 'details' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Book Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-6 font-medium text-sm transition-colors ${
                activeTab === 'reviews' 
                  ? 'border-b-2 border-blue-500 text-blue-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Reviews
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">About this Book</h2>
                <p className="text-gray-300 mb-4">{book.description}</p>
                <p className="text-gray-300 mb-4">{book.description}</p>
                
                <div className="mt-8 bg-gray-700 p-5 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                    Interactive Experience
                  </h3>
                  <p className="text-gray-300 mb-3">
                    This book has been enhanced with our AI technology, allowing you to:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Ask questions about plot points, characters, or themes</li>
                    <li>Discuss interpretations and theories with the book itself</li>
                    <li>Hear responses in the author's authentic voice</li>
                    <li>Dive deeper into the story's world and lore</li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Book Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Title</span>
                      <span>{book.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Author</span>
                      <span>{book.author.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Pages</span>
                      <span>{book.pages}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Language</span>
                      <span>{book.language}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">ISBN</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Published</span>
                      <span>{book.publishedDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Categories</span>
                      <span>{book.categories.join(', ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Voice Enabled</span>
                      <span>{book.hasVoice ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Reader Reviews</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm">
                    Write a Review
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Sample reviews */}
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">Amazing interactive experience!</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      I was skeptical at first, but being able to actually talk to the book and get responses
                      in the author's voice is incredible. It's like having a conversation with the author about their work.
                    </p>
                    <div className="text-sm text-gray-400">
                      <span>Jane D. - May 15, 2025</span>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">A new way to experience books</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      The ability to ask questions about confusing plot points or get deeper background on characters
                      made this so much more engaging than a traditional book. The voice synthesis is almost perfect.
                    </p>
                    <div className="text-sm text-gray-400">
                      <span>Michael T. - April 28, 2025</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < 3 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">Good but needs improvement</span>
                    </div>
                    <p className="text-gray-300 mb-2">
                      The concept is revolutionary, but sometimes the AI misunderstands complex questions or gives
                      generic answers. The voice is impressively like the author though, and when it works well, it's magical.
                    </p>
                    <div className="text-sm text-gray-400">
                      <span>Sam R. - April 10, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Book Sample */}
        <div className="bg-gray-800 rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sample This Book</h2>
          <p className="text-gray-300 mb-6">{book.sampleContent}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Showing sample content (first page)</span>
            <Link 
              to={`/read/${book.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
            >
              Continue Reading
            </Link>
          </div>
        </div>
        
        {/* Recommended Books */}
        <div className="bg-gray-800 rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {mockBooks
              .filter(b => b.id !== book.id && b.categories.some(c => book.categories.includes(c)))
              .slice(0, 6)
              .map(book => (
                <Link 
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="group"
                >
                  <div className="aspect-[2/3] mb-2 overflow-hidden rounded-lg">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-400 text-xs">{book.author.name}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;