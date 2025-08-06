import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  cuisine_type: string
  restaurant_type: string
  cost_level: 'cheap' | 'moderate' | 'expensive' | 'very-expensive' | 'extremely-expensive'
  google_maps_link?: string
  dietary_restrictions: string[]
  image_url?: string
  image_base64?: string
  created_at: string
}

export interface Trip {
  id: string
  restaurant_id: string
  tripcode: string
  rating: number
  review_text: string
  visit_date: string
  user_id?: string
  created_at: string
}

export interface Review {
  id: string
  restaurant_id: string
  user_id?: string | null  // Optional for anonymous trips
  tripcode: string         // Anonymous signature
  rating: number
  review_text: string      // Changed from 'comment' to 'review_text'
  visit_date?: string      // When they visited
  created_at: string
  profiles?: {
    username: string
    avatar_url?: string
  }
}

export interface Profile {
  id: string
  username: string
  avatar_url?: string
  created_at: string
}
