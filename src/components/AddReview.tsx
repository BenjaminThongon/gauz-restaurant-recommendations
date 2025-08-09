import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { StarRating } from './StarRating'
import { supabase } from '../lib/supabase'

interface AddReviewProps {
  restaurantId: string
  userId: string
  onReviewAdded: () => void
}

export const AddReview: React.FC<AddReviewProps> = ({
  restaurantId,
  userId,
  onReviewAdded
}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0 || !comment.trim()) {
      alert('Please provide both a rating and a comment')
      return
    }

    setIsSubmitting(true)

    try {
      // Get current user to extract Discord username
      const { data: { user } } = await supabase.auth.getUser()
      const discordUsername = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Anonymous'

      const { error } = await supabase
        .from('trips')
        .insert([
          {
            restaurant_id: restaurantId,
            user_id: userId,
            discord_username: discordUsername,
            rating,
            review_text: comment.trim(),
            visit_date: new Date().toISOString().split('T')[0] // Today's date
          }
        ])

      if (error) throw error

      setRating(0)
      setComment('')
      onReviewAdded()
    } catch (error) {
      console.error('Error adding review:', error)
      alert('Failed to add review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card add-review">
      <h3>Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating:</label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={24}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience at this restaurant..."
            className="input review-textarea"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="btn btn-primary submit-review"
        >
          <Send size={16} />
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
