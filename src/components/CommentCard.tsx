import React from 'react'
import { User, Calendar } from 'lucide-react'
import type { Comment } from '../lib/supabase'

interface CommentCardProps {
  comment: Comment
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-author">
          <User size={16} className="user-icon" />
          <span className="author-name">{comment.discord_username}</span>
        </div>
        <div className="comment-date">
          <Calendar size={14} />
          <span>{formatDate(comment.created_at)}</span>
        </div>
      </div>
      <div className="comment-text">
        {comment.comment_text}
      </div>
    </div>
  )
}
