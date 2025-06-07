import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get book data
    const { data: book, error: bookError } = await supabaseClient
      .from('books')
      .select('*')
      .eq('id', bookId)
      .single();

    if (bookError) throw bookError;

    // Download book file
    const { data: bookData, error: downloadError } = await supabaseClient
      .storage
      .from('books')
      .download(book.file_url);

    if (downloadError) throw downloadError;

    // Process book content (text extraction, analysis, etc.)
    const bookContent = await bookData.text();
    
    // Generate embeddings using Supabase's built-in AI
    const model = new Supabase.ai.Session('gte-small');
    const embeddings = await model.run(bookContent, { mean_pool: true, normalize: true });

    // Process voice sample
    const { data: voiceData, error: voiceError } = await supabaseClient
      .storage
      .from('books')
      .download(book.voice_sample_url);

    if (voiceError) throw voiceError;

    // Update book status
    const { error: updateError } = await supabaseClient
      .from('books')
      .update({
        status: 'processed',
        embeddings,
        processed_at: new Date().toISOString()
      })
      .eq('id', bookId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ success: true }),
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