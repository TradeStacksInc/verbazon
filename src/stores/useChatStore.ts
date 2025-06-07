import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Message } from '../types';
import { useVoiceStore } from './useVoiceStore';

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, bookId: string, conversationId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  createConversation: (bookId: string) => Promise<string>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  sendMessage: async (message: string, bookId: string, conversationId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { publicUrl: functionUrl } } = supabase
        .storage
        .from('functions')
        .getPublicUrl('chat');

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ message, bookId, conversationId })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const { response: aiResponse, audioUrl } = await response.json();

      // Add messages to state
      set(state => ({
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            content: message,
            isUser: true,
            timestamp: new Date().toISOString()
          },
          {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            isUser: false,
            timestamp: new Date().toISOString(),
            audioUrl
          }
        ]
      }));

      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages: Message[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        isUser: msg.is_user,
        timestamp: msg.created_at,
        audioUrl: msg.voice_url
      }));

      set({ messages, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  createConversation: async (bookId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase
        .from('conversations')
        .insert({
          book_id: bookId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data.id;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));