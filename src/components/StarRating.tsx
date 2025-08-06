import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 20
}) => {
  const handleStarClick = (index: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className="star-rating">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={`star ${index < rating ? 'filled' : 'empty'} ${!readonly ? 'interactive' : ''}`}
          fill={index < rating ? 'currentColor' : 'none'}
          onClick={() => handleStarClick(index)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        />
      ))}
    </div>
  )
}
