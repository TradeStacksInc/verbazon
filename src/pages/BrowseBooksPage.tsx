import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';
import BookCard from '../components/books/BookCard';
import { mockBooks, mockCategories } from '../data/mockData';
import { Book } from '../types';

const BrowseBooksPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';
  const initialSort = queryParams.get('sort') || 'newest';

  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate API call with timeout
    setTimeout(() => {
      setBooks(mockBooks);
    }, 500);
  }, []);

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortOrder !== 'newest') params.set('sort', sortOrder);
    
    window.history.replaceState(
      {}, 
      '', 
      `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    );

    // Apply filters
    let result = [...books];
    
    if (selectedCategory) {
      result = result.filter(book => book.categories.includes(selectedCategory));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.name.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'trending':
        // For demo purposes, we'll use a combination of rating and review count
        result.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
        break;
    }
    
    setFilteredBooks(result);
  }, [books, selectedCategory, searchQuery, sortOrder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Interactive Books</h1>
        
        {/* Search and Filters Bar */}
        <div className="bg-gray-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-grow">
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleFilters}
                className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg flex items-center"
                aria-expanded={showFilters}
              >
                <Filter className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Filters</span>
              </button>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="trending">Trending</option>
              </select>
              
              <div className="flex bg-gray-700 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600' : ''}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600' : ''}`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`py-1 px-3 rounded-full text-sm ${
                    selectedCategory === '' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  All
                </button>
                {mockCategories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`py-1 px-3 rounded-full text-sm ${
                      selectedCategory === category.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            Showing {filteredBooks.length} of {books.length} books
            {selectedCategory && ` in ${mockCategories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        
        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map(book => (
                <div 
                  key={book.id}
                  className="bg-gray-800 rounded-lg overflow-hidden flex hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-24 sm:w-32 flex-shrink-0">
                    <img 
                      src={book.coverImage} 
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-lg mb-1">{book.title}</h3>
                    <p className="text-gray-400 text-sm mb-1">{book.author.name}</p>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">{book.description}</p>
                    <div className="flex items-center mt-auto">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${i < Math.round(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">({book.reviewCount} reviews)</span>
                      </div>
                      <span className="ml-auto text-blue-400 font-medium">${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No books found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="mt-4 text-blue-400 hover:text-blue-300"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Star component for the list view
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    width="16" 
    height="16"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default BrowseBooksPage;