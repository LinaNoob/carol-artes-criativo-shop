
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get any potential base path from the current URL
const getBasename = () => {
  // Detect if running in production or dev environment
  const isProduction = import.meta.env.PROD;
  
  // If running on GitHub Pages, the app might be in a subdirectory
  if (!isProduction) {
    return '';
  }
  
  const path = window.location.pathname.split('/');
  let basePath = '';
  
  // If there's a GitHub Pages path structure, use it as basename
  if (path.length > 1 && path[1] !== '') {
    basePath = `/${path[1]}`;
  }
  
  return basePath;
};

// Find the root element and render the app
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App basename={getBasename()} />);
} else {
  console.error("Root element '#root' not found!");
}
