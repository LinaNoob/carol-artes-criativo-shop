import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Certifique-se de que você está usando esse plugin corretamente
import path from "path";
import { componentTagger } from "lovable-tagger"; // Plugin adicional, verifica se está corretamente configurado

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // <-- Base path para GitHub Pages ou qualquer outro uso em produção
  server: {
    host: "::", // "host: ::" permite escutar todos os IPs locais
    port: 8080, // Define a porta de desenvolvimento
  },
  plugins: [
    react(), // Plugin para usar React com SWC (em vez de Babel)
    mode === 'development' &&
      componentTagger(), // Ativar componente Tagger somente em modo de desenvolvimento
  ].filter(Boolean), // Remove qualquer valor undefined
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias para facilitar a importação da pasta "src"
    },
  },
}));
