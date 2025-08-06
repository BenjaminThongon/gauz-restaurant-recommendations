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
  user_id?: string
  tripcode?: string
  created_at: string
}

export interface Review {
  id: string
  restaurant_id: string
  user_id: string
  rating: number
  comment: string
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
