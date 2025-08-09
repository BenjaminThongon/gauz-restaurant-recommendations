import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { RestaurantCard } from './components/RestaurantCard'
import { ReviewCard } from './components/ReviewCard'
import { AddComment } from './components/AddComment'
import { CommentCard } from './components/CommentCard'
import { AddRestaurant } from './components/AddRestaurant'
import { supabase, type Restaurant, type Review, type Comment } from './lib/supabase'
import { ArrowLeft } from 'lucide-react'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [allReviews, setAllReviews] = useState<Review[]>([]) // Store all reviews for homepage calculations
  const [comments, setComments] = useState<Comment[]>([]) // Comments for the selected trip log
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // For image modal
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddRestaurant, setShowAddRestaurant] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchRestaurants()
    fetchAllReviews() // Fetch all reviews for homepage calculations
  }, [])

  useEffect(() => {
    if (selectedRestaurant) {
      fetchReviews(selectedRestaurant.id)
    }
  }, [selectedRestaurant])

  useEffect(() => {
    // When reviews are loaded, fetch comments for the first review (the trip log we're viewing)
    if (reviews.length > 0) {
      fetchComments(reviews[0].id) // Get comments for the most recent trip log
    }
  }, [reviews])

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRestaurants(data || [])
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllReviews(data || [])
    } catch (error) {
      console.error('Error fetching all reviews:', error)
    }
  }

  const fetchReviews = async (restaurantId: string) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const fetchComments = async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const calculateAverageRating = (restaurantId: string) => {
    // Use allReviews for homepage calculations, reviews for detail view
    const reviewsToUse = selectedRestaurant ? reviews : allReviews
    const restaurantReviews = reviewsToUse.filter(r => r.restaurant_id === restaurantId)
    if (restaurantReviews.length === 0) return 0
    const sum = restaurantReviews.reduce((acc, review) => acc + review.rating, 0)
    return sum / restaurantReviews.length
  }

  const getReviewCount = (restaurantId: string) => {
    // Use allReviews for homepage calculations, reviews for detail view
    const reviewsToUse = selectedRestaurant ? reviews : allReviews
    return reviewsToUse.filter(r => r.restaurant_id === restaurantId).length
  }

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  const handleBackToList = () => {
    setSelectedRestaurant(null)
    setReviews([])
  }

  const handleCommentAdded = () => {
    // Refresh comments for the current trip log
    if (reviews.length > 0) {
      fetchComments(reviews[0].id)
    }
  }

  const handleRestaurantAdded = () => {
    fetchRestaurants()
    fetchAllReviews() // Refresh all reviews to include any new reviews from the add form
    setShowAddRestaurant(false)
  }

  const handleAddRestaurant = () => {
    setShowAddRestaurant(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        user={user}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddRestaurant={handleAddRestaurant}
      />

      <main className="main-content">
        <div className="container">
          {selectedRestaurant ? (
            // Restaurant Detail View
            <div className="restaurant-detail">
              <div className="detail-header">
                <button
                  onClick={handleBackToList}
                  className="btn btn-secondary back-btn"
                >
                  <ArrowLeft size={16} />
                  Back to Restaurants
                </button>
              </div>

              <div className="restaurant-info-detail">
                {((selectedRestaurant.image_base64s && selectedRestaurant.image_base64s.length > 0) || 
                  selectedRestaurant.image_url || selectedRestaurant.image_base64) && (
                  <div className="restaurant-images-gallery">
                    {selectedRestaurant.image_base64s && selectedRestaurant.image_base64s.length > 0 ? (
                      // Multiple images from new system
                      <div className="image-gallery">
                        {selectedRestaurant.image_base64s.map((image, index) => (
                          <div key={index} className="gallery-image" onClick={() => setSelectedImage(image)}>
                            <img 
                              src={image} 
                              alt={`${selectedRestaurant.name} ${index + 1}`} 
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Fallback to single image from old system
                      <div className="restaurant-image-large">
                        <img 
                          src={selectedRestaurant.image_base64 || selectedRestaurant.image_url} 
                          alt={selectedRestaurant.name}
                          onClick={() => setSelectedImage(selectedRestaurant.image_base64 || selectedRestaurant.image_url || '')}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                <div className="restaurant-meta">
                  <h1>{selectedRestaurant.name}</h1>
                  <p className="restaurant-description">{selectedRestaurant.description}</p>
                  <div className="restaurant-details">
                    <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine_type}</p>
                    <p><strong>Restaurant Type:</strong> {selectedRestaurant.restaurant_type}</p>
                    <p><strong>Address:</strong> {selectedRestaurant.address}</p>
                    {selectedRestaurant.google_maps_link && (
                      <p>
                        <strong>Maps:</strong>{' '}
                        <a 
                          href={selectedRestaurant.google_maps_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="maps-link"
                        >
                          View on Google Maps
                        </a>
                      </p>
                    )}
                    {selectedRestaurant.dietary_restrictions && selectedRestaurant.dietary_restrictions.length > 0 && (
                      <div className="dietary-info">
                        <strong>Dietary Options:</strong>
                        <div className="dietary-tags">
                          {selectedRestaurant.dietary_restrictions.map(restriction => (
                            <span key={restriction} className="dietary-tag">
                              {restriction}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="reviews-section">
                <div className="reviews-header">
                  <h2>Trip Log</h2>
                  {reviews.length > 0 && (
                    <div className="average-rating">
                      Rating: {reviews[0].rating} stars
                    </div>
                  )}
                </div>

                <div className="trip-log">
                  {reviews.length > 0 ? (
                    <ReviewCard key={reviews[0].id} review={reviews[0]} />
                  ) : (
                    <div className="no-reviews">
                      <p>No trip log found for this restaurant!</p>
                    </div>
                  )}
                </div>

                <div className="comments-section">
                  <div className="comments-header">
                    <h3>Comments ({comments.length})</h3>
                  </div>

                  {user && reviews.length > 0 && (
                    <AddComment
                      tripId={reviews[0].id}
                      userId={user.id}
                      onCommentAdded={handleCommentAdded}
                    />
                  )}

                  <div className="comments-list">
                    {comments.length > 0 ? (
                      comments.map(comment => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))
                    ) : (
                      <div className="no-comments">
                        <p>No comments yet. Be the first to comment on this trip!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Restaurant List View
            <div className="restaurant-list">
              <div className="list-header">
                <h1>Discover Great Restaurants</h1>
                <p>Find and review your favorite dining spots</p>
              </div>

              {filteredRestaurants.length > 0 ? (
                <div className="restaurants-grid">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      averageRating={calculateAverageRating(restaurant.id)}
                      reviewCount={getReviewCount(restaurant.id)}
                      onClick={() => handleRestaurantClick(restaurant)}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No restaurants found matching your search.</p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="btn btn-secondary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full size" />
            <button 
              className="close-modal" 
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showAddRestaurant && (
        <AddRestaurant
          onClose={() => setShowAddRestaurant(false)}
          onRestaurantAdded={handleRestaurantAdded}
          userId={user?.id}
        />
      )}
    </div>
  )
}

export default App
