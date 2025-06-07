import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Book, Category, BookUploadData } from '../types';
import { useProcessingStore } from './useProcessingStore';

interface BookStore {
  books: Book[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  uploadBook: (bookData: BookUploadData) => Promise<string>;
  purchaseBook: (bookId: string) => Promise<void>;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          ),
          user:user_id (
            id,
            user_metadata->name
          )
        `);

      if (error) throw error;

      const books = data.map(book => ({
        id: book.id,
        title: book.title,
        description: book.description,
        coverImage: book.cover_image_url,
        price: book.price,
        author: {
          id: book.user.id,
          name: book.user.name
        },
        categories: book.categories.map((c: any) => c.name),
        rating: 4.5, // TODO: Implement ratings
        reviewCount: 0, // TODO: Implement reviews
        publishedDate: new Date(book.created_at).toISOString(),
        hasVoice: book.status === 'processed',
        status: book.status
      }));

      set({ books, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;

      const categories = data.map(category => ({
        id: category.slug,
        name: category.name,
        count: 0 // TODO: Implement count
      }));

      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  uploadBook: async (bookData: BookUploadData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Upload book file to storage
      const bookPath = `books/${Date.now()}_${bookData.bookFile.name}`;
      const { error: bookUploadError } = await supabase.storage
        .from('books')
        .upload(bookPath, bookData.bookFile);
      
      if (bookUploadError) throw bookUploadError;

      // Upload cover image to storage
      const coverPath = `covers/${Date.now()}_${bookData.coverImage.name}`;
      const { error: coverUploadError } = await supabase.storage
        .from('books')
        .upload(coverPath, bookData.coverImage);
      
      if (coverUploadError) throw coverUploadError;

      // Upload voice sample to storage
      const voicePath = `voices/${Date.now()}_${bookData.voiceSample.name}`;
      const { error: voiceUploadError } = await supabase.storage
        .from('books')
        .upload(voicePath, bookData.voiceSample);
      
      if (voiceUploadError) throw voiceUploadError;

      // Get public URLs
      const { data: { publicUrl: bookUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(bookPath);
      
      const { data: { publicUrl: coverUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(coverPath);
      
      const { data: { publicUrl: voiceUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(voicePath);

      // Insert book record
      const { data: book, error: insertError } = await supabase
        .from('books')
        .insert({
          title: bookData.title,
          description: bookData.description,
          cover_image_url: coverUrl,
          price: bookData.price,
          file_url: bookUrl,
          voice_sample_url: voiceUrl,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Start processing
      await useProcessingStore.getState().processBook(book.id);

      // Refresh books list
      await get().fetchBooks();
      
      set({ isLoading: false });
      return book.id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  purchaseBook: async (bookId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { error } = await supabase
        .from('user_books')
        .insert({
          book_id: bookId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));