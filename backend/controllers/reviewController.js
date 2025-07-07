import Review from '../models/reviewModel.js';

// Get all reviews for a food item
export const getReviewsForFood = async (req, res) => {
  try {
    const { foodId } = req.params;
    const reviews = await Review.find({ food: foodId }).populate('user', 'name');
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a review
export const addReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user.id,
      food: foodId,
      rating,
      comment,
    });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a review (only by the original user)
export const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: req.user.id },
      { rating, comment },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a review (only by the original user)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const review = await Review.findOneAndDelete({ _id: reviewId, user: req.user.id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 