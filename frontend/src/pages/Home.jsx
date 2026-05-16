import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Play } from 'lucide-react';
import useMovieStore from '../store/useMovieStore';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const Home = () => {
  const { trendingMovies, topRatedMovies, tollywoodMovies, fetchTrending, fetchTopRated, fetchTollywood } = useMovieStore();
  const [trendingPage, setTrendingPage] = useState(1);
  const [tollywoodPage, setTollywoodPage] = useState(1);

  useEffect(() => {
    fetchTrending(1);
    fetchTopRated(1);
    fetchTollywood(1);
  }, [fetchTrending, fetchTopRated, fetchTollywood]);

  const loadMoreTrending = () => {
    const nextPage = trendingPage + 1;
    setTrendingPage(nextPage);
    fetchTrending(nextPage);
  };

  const loadMoreTollywood = () => {
    const nextPage = tollywoodPage + 1;
    setTollywoodPage(nextPage);
    fetchTollywood(nextPage);
  };

  const heroMovie = trendingMovies[0];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      {heroMovie && (
        <div className="relative h-[80vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`} 
              alt={heroMovie.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
          
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">{heroMovie.title}</h1>
              <div className="flex items-center gap-4 mb-6 text-sm md:text-base text-gray-300">
                <span className="text-accent font-semibold text-lg flex items-center gap-1">
                  ⭐ {heroMovie.vote_average?.toFixed(1)}
                </span>
                <span>{heroMovie.release_date}</span>
              </div>
              <p className="text-lg text-gray-300 mb-8 line-clamp-3">{heroMovie.overview}</p>
              
              <div className="flex gap-4">
                <Link to={`/movie/${heroMovie.id}`} className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-transform hover:scale-105">
                  <Play className="w-5 h-5 fill-current" />
                  Play Trailer
                </Link>
                <Link to={`/movie/${heroMovie.id}`} className="bg-surface hover:bg-slate-700 text-white px-8 py-3 rounded-full font-semibold transition-transform hover:scale-105 border border-slate-600">
                  More Info
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Trending Section (Hollywood & Global) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          Trending Worldwide <span className="text-accent text-2xl">🌍</span>
        </h2>
        
        <InfiniteScroll
          dataLength={trendingMovies.length}
          next={loadMoreTrending}
          hasMore={true}
          loader={<div className="text-center py-4">Loading more...</div>}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-hidden"
        >
          {trendingMovies.map((movie, index) => (
            <MovieCard key={`trending-${movie.id}-${index}`} movie={movie} />
          ))}
        </InfiniteScroll>
      </div>

      {/* Tollywood Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-surface/20">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          Tollywood Blockbusters <span className="text-accent text-2xl">🪷</span>
        </h2>
        
        <InfiniteScroll
          dataLength={tollywoodMovies.length}
          next={loadMoreTollywood}
          hasMore={true}
          loader={<div className="text-center py-4">Loading more...</div>}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-hidden"
        >
          {tollywoodMovies.map((movie, index) => (
            <MovieCard key={`tollywood-${movie.id}-${index}`} movie={movie} />
          ))}
        </InfiniteScroll>
      </div>

      {/* Top Rated Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-surface/40">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          All-Time IMDb Masterpieces <span className="text-accent text-2xl">⭐</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topRatedMovies.slice(0, 10).map((movie, index) => (
            <MovieCard key={`top-${movie.id}-${index}`} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
