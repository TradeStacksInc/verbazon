import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { BookUploadData } from '../types';
import { useBookStore } from './useBookStore';

interface UploadStore {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadBook: (bookData: BookUploadData) => Promise<string>;
}

export const useUploadStore = create<UploadStore>((set) => ({
  isUploading: false,
  progress: 0,
  error: null,

  uploadBook: async (bookData: BookUploadData) => {
    try {
      set({ isUploading: true, progress: 0, error: null });

      // Upload files in parallel
      const [bookUpload, coverUpload, voiceUpload] = await Promise.all([
        // Upload book PDF
        supabase.storage
          .from('books')
          .upload(`${Date.now()}_${bookData.bookFile.name}`, bookData.bookFile, {
            onUploadProgress: (progress) => {
              set({ progress: (progress.loaded / progress.total) * 0.4 });
            }
          }),

        // Upload cover image
        supabase.storage
          .from('covers')
          .upload(`${Date.now()}_${bookData.coverImage.name}`, bookData.coverImage, {
            onUploadProgress: (progress) => {
              set({ progress: 0.4 + (progress.loaded / progress.total) * 0.3 });
            }
          }),

        // Upload voice sample
        supabase.storage
          .from('voices')
          .upload(`${Date.now()}_${bookData.voiceSample.name}`, bookData.voiceSample, {
            onUploadProgress: (progress) => {
              set({ progress: 0.7 + (progress.loaded / progress.total) * 0.3 });
            }
          })
      ]);

      // Check for upload errors
      if (bookUpload.error) throw bookUpload.error;
      if (coverUpload.error) throw coverUpload.error;
      if (voiceUpload.error) throw voiceUpload.error;

      // Get public URLs
      const { data: { publicUrl: bookUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(bookUpload.data.path);
      
      const { data: { publicUrl: coverUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(coverUpload.data.path);
      
      const { data: { publicUrl: voiceUrl } } = supabase.storage
        .from('voices')
        .getPublicUrl(voiceUpload.data.path);

      // Create book record
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

      // Add categories
      if (bookData.categories.length > 0) {
        const { error: categoriesError } = await supabase
          .from('book_categories')
          .insert(
            bookData.categories.map(categoryId => ({
              book_id: book.id,
              category_id: categoryId
            }))
          );

        if (categoriesError) throw categoriesError;
      }

      // Refresh books list
      await useBookStore.getState().fetchBooks();

      set({ isUploading: false, progress: 1 });
      return book.id;
    } catch (error) {
      set({ error: (error as Error).message, isUploading: false });
      throw error;
    }
  }
}));