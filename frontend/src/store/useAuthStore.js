import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  register: async (name, email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  }
}));

export default useAuthStore;
