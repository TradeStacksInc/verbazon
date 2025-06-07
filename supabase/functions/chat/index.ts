import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { ElevenLabs } from 'npm:elevenlabs-node@2.0.1';

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
    const { message, bookId, conversationId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get book data and embeddings
    const { data: book, error: bookError } = await supabaseClient
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError) throw bookError;

    // Generate AI response using embeddings
    const model = new Supabase.ai.Session('gte-small');
    const messageEmbedding = await model.run(message, { mean_pool: true, normalize: true });
    
    // Find relevant context from book embeddings
    const relevantContext = findRelevantContext(messageEmbedding, book.embeddings);
    
    // Generate response based on context
    const response = generateResponse(message, relevantContext);

    // Generate voice for response
    const audioBuffer = await elevenlabs.generate({
      text: response,
      voice_id: book.voice_id,
      model_id: 'eleven_multilingual_v2',
    });

    // Upload audio to storage
    const audioPath = `audio/${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
    const { error: uploadError } = await supabaseClient.storage
      .from('audio')
      .upload(audioPath, audioBuffer, {
        contentType: 'audio/mpeg',
      });

    if (uploadError) throw uploadError;

    // Get audio URL
    const { data: { publicUrl: audioUrl } } = supabaseClient.storage
      .from('audio')
      .getPublicUrl(audioPath);

    // Save message and response
    const { error: messageError } = await supabaseClient
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          content: message,
          is_user: true,
        },
        {
          conversation_id: conversationId,
          content: response,
          is_user: false,
          voice_url: audioUrl,
        }
      ]);

    if (messageError) throw messageError;

    return new Response(
      JSON.stringify({ response, audioUrl }),
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

function findRelevantContext(messageEmbedding: number[], bookEmbeddings: any[]): string {
  // Find most similar sections using cosine similarity
  const similarities = bookEmbeddings.map(section => ({
    text: section.text,
    similarity: cosineSimilarity(messageEmbedding, section.embedding)
  }));

  // Sort by similarity and take top results
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(s => s.text)
    .join('\n');
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (normA * normB);
}

function generateResponse(message: string, context: string): string {
  // Simple response generation based on context
  // In a production environment, this would use a more sophisticated language model
  return `Based on the book's content: ${context}\n\nIn response to your question: ${message}`;
}