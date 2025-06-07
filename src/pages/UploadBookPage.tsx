import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Mic, Image, AlertCircle, CheckCircle, X, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUploadStore } from '../stores/useUploadStore';
import { BookUploadData } from '../types';

interface FileUploadProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accept: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  icon,
  title,
  description,
  accept,
  onFileSelect,
  selectedFile,
  error
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`mb-6 ${error ? 'border-red-500' : 'border-gray-700'} border-2 rounded-lg p-6`}>
      {selectedFile ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {icon}
              <div className="ml-3">
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-gray-400 truncate max-w-xs">
                  {selectedFile.name}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onFileSelect(null as unknown as File)}
              className="text-gray-400 hover:text-white"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-full"></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Uploaded
            </span>
            <span>{Math.round(selectedFile.size / 1024)} KB</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="cursor-pointer text-center py-8 flex flex-col items-center"
        >
          <div className="mb-4 text-blue-500">{icon}</div>
          <h3 className="font-medium mb-1">{title}</h3>
          <p className="text-sm text-gray-400 mb-4">{description}</p>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm"
          >
            Choose File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

const UploadBookPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { uploadBook, isUploading, progress, error: uploadError } = useUploadStore();
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [voiceSample, setVoiceSample] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const availableCategories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 
    'Mystery', 'Thriller', 'Romance', 'Biography', 'History',
    'Self-Help', 'Business', 'Technology', 'Science', 'Philosophy'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (categories.length === 0) newErrors.categories = 'Select at least one category';
    if (!price.trim()) newErrors.price = 'Price is required';
    else if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      newErrors.price = 'Price must be a valid number';
    }
    
    if (!bookFile) newErrors.bookFile = 'Book PDF is required';
    if (!coverImage) newErrors.coverImage = 'Cover image is required';
    if (!voiceSample) newErrors.voiceSample = 'Voice sample is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const bookData: BookUploadData = {
          title,
          description,
          price: parseFloat(price),
          categories,
          bookFile: bookFile!,
          coverImage: coverImage!,
          voiceSample: voiceSample!
        };

        await uploadBook(bookData);
        setShowSuccess(true);
        
        // Reset form after submission
        setTimeout(() => {
          setBookFile(null);
          setCoverImage(null);
          setVoiceSample(null);
          setTitle('');
          setDescription('');
          setCategories([]);
          setPrice('');
          setShowSuccess(false);
        }, 5000);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(c => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  if (!currentUser?.isAuthor) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Author Access Required</h1>
          <p className="mb-6">You need an author account to upload books to Verbazon.</p>
          <Link to="/author/signup" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
            Create Author Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Upload Your Book</h1>
        <p className="text-gray-300 mb-8">
          Transform your book into an interactive AI experience that readers can talk to.
        </p>
        
        {showSuccess && (
          <div className="bg-green-900 border border-green-700 text-white p-4 rounded-lg mb-8 flex items-start">
            <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Book Successfully Uploaded!</h3>
              <p className="text-green-300 mt-1">
                Your book is now being processed. We'll notify you when it's ready for readers to interact with.
                This typically takes 24-48 hours.
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-400" />
            How it Works
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-300">
            <li>Upload your book as a PDF, your cover image, and a voice sample</li>
            <li>Our AI analyzes your book's content, characters, themes, and writing style</li>
            <li>We create a voice model based on your voice sample</li>
            <li>Your book is transformed into an interactive experience readers can talk to</li>
            <li>Once approved, your book will appear in the Verbazon marketplace</li>
          </ol>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Book Files</h2>
            
            <FileUpload
              icon={<FileText className="h-8 w-8" />}
              title="Book PDF"
              description="Upload your book in PDF format (max 50MB)"
              accept=".pdf"
              onFileSelect={setBookFile}
              selectedFile={bookFile}
              error={errors.bookFile}
            />
            
            <FileUpload
              icon={<Image className="h-8 w-8" />}
              title="Cover Image"
              description="Upload your book cover (JPEG or PNG, min 1600×2400px)"
              accept=".jpg,.jpeg,.png"
              onFileSelect={setCoverImage}
              selectedFile={coverImage}
              error={errors.coverImage}
            />
            
            <FileUpload
              icon={<Mic className="h-8 w-8" />}
              title="Voice Sample"
              description="Upload a clear voice recording (MP3 or WAV, 1-3 minutes)"
              accept=".mp3,.wav"
              onFileSelect={setVoiceSample}
              selectedFile={voiceSample}
              error={errors.voiceSample}
            />
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Book Details</h2>
            
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Book Title*
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${errors.title ? 'border border-red-500' : ''}`}
              />
              {errors.title && (
                <p className="mt-2 text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description*
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${errors.description ? 'border border-red-500' : ''}`}
                placeholder="Provide a compelling description of your book..."
              ></textarea>
              {errors.description && (
                <p className="mt-2 text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Categories*
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`py-1 px-3 rounded-full text-sm ${
                      categories.includes(category) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.categories && (
                <p className="mt-2 text-red-500 text-sm">{errors.categories}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Price ($)*
              </label>
              <input
                type="text"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${errors.price ? 'border border-red-500' : ''}`}
                placeholder="9.99"
              />
              {errors.price && (
                <p className="mt-2 text-red-500 text-sm">{errors.price}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className={`bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg flex items-center
                        ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBookPage;