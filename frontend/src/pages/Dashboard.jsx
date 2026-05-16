import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Heart, Clock, Trash2, Film, Activity, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/watchlist', config);
        setWatchlist(data.movies || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchWatchlist();
  }, [user]);

  const removeFromWatchlist = async (movieId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/users/watchlist/${movieId}`, config);
      setWatchlist(watchlist.filter(m => m.movieId !== movieId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 relative z-0 overflow-hidden">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 blur-[120px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 blur-[150px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 mb-12 overflow-hidden"
        >
          {/* Subtle inner glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-white/80" />
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1 z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              {user?.name}
            </h1>
            <p className="text-primary/80 font-medium mb-6">{user?.email}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <Heart className="w-5 h-5 text-red-400 fill-current" />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">{watchlist.length}</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Watchlist</div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Film className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">Novice</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cinephile Rank</div>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors">
                <div className="bg-yellow-500/20 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <div>
                  <div className="text-2xl font-bold leading-none">0</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Reviews</div>
                </div>
              </div>
            </div>
          </div>

          <button className="z-10 bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg px-6 py-3 rounded-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 font-semibold text-white/90">
            <Settings className="w-5 h-5" /> Account Settings
          </button>
        </motion.div>

        {/* Watchlist Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              My Watchlist <span className="text-red-500">❤️</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Activity className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : watchlist.length === 0 ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-24 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
              <Film className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-3 text-white">Your canvas is empty</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">Every great journey starts with a single movie. Find your next obsession now.</p>
              <Link to="/" className="inline-block bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-primary text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 hover:shadow-blue-500/50">
                Discover Masterpieces
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {watchlist.map((movie, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={movie.movieId} 
                  className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-white/5 hover:border-primary/50"
                >
                  <Link to={`/movie/${movie.movieId}`}>
                    <div className="aspect-[2/3] w-full bg-slate-800">
                      <img 
                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-5">
                      <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">{movie.title}</h3>
                    </div>
                  </Link>
                  <button 
                    onClick={(e) => { e.preventDefault(); removeFromWatchlist(movie.movieId); }}
                    className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 z-10 shadow-lg shadow-red-500/30"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
