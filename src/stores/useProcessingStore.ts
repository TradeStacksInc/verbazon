import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ProcessingStore {
  processingBooks: string[];
  isProcessing: boolean;
  error: string | null;
  processBook: (bookId: string) => Promise<void>;
  checkProcessingStatus: (bookId: string) => Promise<boolean>;
}

export const useProcessingStore = create<ProcessingStore>((set, get) => ({
  processingBooks: [],
  isProcessing: false,
  error: null,

  processBook: async (bookId: string) => {
    try {
      set({ isProcessing: true, error: null });
      
      // Add book to processing list
      set(state => ({
        processingBooks: [...state.processingBooks, bookId]
      }));

      const { data: { publicUrl: functionUrl } } = supabase
        .storage
        .from('functions')
        .getPublicUrl('process-book');

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ bookId })
      });

      if (!response.ok) {
        throw new Error('Failed to process book');
      }

      // Remove book from processing list
      set(state => ({
        processingBooks: state.processingBooks.filter(id => id !== bookId)
      }));

      set({ isProcessing: false });
    } catch (error) {
      set({ 
        error: (error as Error).message,
        isProcessing: false,
        processingBooks: get().processingBooks.filter(id => id !== bookId)
      });
      throw error;
    }
  },

  checkProcessingStatus: async (bookId: string) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('status')
        .eq('id', bookId)
        .single();

      if (error) throw error;

      return data.status === 'processed';
    } catch (error) {
      console.error('Failed to check processing status:', error);
      return false;
    }
  }
}));