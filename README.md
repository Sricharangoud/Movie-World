# MovieVerse - IMDb-inspired Movie Platform

MovieVerse is a production-ready, full-stack web application built using the MERN stack. It offers an immersive UI similar to popular streaming platforms with modern dark aesthetics, smooth animations, and real-time features.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Zustand, Socket.IO Client, Vite
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Socket.IO

## Features
### Frontend
- **Modern UI**: Dark-themed, responsive, glassmorphism design.
- **Home Page**: Hero section, infinite scrolling trending movies, top-rated movies.
- **Search**: Debounced real-time search in the navbar.
- **Movie Details**: Comprehensive details fetched from TMDB, live real-time discussion room using Socket.IO.
- **User Dashboard**: Manage your personal watchlist.
- **Auth**: Login & Registration with JWT.

### Backend
- **REST API**: Built with Express and MVC pattern.
- **Authentication**: JWT-based secure authentication and role-based access.
- **Database**: MongoDB with optimal indexing.
- **Security**: Rate limiting, helmet for headers, CORS.

## Project Setup

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- TMDB API Key (Get it from [TMDB](https://www.themoviedb.org/))

### 1. Clone & Install
Install dependencies for both backend and frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory based on the `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movieverse
JWT_SECRET=your_super_secret_jwt_key
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

### 3. Running the App
Run both servers concurrently.

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application.

## Folder Structure
- `/backend`: Node/Express APIs, Mongoose models, Controllers, Middleware, Routes.
- `/frontend`: React/Vite application, Zustand stores, Tailwind CSS styling, Components, Pages.

## Security Practices
- Passwords hashed with bcrypt.
- JWT tokens for protected routes.
- Express rate limiting for DDoS protection.
- Helmet for secure HTTP headers.

## API Documentation
### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/profile` - Get user profile

### Movie Routes
- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/top-rated` - Get top-rated movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/:id` - Get movie details

### User Routes
- `GET /api/users/watchlist` - Get user watchlist
- `POST /api/users/watchlist` - Add to watchlist
- `DELETE /api/users/watchlist/:movieId` - Remove from watchlist

## Future Enhancements
- AI Recommendation Engine.
- Redis caching for TMDB API calls.
- Admin dashboard for content management.
