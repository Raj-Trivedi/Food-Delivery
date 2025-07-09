import React, { useContext, useState, useEffect } from 'react';
import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('/upload')) {
    return `http://localhost:5000${img}`;
  }
  return img;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, addToCart, CartItems } = useContext(StoreContext);
  const product = food_list.find(item => item._id === id);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [mainImg, setMainImg] = useState(product ? product.image : '');
  const { currentUserId } = useContext(StoreContext);

  const subtitle = product?.subtitle || 'Product Subtitle';
  const reviewCount = reviews.length;
  const averageRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;
  const tags = product?.tags || [
    { label: 'Vegetarian', type: 'nonveg' },
    { label: 'Indian', type: 'cuisine' },
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await fetch(`/api/review/${id}`);
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        } else {
          setReviewsError(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setReviewsError('Failed to fetch reviews');
      }
      setReviewsLoading(false);
    };
    fetchReviews();
  }, [id]);

  if (!product) {
    return <div className="product-not-found">Product not found.</div>;
  }

  // Related products (same category, exclude self)
  const related = food_list.filter(item => item.category === product.category && item._id !== product._id).slice(0, 4);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review.trim() && rating > 0) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must be logged in to submit a review');
        return;
      }
      try {
        const res = await fetch('/api/review/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            foodId: id,
            rating,
            comment: review
          })
        });
        const data = await res.json();
        if (data.success && data.review) {
          setReviews([...reviews, data.review]);
          setReview('');
          setRating(0);
          toast.success('Review submitted successfully!');
        } else {
          toast.error(data.message || 'Failed to submit review');
        }
      } catch (err) {
        toast.error('Failed to submit review');
      }
    } else {
      toast.error('Please add both rating and review text');
    }
  };

  const handleAddToCart = () => {
    if (!CartItems || !CartItems[product._id]) {
      addToCart(product._id);
      //  toast.success('Item added to cart', { position: 'top-center', autoClose: 1200 });
    } else {
      addToCart(product._id);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/review/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    // Refetch reviews after delete
    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const res = await fetch(`/api/review/${id}`);
        const data = await res.json();
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        } else {
          setReviewsError(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setReviewsError('Failed to fetch reviews');
      }
      setReviewsLoading(false);
    };
    fetchReviews();
  };

  // For thumbnails, use main image for now
  const thumbnails = [product.image, product.image, product.image];

  return (
    <div className="product-detail-container">
      <div className="product-main modern-layout">
        <div className="product-img-section">
          {mainImg && mainImg !== "" && (
            <img src={getImageUrl(mainImg)} alt={product.name} className="product-detail-img-large" />
          )}
          
        </div>
        <div className="product-info modern-info">
          <h1>{product.name}</h1>
          <div className="product-subtitle">{subtitle}</div>
          <div className="product-rating-row">
          <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="product-review-count">({reviewCount} reviews)</span>
          </div>
          <div className="product-tags">
            {tags.map((tag, idx) => (
              <span key={idx} className={`product-tag tag-${tag.type}`}>{tag.label}</span>
            ))}
          </div>
          <div className="product-price-row">
            <span className="product-price">Price <b>₹{product.price.toFixed(2)}</b></span>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <p className="product-long-desc">{product.longDescription || 'This is a long description of the product. More details can be added here.'}</p>
        </div>
      </div>

      <div className="product-review-section">
        <h2>Customer Reviews</h2>
        {reviewsLoading ? <p>Loading reviews...</p> : reviewsError ? <p style={{color:'red'}}>{reviewsError}</p> : (
        <>
        <div className="rating-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="review-count">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
          </div>
          
          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter(r => Math.round(r.rating) === star).length;
              const percentage = reviewCount ? (count / reviewCount) * 100 : 0;
              
              return (
                <div key={star} className="rating-bar">
                  <span className="star-label">{star} ★</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="write-review">
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="star-rating-input">
              <span className="rating-label">Your Rating:</span>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hover || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </span>
                ))}
                <span className="rating-text">
                  {rating === 0 ? 'Rate this product' : 
                   rating === 1 ? 'Poor' :
                   rating === 2 ? 'Fair' :
                   rating === 3 ? 'Good' :
                   rating === 4 ? 'Very Good' : 'Excellent'}
                </span>
              </div>
            </div>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              rows="4"
              required
            />
            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        </div>

        <div className="reviews-list">
          <h3>Customer Reviews ({reviewCount})</h3>
          {reviews.length === 0 ? (
            <div className="no-reviews">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="reviews-container">
              {[...reviews].reverse().map((r) => (
                <div key={r._id || r.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {r.user?.name?.charAt(0) || r.user?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <div className="reviewer-name">{r.user && r.user.name ? r.user.name : "Anonymous"}</div>
                        <div className="review-date">
                          {r.date ? new Date(r.date).toLocaleDateString() : ''}
                        </div>
                      </div>
                    </div>
                    <div className="review-actions">
                      <div className="review-rating">
                        {Array(5).fill().map((_, i) => (
                          <span 
                            key={i} 
                            className={`star ${i < r.rating ? 'filled' : ''}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                     
                    </div>
                  </div>
                  <div className="review-text">{r.comment}
                  {r.user && r.user._id === currentUserId && (
                        <button 
                          className="delete-review-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(r._id);
                          }}
                          title="Delete review"
                          aria-label="Delete review"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {related.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-list">
            {related.map(item => (
              <div 
                key={item._id} 
                className="related-card" 
                onClick={() => navigate(`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}/${item._id}`)}
              >
                <img src={getImageUrl(item.image)} alt={item.name} />
                <div className="related-info">
                  <h4>{item.name}</h4>
                  <div className="related-price">₹{item.price.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-left" autoClose={3000} />
    </div>
  );
};

export default ProductDetail;