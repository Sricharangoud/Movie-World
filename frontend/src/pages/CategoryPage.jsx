import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import MovieCard from '../components/MovieCard';

const CategoryPage = () => {
  const { lang } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNumber) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/language/${lang}?page=${pageNumber}`);
      if (pageNumber === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }
      if (data.results.length === 0 || data.page >= data.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    // Reset state when language changes
    setMovies([]);
    setPage(1);
    setHasMore(true);
    fetchMovies(1);
  }, [lang]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  return (
    <div className="bg-background min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize flex items-center gap-3 text-white">
          {lang} Movies <span className="text-primary text-2xl">🍿</span>
        </h1>
        
        {movies.length > 0 ? (
          <InfiniteScroll
            dataLength={movies.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<div className="text-center py-8 text-gray-400">Loading more amazing movies...</div>}
            endMessage={<div className="text-center py-8 text-gray-500">You have seen it all!</div>}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 overflow-hidden"
          >
            {movies.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="text-center py-20 text-gray-400">
            No movies found for {lang}.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
