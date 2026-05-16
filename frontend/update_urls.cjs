const fs = require('fs');
const files = [
  'src/store/useMovieStore.js',
  'src/store/useAuthStore.js',
  'src/pages/MovieDetails.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/CategoryPage.jsx',
  'src/components/Navbar.jsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // First, replace any literal string like 'http://localhost:5000/api...' with a backtick template literal
  content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, '`http://localhost:5000$1`');
  
  // Now replace http://localhost:5000 with ${import.meta.env.VITE_API_URL || 'http://localhost:5000'}
  content = content.replace(/http:\/\/localhost:5000/g, "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});
