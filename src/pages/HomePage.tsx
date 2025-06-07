import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles, MessageSquare, Mic, ExternalLink } from 'lucide-react';
import BookCarousel from '../components/books/BookCarousel';
import CategoryList from '../components/books/CategoryList';
import AnimatedDemo from '../components/demo/AnimatedDemo';
import { mockBooks } from '../data/mockData';

const HomePage: React.FC = () => {
  // Filter books for different sections
  const newReleases = mockBooks.slice(0, 6);
  const trendingBooks = [...mockBooks].sort(() => 0.5 - Math.random()).slice(0, 6);
  const topRated = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90 z-0"></div>
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              The Future of Reading is Conversational
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Discover AI-powered books that you can talk to using the author's voice. 
              Experience reading like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/browse"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg 
                          transition-colors duration-300 text-center flex items-center justify-center"
              >
                Browse Books <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/author/signup"
                className="bg-transparent border border-white text-white font-medium py-3 px-6 rounded-lg 
                          hover:bg-white hover:text-blue-900 transition-colors duration-300 text-center"
              >
                Become an Author
              </Link>
            </div>
            
            {/* Built with Bolt.new attribution in hero */}
            <div className="flex items-center text-gray-300 text-sm">
              <span className="mr-2">Built with</span>
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-300 hover:text-blue-200 transition-colors"
              >
                <span className="font-medium">Bolt.new</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Demo Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <AnimatedDemo />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Verbazon Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Books</h3>
              <p className="text-gray-300">
                Our AI transforms regular books into interactive experiences that understand context, themes, and characters.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Two-Way Communication</h3>
              <p className="text-gray-300">
                Chat with your book! Ask questions, discuss plot points, or dive deeper into any aspect of the story.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 transition-transform duration-300 hover:scale-105">
              <div className="bg-pink-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Author's Voice</h3>
              <p className="text-gray-300">
                Hear responses in the author's own voice, creating an authentic and immersive reading experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Releases</h2>
            <Link to="/browse?category=new-releases" className="text-blue-400 hover:text-blue-300 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <BookCarousel books={newReleases} />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
          <CategoryList />
        </div>
      </section>

      {/* Trending Books Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <Link to="/browse?sort=trending" className="text-blue-400 hover:text-blue-300 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <BookCarousel books={trendingBooks} />
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Top Rated</h2>
            <Link to="/browse?sort=rating" className="text-blue-400 hover:text-blue-300 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <BookCarousel books={topRated} />
        </div>
      </section>

      {/* Author CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-800 to-purple-900">
        <div className="container mx-auto text-center">
          <div className="inline-block mb-6">
            <Sparkles className="h-12 w-12 text-yellow-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Are You an Author?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Transform your books into interactive experiences. Upload your work, add your voice, and reach readers in a whole new way.
          </p>
          <Link 
            to="/author/signup" 
            className="bg-white text-blue-900 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Built with Bolt.new section at bottom */}
      <section className="py-8 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <span className="mr-2">Built with</span>
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <span>Bolt.new</span>
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;