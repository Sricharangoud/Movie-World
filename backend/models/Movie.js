import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    trendingScore: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Index for better performance
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ trendingScore: -1 });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
