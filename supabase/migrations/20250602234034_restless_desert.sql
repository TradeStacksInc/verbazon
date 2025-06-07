/*
  # Initial Schema Setup

  1. New Tables
    - books: Stores book information and content
    - categories: Available book categories
    - book_categories: Many-to-many relationship between books and categories
    - user_books: Tracks user's purchased books and reading progress
    - conversations: Stores chat sessions between users and books
    - messages: Individual messages in conversations

  2. Security
    - Enable RLS on all tables
    - Add policies for data access control
    
  3. Initial Data
    - Insert default categories
*/

-- Create tables
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  cover_image_url text NOT NULL,
  voice_model_id text,
  price numeric NOT NULL CHECK (price >= 0),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS book_categories (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

CREATE TABLE IF NOT EXISTS user_books (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_read_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, book_id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_user boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  voice_url text
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public books are viewable by everyone" ON books
  FOR SELECT USING (true);

CREATE POLICY "Authors can insert their own books" ON books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors can update their own books" ON books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Book categories are viewable by everyone" ON book_categories
  FOR SELECT USING (true);

CREATE POLICY "Users can view their purchased books" ON user_books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their reading progress" ON user_books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations for purchased books" ON conversations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_books
      WHERE user_books.user_id = auth.uid()
      AND user_books.book_id = conversations.book_id
    )
  );

CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their conversations" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Insert initial categories
INSERT INTO categories (name, slug) VALUES
  ('Fiction', 'fiction'),
  ('Non-Fiction', 'non-fiction'),
  ('Science Fiction', 'science-fiction'),
  ('Fantasy', 'fantasy'),
  ('Mystery', 'mystery'),
  ('Thriller', 'thriller'),
  ('Romance', 'romance'),
  ('Horror', 'horror'),
  ('Biography', 'biography'),
  ('History', 'history'),
  ('Self-Help', 'self-help'),
  ('Business', 'business'),
  ('Technology', 'technology'),
  ('Science', 'science')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for books table
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();