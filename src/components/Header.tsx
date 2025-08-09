import React from 'react'
import { Search, Star, User, LogOut, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface HeaderProps {
  user: any
  searchTerm: string
  onSearchChange: (term: string) => void
  onAddRestaurant: () => void
}

export const Header: React.FC<HeaderProps> = ({ user, searchTerm, onSearchChange, onAddRestaurant }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Star className="logo-icon" />
            <h1>NibbleNet</h1>
          </div>
          
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input search-input"
            />
          </div>

          <div className="user-menu">
            <button 
              onClick={onAddRestaurant}
              className="btn btn-primary add-restaurant-btn"
              title="Add your restaurant trip/review"
            >
              <Plus size={16} />
              Add Trip
            </button>
            
            {user ? (
              <div className="user-info">
                <User className="user-icon" />
                <span>{user.email}</span>
                <button onClick={handleSignOut} className="btn btn-secondary">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                {/* Authentication buttons removed */}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
