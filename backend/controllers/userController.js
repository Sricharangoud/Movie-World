global.mockDB = global.mockDB || { users: [], watchlists: [] };

export const getWatchlist = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  let watchlist = global.mockDB.watchlists.find(w => w.user === String(req.user._id));
  if (!watchlist) {
    watchlist = { user: String(req.user._id), movies: [] };
    global.mockDB.watchlists.push(watchlist);
  }
  res.json(watchlist);
};

export const addToWatchlist = async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  
  let watchlist = global.mockDB.watchlists.find(w => w.user === String(req.user._id));
  
  if (!watchlist) {
    watchlist = { user: String(req.user._id), movies: [] };
    global.mockDB.watchlists.push(watchlist);
  }

  const movieExists = watchlist.movies.find(m => m.movieId === movieId);
  if (!movieExists) {
    watchlist.movies.push({ movieId, title, posterPath });
  }
  
  res.status(201).json(watchlist);
};

export const removeFromWatchlist = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'User not found' });
  const watchlist = global.mockDB.watchlists.find(w => w.user === String(req.user._id));
  if (watchlist) {
    watchlist.movies = watchlist.movies.filter(m => m.movieId !== Number(req.params.movieId));
    res.json(watchlist);
  } else {
    return res.status(404).json({ message: 'Watchlist not found' });
  }
};

export const getUsers = async (req, res) => {
  res.json(global.mockDB.users);
};
