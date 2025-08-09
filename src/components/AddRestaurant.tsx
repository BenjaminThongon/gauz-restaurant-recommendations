import React, { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { StarRating } from './StarRating'
import { supabase } from '../lib/supabase'

interface AddTripProps {
  onClose: () => void
  onRestaurantAdded: () => void
  userId?: string
}

const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Soy-Free', 'Halal', 'Kosher', 'Keto-Friendly', 'Low-Carb',
  'Sugar-Free', 'Paleo', 'Raw Food', 'Organic'
]

const CUISINE_TYPES = [
  'Italian', 'Japanese', 'French', 'Indian', 'Mexican', 'Chinese', 
  'Thai', 'Korean', 'Greek', 'Spanish', 'Turkish', 'Lebanese',
  'American', 'British', 'German', 'Vietnamese', 'Ethiopian',
  'Moroccan', 'Brazilian', 'Peruvian', 'Mediterranean', 'Fusion'
]

const RESTAURANT_TYPES = [
  'Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe', 'Bar', 
  'Pub', 'Steakhouse', 'Seafood', 'Pizzeria', 'Bakery',
  'Food Truck', 'Buffet', 'Bistro', 'Diner', 'Tapas Bar',
  'Wine Bar', 'Brewery', 'Street Food', 'Dessert Shop'
]

const COST_LEVELS = [
  { value: 'cheap', label: 'Cheap (฿)', description: 'Under ฿500 per person' },
  { value: 'moderate', label: 'Moderate (฿฿)', description: '฿500-1,000 per person' },
  { value: 'expensive', label: 'Expensive (฿฿฿)', description: '฿1,000-2,000 per person' },
  { value: 'very-expensive', label: 'Very Expensive (฿฿฿฿)', description: '฿2,000-3,500 per person' },
  { value: 'extremely-expensive', label: 'Extremely Expensive (฿฿฿฿฿)', description: 'Over ฿3,500 per person' }
]

export const AddRestaurant: React.FC<AddTripProps> = ({
  onClose,
  onRestaurantAdded,
  userId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    cuisine_type: '',
    restaurant_type: '',
    cost_level: 'moderate' as const,
    google_maps_link: '',
    image_base64: ''
  })
  
  const [tripData, setTripData] = useState({
    visit_date: new Date().toISOString().split('T')[0], // Today's date as default
  })
  
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDietaryRestrictionToggle = (restriction: string) => {
    setSelectedDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = reader.result as string
        handleInputChange('image_base64', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get current user to extract Discord username
    const { data: { user } } = await supabase.auth.getUser()
    const discordUsername = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Anonymous'
    
    if (!formData.name || !formData.address || !formData.cuisine_type || !formData.restaurant_type) {
      alert('Please fill in all required fields')
      return
    }

    if (rating === 0) {
      alert('Please provide a rating')
      return
    }

    if (!review.trim()) {
      alert('Please write a review')
      return
    }

    setIsSubmitting(true)

    try {
      // First, check if restaurant already exists
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('name', formData.name)
        .eq('address', formData.address)
        .single()

      let restaurantId: string

      if (existingRestaurant) {
        // Restaurant exists, use its ID
        restaurantId = existingRestaurant.id
      } else {
        // Create new restaurant
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .insert([
            {
              ...formData,
              dietary_restrictions: selectedDietaryRestrictions
            }
          ])
          .select()
          .single()

        if (restaurantError) throw restaurantError
        restaurantId = restaurantData.id
      }

      // Insert trip (the main content - user's visit/review)
      const { error: tripError } = await supabase
        .from('trips')
        .insert([
          {
            restaurant_id: restaurantId,
            discord_username: discordUsername,
            rating,
            review_text: review,
            visit_date: tripData.visit_date,
            user_id: userId || null // Optional for registered users
          }
        ])

      if (tripError) throw tripError

      onRestaurantAdded()
      onClose()
    } catch (error) {
      console.error('Error adding restaurant:', error)
      alert('Failed to add restaurant. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content add-restaurant-modal">
        <div className="modal-header">
          <h2>Add Your Restaurant Trip</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-description">
          <p>Share your restaurant visit! Add the restaurant details and your review with your Discord username.</p>
        </div>

        <form onSubmit={handleSubmit} className="add-restaurant-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Restaurant Name *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Tell us about this restaurant..."
                />
              </div>
            </div>

            {/* Restaurant Details */}
            <div className="form-section">
              <h3>Restaurant Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cuisine_type">Cuisine Type *</label>
                  <select
                    id="cuisine_type"
                    value={formData.cuisine_type}
                    onChange={(e) => handleInputChange('cuisine_type', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select cuisine...</option>
                    {CUISINE_TYPES.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="restaurant_type">Restaurant Type *</label>
                  <select
                    id="restaurant_type"
                    value={formData.restaurant_type}
                    onChange={(e) => handleInputChange('restaurant_type', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select type...</option>
                    {RESTAURANT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Cost Level *</label>
                <div className="cost-level-options">
                  {COST_LEVELS.map(level => (
                    <label key={level.value} className="radio-option">
                      <input
                        type="radio"
                        name="cost_level"
                        value={level.value}
                        checked={formData.cost_level === level.value}
                        onChange={(e) => handleInputChange('cost_level', e.target.value)}
                      />
                      <div className="radio-content">
                        <span className="cost-label">{level.label}</span>
                        <span className="cost-description">{level.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <h3>Additional Information</h3>
              
              <div className="form-group">
                <label htmlFor="google_maps_link">Google Maps Link</label>
                <input
                  id="google_maps_link"
                  type="url"
                  value={formData.google_maps_link}
                  onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
                  className="input"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="visit_date">Visit Date *</label>
                <input
                  id="visit_date"
                  type="date"
                  value={tripData.visit_date}
                  onChange={(e) => setTripData(prev => ({ ...prev, visit_date: e.target.value }))}
                  className="input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Dietary Restrictions</label>
                <div className="checkbox-grid">
                  {DIETARY_RESTRICTIONS.map(restriction => (
                    <label key={restriction} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={selectedDietaryRestrictions.includes(restriction)}
                        onChange={() => handleDietaryRestrictionToggle(restriction)}
                      />
                      <span>{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="image_upload">Upload Image</label>
                <div className="image-upload">
                  <input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="image_upload" className="file-label">
                    <Upload size={20} />
                    Choose Image
                  </label>
                  {formData.image_base64 && (
                    <div className="image-preview">
                      <img 
                        src={formData.image_base64} 
                        alt="Preview" 
                        className="preview-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Your Trip Review */}
            <div className="form-section">
              <h3>Your Trip Review</h3>
              {!userId && (
                <p className="info-note">
                  Anonymous review - your tripcode will be your signature.
                </p>
              )}
              
              <div className="form-group">
                <label>Your Rating *</label>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={28}
                />
              </div>

              <div className="form-group">
                <label htmlFor="review">Your Review *</label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="input"
                  rows={4}
                  placeholder="Share your experience at this restaurant..."
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Restaurant...' : 'Add Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
