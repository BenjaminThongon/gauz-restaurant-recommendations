import React from 'react'
import { Star, MapPin, Clock } from 'lucide-react'
import type { Restaurant } from '../lib/supabase'

interface RestaurantCardProps {
  restaurant: Restaurant
  averageRating?: number
  reviewCount?: number
  onClick: () => void
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  averageRating = 0,
  reviewCount = 0,
  onClick
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`star ${i < Math.floor(rating) ? 'filled' : 'empty'}`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ))
  }

  return (
    <div className="card restaurant-card" onClick={onClick}>
      {restaurant.image_url && (
        <div className="restaurant-image">
          <img src={restaurant.image_url} alt={restaurant.name} />
        </div>
      )}
      
      <div className="restaurant-info">
        <div className="restaurant-header">
          <h3>{restaurant.name}</h3>
          <div className="rating-info">
            <div className="star-rating">
              {renderStars(averageRating)}
            </div>
            <span className="rating-text">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <p className="restaurant-description">{restaurant.description}</p>
        
        <div className="restaurant-details">
          <div className="detail">
            <MapPin size={16} />
            <span>{restaurant.address}</span>
          </div>
          <div className="detail">
            <Clock size={16} />
            <span className="cuisine-type">{restaurant.cuisine_type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
