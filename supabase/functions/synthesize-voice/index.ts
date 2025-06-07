import { ElevenLabs } from 'npm:elevenlabs-node@2.0.1';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const elevenlabs = new ElevenLabs({
  apiKey: Deno.env.get('ELEVENLABS_API_KEY') ?? '',
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate voice
    const audioBuffer = await elevenlabs.generate({
      text,
      voice_id: voiceId,
      model_id: 'eleven_multilingual_v2',
    });

    // Upload audio to Supabase storage
    const audioPath = `audio/${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
    const { error: uploadError } = await supabaseClient.storage
      .from('voices')
      .upload(audioPath, audioBuffer, {
        contentType: 'audio/mpeg',
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl: audioUrl } } = supabaseClient.storage
      .from('voices')
      .getPublicUrl(audioPath);

    return new Response(
      JSON.stringify({ audioUrl }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});