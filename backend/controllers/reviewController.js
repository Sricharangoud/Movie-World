global.mockDB = global.mockDB || { reviews: [] };
let reviewIdCounter = 1;

export const addReview = async (req, res) => {
  const { movieId, rating, comment } = req.body;

  const review = {
    _id: String(reviewIdCounter++),
    user: req.user._id, // Will be mock string
    movieId,
    rating,
    comment,
    sentimentScore: 0,
    createdAt: new Date().toISOString()
  };
  
  global.mockDB.reviews.push(review);
  res.status(201).json(review);
};

export const getMovieReviews = async (req, res) => {
  const reviews = global.mockDB.reviews.filter(r => String(r.movieId) === String(req.params.movieId));
  res.json(reviews);
};

export const deleteReview = async (req, res) => {
  global.mockDB.reviews = global.mockDB.reviews.filter(r => r._id !== req.params.id);
  res.json({ message: 'Review removed' });
};
