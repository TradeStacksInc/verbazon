export interface User {
  id: string;
  name: string;
  email: string;
  isAuthor: boolean;
  profilePicture?: string;
}

export interface Book {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
  };
  coverImage: string;
  description: string;
  categories: string[];
  price: number;
  rating: number;
  reviewCount: number;
  publishedDate: string;
  hasVoice: boolean;
}

export interface BookDetail extends Book {
  pages: number;
  language: string;
  isbn: string;
  sampleContent: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isVoice?: boolean;
}

export interface BookUploadData {
  title: string;
  description: string;
  price: number;
  categories: string[];
  bookFile: File;
  coverImage: File;
  voiceSample: File;
}