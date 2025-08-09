-- Database setup for NibbleNet App
-- Run these commands in your Supabase SQL Editor in order

-- Drop existing tables if they exist (in reverse order due to foreign keys)
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Create profiles table first (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create restaurants table (now can reference profiles)
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  restaurant_type TEXT NOT NULL,
  cost_level TEXT NOT NULL CHECK (cost_level IN ('cheap', 'moderate', 'expensive', 'very-expensive', 'extremely-expensive')),
  google_maps_link TEXT,
  dietary_restrictions TEXT[], -- Array of dietary restrictions
  image_url TEXT,
  image_base64 TEXT, -- For uploaded images
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create trips table (replaces reviews - this is the main content)
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  tripcode TEXT NOT NULL, -- Hashed anonymous signature (like 4chan tripcodes)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  visit_date DATE, -- When they visited the restaurant
  user_id UUID REFERENCES profiles(id), -- Optional - for registered users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Restaurants are viewable by everyone" ON restaurants;
DROP POLICY IF EXISTS "Anyone can insert restaurants" ON restaurants;
DROP POLICY IF EXISTS "Authenticated users can insert restaurants" ON restaurants;
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Trips are viewable by everyone" ON trips;
DROP POLICY IF EXISTS "Anyone can insert trips" ON trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON trips;

-- 5. Create policies for restaurants (public read)
CREATE POLICY "Restaurants are viewable by everyone" 
  ON restaurants FOR SELECT 
  USING (true);

-- Allow anyone to insert restaurants (public access)
CREATE POLICY "Anyone can insert restaurants" 
  ON restaurants FOR INSERT 
  WITH CHECK (true);

-- 6. Create policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 7. Create policies for trips (the main content - restaurant visits with reviews)
CREATE POLICY "Trips are viewable by everyone" 
  ON trips FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can insert trips" 
  ON trips FOR INSERT 
  WITH CHECK (true);

-- Optional: Allow users to update their own trips (by tripcode or user_id)
CREATE POLICY "Users can update their own trips" 
  ON trips FOR UPDATE 
  USING (auth.uid() = user_id OR tripcode IS NOT NULL);

CREATE POLICY "Users can delete their own trips" 
  ON trips FOR DELETE 
  USING (auth.uid() = user_id);

-- 8. Create function to automatically create profile on user signup
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create trigger to call the function when a new user signs up (only if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
