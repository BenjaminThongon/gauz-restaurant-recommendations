-- Sample data for testing the restaurant review app
-- ⚠️  IMPORTANT: Run database-setup.sql FIRST before running this file!
-- Run these commands in your Supabase SQL editor AFTER setting up the database tables

-- Insert sample restaurants with new schema
INSERT INTO restaurants (name, description, address, cuisine_type, restaurant_type, cost_level, google_maps_link, dietary_restrictions, image_url, tripcode) VALUES
  ('Bella Italia', 'Authentic Italian cuisine in the heart of downtown. Fresh pasta made daily with imported ingredients.', '123 Main St, Downtown', 'Italian', 'Fine Dining', 'expensive', 'https://maps.google.com/?q=Bella+Italia+Downtown', ARRAY['Vegetarian'], 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop', 'TRIP001'),
  ('Sakura Sushi', 'Traditional Japanese sushi bar offering the freshest fish and expertly crafted rolls.', '456 Oak Ave, Midtown', 'Japanese', 'Casual Dining', 'very-expensive', 'https://maps.google.com/?q=Sakura+Sushi+Midtown', ARRAY['Gluten-Free'], 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop', 'TRIP002'),
  ('Le Bistro', 'Cozy French bistro serving classic dishes in an intimate atmosphere.', '789 Pine St, Uptown', 'French', 'Bistro', 'very-expensive', 'https://maps.google.com/?q=Le+Bistro+Uptown', ARRAY['Vegetarian', 'Dairy-Free'], 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop', 'TRIP003'),
  ('Spice Garden', 'Vibrant Indian restaurant with aromatic spices and traditional cooking methods.', '321 Elm St, Westside', 'Indian', 'Casual Dining', 'moderate', 'https://maps.google.com/?q=Spice+Garden+Westside', ARRAY['Vegetarian', 'Vegan', 'Halal'], 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop', 'TRIP004'),
  ('Taco Libre', 'Fresh Mexican street food with authentic flavors and locally sourced ingredients.', '654 Cedar Rd, Eastside', 'Mexican', 'Street Food', 'cheap', 'https://maps.google.com/?q=Taco+Libre+Eastside', ARRAY['Vegetarian', 'Gluten-Free'], 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop', 'TRIP005'),
  ('The Burger Joint', 'Gourmet burgers made with grass-fed beef and artisanal toppings.', '987 Maple Dr, Southside', 'American', 'Casual Dining', 'moderate', 'https://maps.google.com/?q=Burger+Joint+Southside', ARRAY['Gluten-Free'], 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', 'TRIP006');

-- Note: You'll need to have user profiles created first to add sample reviews
-- Sample reviews can be added after users sign up through the app
