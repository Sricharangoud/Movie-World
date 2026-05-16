import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Clapperboard, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/search?query=${searchTerm}`);
          setSearchResults(data.results.slice(0, 5));
        } catch (error) {
          console.error(error);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter">
              <Clapperboard className="w-8 h-8" />
              Movie World
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium h-16 items-center">
              {/* Pan India Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="flex items-center gap-1 hover:text-primary transition-colors text-gray-300 h-full">
                  Pan India <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-16 left-0 w-48 bg-surface border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 p-2">
                  {['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'].map(lang => (
                    <Link key={lang} to={`/movies/${lang.toLowerCase()}`} className="block px-4 py-2 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                      {lang}
                    </Link>
                  ))}
                </div>
              </div>

              {/* World Cinema Dropdown */}
              <div className="relative group h-full flex items-center">
                <button className="flex items-center gap-1 hover:text-primary transition-colors text-gray-300 h-full">
                  World <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-16 left-0 w-48 bg-surface border border-slate-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 p-2">
                  {['English', 'Korean', 'Japanese', 'Spanish', 'French'].map(lang => (
                    <Link key={lang} to={`/movies/${lang.toLowerCase()}`} className="block px-4 py-2 hover:bg-slate-700 rounded-lg text-gray-300 hover:text-white transition-colors">
                      {lang}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    const firstMovie = searchResults[0];
                    navigate(`/movie/${firstMovie.id || firstMovie.tmdbId}`);
                    setSearchTerm('');
                    setSearchResults([]);
                  }
                }}
                className="w-full bg-slate-800 text-gray-200 border border-slate-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            {searchResults.length > 0 && (
              <div className="absolute w-full mt-2 bg-surface border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                {searchResults.map((movie) => (
                  <Link
                    key={movie.id || movie.tmdbId}
                    to={`/movie/${movie.id || movie.tmdbId}`}
                    onClick={() => {
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-slate-700 transition-colors"
                  >
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path || movie.posterPath}`} 
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/92x138'}
                    />
                    <div>
                      <h4 className="text-sm font-semibold truncate">{movie.title}</h4>
                      <p className="text-xs text-gray-400">{movie.release_date?.substring(0, 4)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Log In</Link>
                <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
