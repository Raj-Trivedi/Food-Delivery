import React, { useContext, useState } from 'react';
import './ProductDetail.css';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { food_list, addToCart, CartItems } = useContext(StoreContext);
  const product = food_list.find(item => item._id === id);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, rating: 5, text: 'Amazing food! Loved the taste and quality.', user: 'John Doe', date: '2025-06-15' },
    { id: 2, rating: 4, text: 'Good food, but delivery was a bit late.', user: 'Jane Smith', date: '2025-06-10' }
  ]);
  const [mainImg, setMainImg] = useState(product ? product.image : '');

  const subtitle = product?.subtitle || 'Product Subtitle';
  const reviewCount = reviews.length;
  const averageRating = reviews.length > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;
  const tags = product?.tags || [
    { label: 'Vegetarian', type: 'nonveg' },
    { label: 'Indian', type: 'cuisine' },
    { label: 'Main Course', type: 'course' }
  ];

  if (!product) {
    return <div className="product-not-found">Product not found.</div>;
  }

  // Related products (same category, exclude self)
  const related = food_list.filter(item => item.category === product.category && item._id !== product._id).slice(0, 4);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (review.trim() && rating > 0) {
      const newReview = {
        id: reviews.length + 1,
        rating,
        text: review,
        user: 'You',
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([...reviews, newReview]);
      setReview('');
      setRating(0);
      toast.success('Review submitted successfully!');
    } else {
      toast.error('Please add both rating and review text');
    }
  };

  const handleAddToCart = () => {
    if (!CartItems || !CartItems[product._id]) {
      addToCart(product._id);
      toast.success('Item added to cart', { position: 'bottom-left', autoClose: 1200 });
    } else {
      addToCart(product._id);
    }
  };

  const handleDeleteReview = (reviewId) => {
   
      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Review deleted successfully');
    
  };

  // For thumbnails, use main image for now
  const thumbnails = [product.image, product.image, product.image];

  return (
    <div className="product-detail-container">
      <div className="product-main modern-layout">
        <div className="product-img-section">
          <img src={mainImg} alt={product.name} className="product-detail-img-large" />
          <div className="product-thumbnails">
            {thumbnails.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`product-thumb ${mainImg === img ? 'selected' : ''}`}
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>
        </div>
        <div className="product-info modern-info">
          <h1>{product.name}</h1>
          <div className="product-subtitle">{subtitle}</div>
          <div className="product-rating-row">
            <div className="star-rating">
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
                <div key={r.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {r.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="reviewer-name">{r.user}</div>
                        <div className="review-date">
                          {new Date(r.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
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
                  <div className="review-text">{r.text}
                  {r.user === 'You' && (
                        <button 
                          className="delete-review-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(r.id);
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
                <img src={item.image} alt={item.name} />
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