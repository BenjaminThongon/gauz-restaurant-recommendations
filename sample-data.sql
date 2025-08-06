-- Sample data for testing the restaurant review app (trip-based social media style)
-- ⚠️  IMPORTANT: Run database-setup.sql FIRST before running this file!
-- Run these commands in your Supabase SQL editor AFTER setting up the database tables

-- Insert sample restaurants (basic restaurant info only)
INSERT INTO restaurants (name, description, address, cuisine_type, restaurant_type, cost_level, google_maps_link, dietary_restrictions, image_url) VALUES
  ('Bella Italia', 'Authentic Italian cuisine in the heart of downtown. Fresh pasta made daily with imported ingredients.', '123 Main St, Downtown', 'Italian', 'Fine Dining', 'expensive', 'https://maps.google.com/?q=Bella+Italia+Downtown', ARRAY['Vegetarian'], 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'),
  ('Sakura Sushi', 'Traditional Japanese sushi bar offering the freshest fish and expertly crafted rolls.', '456 Oak Ave, Midtown', 'Japanese', 'Casual Dining', 'very-expensive', 'https://maps.google.com/?q=Sakura+Sushi+Midtown', ARRAY['Gluten-Free'], 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop'),
  ('Le Bistro', 'Cozy French bistro serving classic dishes in an intimate atmosphere.', '789 Pine St, Uptown', 'French', 'Bistro', 'very-expensive', 'https://maps.google.com/?q=Le+Bistro+Uptown', ARRAY['Vegetarian', 'Dairy-Free'], 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'),
  ('Spice Garden', 'Vibrant Indian restaurant with aromatic spices and traditional cooking methods.', '321 Elm St, Westside', 'Indian', 'Casual Dining', 'moderate', 'https://maps.google.com/?q=Spice+Garden+Westside', ARRAY['Vegetarian', 'Vegan', 'Halal'], 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop'),
  ('Taco Libre', 'Fresh Mexican street food with authentic flavors and locally sourced ingredients.', '654 Cedar Rd, Eastside', 'Mexican', 'Street Food', 'cheap', 'https://maps.google.com/?q=Taco+Libre+Eastside', ARRAY['Vegetarian', 'Gluten-Free'], 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'),
  ('The Burger Joint', 'Gourmet burgers made with grass-fed beef and artisanal toppings.', '987 Maple Dr, Southside', 'American', 'Casual Dining', 'moderate', 'https://maps.google.com/?q=Burger+Joint+Southside', ARRAY['Gluten-Free'], 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop');

-- Sample trips (user visits/reviews with tripcodes - this is the main social content)
-- Note: In a real app, tripcodes would be generated from user input, these are just examples
INSERT INTO trips (restaurant_id, tripcode, rating, review_text, visit_date) 
SELECT 
  r.id,
  trip_data.tripcode,
  trip_data.rating,
  trip_data.review_text,
  trip_data.visit_date::date
FROM restaurants r
CROSS JOIN (
  VALUES 
    ('Bella Italia', '!AnonymousEater1', 4, 'The carbonara was absolutely incredible! Authentic Italian flavors and the pasta was perfectly al dente. Service was a bit slow but worth the wait.', '2024-12-15'),
    ('Sakura Sushi', '!SushiLover99', 5, 'Best sushi in town! The omakase was fresh and expertly prepared. The chef really knows what they''re doing. Will definitely be back!', '2024-12-10'),
    ('Le Bistro', '!FrenchFoodie', 4, 'Lovely atmosphere and classic French dishes. The coq au vin was perfect. A bit pricey but the quality justifies it.', '2024-12-08'),
    ('Spice Garden', '!CurryKing', 5, 'Amazing Indian food! The spice levels were perfect and they have great vegan options. The naan was fresh and fluffy.', '2024-12-12'),
    ('Taco Libre', '!TacoTuesday', 3, 'Decent street tacos but nothing special. The carnitas were good but could use more flavor. Good value for the price though.', '2024-12-14'),
    ('The Burger Joint', '!BurgerCritic', 4, 'Solid gourmet burger! The grass-fed beef really makes a difference. Sweet potato fries were crispy and delicious.', '2024-12-11')
) AS trip_data(restaurant_name, tripcode, rating, review_text, visit_date)
WHERE r.name = trip_data.restaurant_name;
