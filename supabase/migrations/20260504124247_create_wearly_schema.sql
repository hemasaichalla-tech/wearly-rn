/*
  # Wearly App Database Schema

  ## Overview
  Complete schema for the Wearly fashion app including user profiles, outfits, 
  favorites, calendar scheduling, and product comparisons.

  ## New Tables
  1. `users` - Extended user profiles linked to auth.users
     - id (uuid, fk to auth.users)
     - email, username, avatar_url
  
  2. `outfits` - User clothing items with AI-analyzed metadata
     - id, user_id, image_url
     - type, color, style, tags (jsonb)
     - created_at
  
  3. `favorites` - User saved/favorited outfits
     - id, user_id, outfit_id, created_at
  
  4. `calendar_outfits` - One outfit per user per day
     - id, user_id, outfit_id, date
     - Unique constraint: (user_id, date)
  
  5. `outfit_products` - Product recommendations per outfit
     - id, outfit_id, product_name, brand, image_url, price, platform, product_url

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Outfit products readable by outfit owner
*/

-- Create users table (profiles)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  username text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  type text DEFAULT '',
  color text DEFAULT '',
  style text DEFAULT '',
  tags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS outfits_user_id_idx ON outfits(user_id);
CREATE INDEX IF NOT EXISTS outfits_style_idx ON outfits(style);
CREATE INDEX IF NOT EXISTS outfits_type_idx ON outfits(type);

CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outfits"
  ON outfits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own outfits"
  ON outfits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outfits"
  ON outfits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, outfit_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_outfit_id_idx ON favorites(outfit_id);

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create calendar_outfits table
CREATE TABLE IF NOT EXISTS calendar_outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE calendar_outfits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS calendar_outfits_user_id_idx ON calendar_outfits(user_id);
CREATE INDEX IF NOT EXISTS calendar_outfits_date_idx ON calendar_outfits(date);

CREATE POLICY "Users can view own calendar"
  ON calendar_outfits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar entries"
  ON calendar_outfits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar entries"
  ON calendar_outfits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar entries"
  ON calendar_outfits FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create outfit_products table
CREATE TABLE IF NOT EXISTS outfit_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid NOT NULL REFERENCES outfits(id) ON DELETE CASCADE,
  product_name text NOT NULL DEFAULT '',
  brand text DEFAULT '',
  image_url text DEFAULT '',
  price integer DEFAULT 0,
  platform text DEFAULT '',
  product_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE outfit_products ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS outfit_products_outfit_id_idx ON outfit_products(outfit_id);

CREATE POLICY "Users can view products for own outfits"
  ON outfit_products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_products.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products for own outfits"
  ON outfit_products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_products.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products for own outfits"
  ON outfit_products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM outfits
      WHERE outfits.id = outfit_products.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

-- Storage bucket setup (via SQL helper)
INSERT INTO storage.buckets (id, name, public)
VALUES ('outfits', 'outfits', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Authenticated users can upload to outfits bucket"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'outfits' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view outfits images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'outfits');

CREATE POLICY "Users can delete own outfits images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'outfits' AND (storage.foldername(name))[1] = auth.uid()::text);
