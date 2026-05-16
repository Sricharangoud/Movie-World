import { create } from 'zustand';
import axios from 'axios';

const useMovieStore = create((set) => ({
  trendingMovies: [],
  topRatedMovies: [],
  tollywoodMovies: [],
  movieDetails: null,
  loading: false,
  error: null,

  fetchTrending: async (page = 1) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/trending?page=${page}`);
      set((state) => ({ 
        trendingMovies: page === 1 ? data.results : [...state.trendingMovies, ...data.results],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTollywood: async (page = 1) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/tollywood?page=${page}`);
      set((state) => ({ 
        tollywoodMovies: page === 1 ? data.results : [...state.tollywoodMovies, ...data.results],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTopRated: async (page = 1) => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/top-rated?page=${page}`);
      set((state) => ({ 
        topRatedMovies: page === 1 ? data.results : [...state.topRatedMovies, ...data.results],
        loading: false 
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMovieDetails: async (id) => {
    set({ loading: true, movieDetails: null });
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/movies/${id}`);
      set({ movieDetails: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useMovieStore;
