import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { RestaurantCard } from './components/RestaurantCard'
import { ReviewCard } from './components/ReviewCard'
import { AddReview } from './components/AddReview'
import { AddRestaurant } from './components/AddRestaurant'
import { supabase, type Restaurant, type Review } from './lib/supabase'
import { ArrowLeft } from 'lucide-react'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [allReviews, setAllReviews] = useState<Review[]>([]) // Store all reviews for homepage calculations
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
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

  const handleReviewAdded = () => {
    if (selectedRestaurant) {
      fetchReviews(selectedRestaurant.id)
    }
    fetchAllReviews() // Refresh all reviews for homepage calculations
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
                {selectedRestaurant.image_url && (
                  <div className="restaurant-image-large">
                    <img src={selectedRestaurant.image_url} alt={selectedRestaurant.name} />
                  </div>
                )}
                
                <div className="restaurant-meta">
                  <h1>{selectedRestaurant.name}</h1>
                  <p className="restaurant-description">{selectedRestaurant.description}</p>
                  <div className="restaurant-details">
                    <p><strong>Cuisine:</strong> {selectedRestaurant.cuisine_type}</p>
                    <p><strong>Address:</strong> {selectedRestaurant.address}</p>
                  </div>
                </div>
              </div>

              <div className="reviews-section">
                <div className="reviews-header">
                  <h2>Reviews ({reviews.length})</h2>
                  {calculateAverageRating(selectedRestaurant.id) > 0 && (
                    <div className="average-rating">
                      Average: {calculateAverageRating(selectedRestaurant.id).toFixed(1)} stars
                    </div>
                  )}
                </div>

                {user && (
                  <AddReview
                    restaurantId={selectedRestaurant.id}
                    userId={user.id}
                    onReviewAdded={handleReviewAdded}
                  />
                )}

                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  ) : (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this restaurant!</p>
                    </div>
                  )}
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
