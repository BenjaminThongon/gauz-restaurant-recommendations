import React from 'react'
import { User, Calendar } from 'lucide-react'
import { StarRating } from './StarRating'
import type { Review } from '../lib/supabase'

interface ReviewCardProps {
  review: Review
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="card review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar">
            <User size={20} />
          </div>
          <div className="reviewer-details">
            <h4 className="tripcode">{review.tripcode}</h4>
            <div className="review-date">
              <Calendar size={14} />
              <span>{formatDate(review.created_at)}</span>
            </div>
          </div>
        </div>
        
        <div className="review-rating">
          <StarRating rating={review.rating} readonly />
        </div>
        {review.visit_date && (
          <div className="visit-date">
            <Calendar size={14} />
            <span>Visited: {formatDate(review.visit_date)}</span>
          </div>
        )}
      </div>

      <div className="review-content">
        <p>{review.review_text}</p>
      </div>
    </div>
  )
}
