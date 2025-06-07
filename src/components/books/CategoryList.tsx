import React from 'react';
import { Link } from 'react-router-dom';
import { mockCategories } from '../../data/mockData';

const CategoryList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockCategories.map(category => (
        <Link
          key={category.id}
          to={`/browse?category=${category.id}`}
          className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 
                   flex flex-col items-center text-center"
        >
          <h3 className="font-medium mb-1">{category.name}</h3>
          <span className="text-sm text-gray-400">{category.count} books</span>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;