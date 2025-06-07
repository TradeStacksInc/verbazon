import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Mic } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Link 
      to={`/book/${book.id}`}
      className="group bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 
                flex flex-col h-full hover:scale-105 hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {book.hasVoice && (
          <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1\" title="Voice Enabled">
            <Mic className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-400 text-sm mb-2">{book.author.name}</p>
        <div className="flex items-center mt-auto">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{book.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-400 text-sm ml-2">({book.reviewCount} reviews)</span>
          <span className="ml-auto text-blue-400">${book.price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;