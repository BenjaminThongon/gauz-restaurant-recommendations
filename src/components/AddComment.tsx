import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AddCommentProps {
  tripId: string
  userId: string
  onCommentAdded: () => void
}

export const AddComment: React.FC<AddCommentProps> = ({
  tripId,
  userId,
  onCommentAdded
}) => {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      alert('Please write a comment')
      return
    }

    setIsSubmitting(true)

    try {
      // Get current user to extract Discord username
      const { data: { user } } = await supabase.auth.getUser()
      const discordUsername = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'Anonymous'

      const { error } = await supabase
        .from('comments')
        .insert([
          {
            trip_id: tripId,
            user_id: userId,
            discord_username: discordUsername,
            comment_text: comment.trim()
          }
        ])

      if (error) throw error

      setComment('')
      onCommentAdded()
      
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-review">
      <h3>Add Comment</h3>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this trip..."
            className="review-textarea"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary submit-review"
          disabled={isSubmitting || !comment.trim()}
        >
          <Send size={16} />
          {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
        </button>
      </form>
    </div>
  )
}
