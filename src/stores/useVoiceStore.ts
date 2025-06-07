import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface VoiceStore {
  isGenerating: boolean;
  error: string | null;
  generateVoice: (text: string, voiceId: string) => Promise<string>;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  isGenerating: false,
  error: null,

  generateVoice: async (text: string, voiceId: string) => {
    try {
      set({ isGenerating: true, error: null });

      const { data: { publicUrl: functionUrl } } = supabase
        .storage
        .from('functions')
        .getPublicUrl('synthesize-voice');

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ text, voiceId })
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const { audioUrl } = await response.json();
      set({ isGenerating: false });
      return audioUrl;
    } catch (error) {
      set({ error: (error as Error).message, isGenerating: false });
      throw error;
    }
  }
}));