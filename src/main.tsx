
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get any potential base path from the current URL (for GitHub Pages)
const getBasename = () => {
  // If running on GitHub Pages, the app might be in a subdirectory
  const path = window.location.pathname.split('/');
  let basePath = '';
  
  // If there's a GitHub Pages path structure, use it as basename
  if (path.length > 1 && path[1] !== '') {
    // For GitHub Pages, the repository name becomes the base path
    basePath = `/${path[1]}`;
  }
  
  return basePath;
};

createRoot(document.getElementById("root")!).render(<App basename={getBasename()} />);
