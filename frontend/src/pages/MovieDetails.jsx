import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Plus, Heart, Share2, Star } from 'lucide-react';
import useMovieStore from '../store/useMovieStore';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

const socket = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);

const MovieDetails = () => {
  const { id } = useParams();
  const { movieDetails, fetchMovieDetails, loading } = useMovieStore();
  const { user } = useAuthStore();
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetchMovieDetails(id);
    
    // Join socket room
    socket.emit('join_room', id);
    
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [id, fetchMovieDetails]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatMessage.trim() && user) {
      const msgData = {
        room: id,
        user: user.name,
        text: chatMessage,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', msgData);
      setMessages((prev) => [...prev, msgData]);
      setChatMessage('');
    }
  };

  const [showTrailer, setShowTrailer] = useState(false);
  const trailer = movieDetails?.videos?.results?.find(v => v.type === 'Trailer') || movieDetails?.videos?.results?.[0];

  const addToWatchlist = async () => {
    if (!user) return alert('Please login first');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/watchlist`, {
        movieId: movieDetails.id,
        title: movieDetails.title,
        posterPath: movieDetails.poster_path
      }, config);
      setIsAdded(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading || !movieDetails) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const backdropUrl = `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setShowTrailer(false)} 
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center z-10 transition-colors"
            >
              ✕
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero Backdrop */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-64 md:w-80 flex-shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img src={posterUrl} alt={movieDetails.title} className="w-full h-auto" />
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 pt-4 md:pt-64"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movieDetails.title}</h1>
            <p className="text-xl text-gray-400 mb-6 italic">{movieDetails.tagline}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-1 text-accent font-bold text-lg">
                <Star className="w-5 h-5 fill-current" />
                {movieDetails.vote_average?.toFixed(1)}
              </div>
              <div className="text-gray-300">{movieDetails.release_date}</div>
              <div className="text-gray-300">{movieDetails.runtime} min</div>
              <div className="flex gap-2">
                {movieDetails.genres?.map(g => (
                  <span key={g.id} className="px-3 py-1 bg-surface rounded-full border border-slate-700">{g.name}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => {
                  if (trailer) setShowTrailer(true);
                  else alert('Trailer not available for this movie.');
                }}
                className="bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all"
              >
                <Play className="w-5 h-5 fill-current" /> Trailer
              </button>
              <button onClick={addToWatchlist} className="bg-surface hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all border border-slate-600">
                <Plus className="w-5 h-5" /> {isAdded ? 'Added' : 'Watchlist'}
              </button>
              <button className="bg-surface hover:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-xl transition-all border border-slate-600">
                <Heart className="w-5 h-5" />
              </button>
              <button className="bg-surface hover:bg-slate-700 w-12 h-12 flex items-center justify-center rounded-xl transition-all border border-slate-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-2xl font-semibold mb-3">Overview</h3>
            <p className="text-gray-300 leading-relaxed mb-8">{movieDetails.overview}</p>

            {/* OTT Providers Section */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-white">Where to Watch</h3>
              <div className="bg-surface/50 border border-slate-700 rounded-2xl p-5">
                {(() => {
                  const providersData = movieDetails?.['watch/providers']?.results;
                  const regionData = providersData?.IN || providersData?.US || (providersData ? Object.values(providersData)[0] : null);
                  const watchProviders = regionData?.flatrate || regionData?.rent || regionData?.buy || null;

                  if (watchProviders && watchProviders.length > 0) {
                    return (
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-gray-300 font-medium">Streaming now on:</span>
                        {watchProviders.map(provider => (
                          <div key={provider.provider_id} className="flex items-center gap-2 bg-slate-800 rounded-full pr-4 pl-1 py-1 border border-slate-700 shadow-md">
                            <img 
                              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                              alt={provider.provider_name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-semibold">{provider.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <div className="text-gray-400">
                      <p className="flex items-center gap-2 text-white font-medium">
                        <span className="text-yellow-500 text-xl">⏳</span> Currently unavailable on streaming platforms.
                      </p>
                      <p className="text-sm mt-2 text-gray-500 italic">Usually, movies arrive on digital platforms like Netflix or Prime Video 4 to 8 weeks after their theatrical release. Check back soon!</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-time Discussion Room */}
        <div className="mt-16 bg-surface/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Live Discussion Room</h2>
          <div className="h-64 overflow-y-auto mb-4 p-4 bg-background/50 rounded-xl space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">Be the first to say something!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-primary">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-200">{msg.text}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={user ? "Share your thoughts..." : "Login to chat"}
              disabled={!user}
              className="flex-1 bg-background border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:border-primary disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!user}
              className="bg-primary hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
