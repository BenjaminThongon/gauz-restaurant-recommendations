import React from 'react'
import { Star, MapPin, DollarSign, Globe, Tag, ExternalLink } from 'lucide-react'
import type { Restaurant } from '../lib/supabase'

interface RestaurantCardProps {
  restaurant: Restaurant
  averageRating?: number
  reviewCount?: number
  onClick: () => void
}

const getCostLevelDisplay = (level: string) => {
  const levels = {
    'cheap': '฿',
    'moderate': '฿฿',
    'expensive': '฿฿฿',
    'very-expensive': '฿฿฿฿',
    'extremely-expensive': '฿฿฿฿฿'
  }
  return levels[level as keyof typeof levels] || '฿฿'
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

  const imageUrl = restaurant.image_base64 || restaurant.image_url

  return (
    <div className="card restaurant-card" onClick={onClick}>
      {imageUrl && (
        <div className="restaurant-image">
          <img src={imageUrl} alt={restaurant.name} />
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
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'} ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <p className="restaurant-description">{restaurant.description}</p>
        
        <div className="restaurant-details">
          <div className="detail">
            <MapPin size={16} />
            <span>{restaurant.address}</span>
          </div>
          
          <div className="detail-row">
            <div className="detail">
              <Globe size={16} />
              <span className="cuisine-type">{restaurant.cuisine_type}</span>
            </div>
            <div className="detail">
              <Tag size={16} />
              <span className="restaurant-type">{restaurant.restaurant_type}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail">
              <DollarSign size={16} />
              <span className="cost-level">{getCostLevelDisplay(restaurant.cost_level)}</span>
            </div>
            {restaurant.google_maps_link && (
              <a 
                href={restaurant.google_maps_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="maps-link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
                Maps
              </a>
            )}
          </div>

          {restaurant.dietary_restrictions && restaurant.dietary_restrictions.length > 0 && (
            <div className="dietary-restrictions">
              <span className="dietary-label">Dietary:</span>
              <div className="dietary-tags">
                {restaurant.dietary_restrictions.slice(0, 3).map(restriction => (
                  <span key={restriction} className="dietary-tag">
                    {restriction}
                  </span>
                ))}
                {restaurant.dietary_restrictions.length > 3 && (
                  <span className="dietary-more">
                    +{restaurant.dietary_restrictions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
