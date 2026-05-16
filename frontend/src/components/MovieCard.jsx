import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path || movie.posterPath 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path || movie.posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
    >
      <Link to={`/movie/${movie.id || movie.tmdbId}`}>
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <span>{movie.release_date?.substring(0, 4)}</span>
            <span className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-current" />
              {(movie.vote_average || movie.voteAverage)?.toFixed(1)}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{movie.overview}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
