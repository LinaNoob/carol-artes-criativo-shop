
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

interface AppProps {
  basename?: string;
}

const App = ({ basename = '/' }: AppProps) => {
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Supabase is properly configured
    const checkSupabase = async () => {
      try {
        // Simple query to check connection - using a simpler approach to check connection only
        const { data, error } = await supabase.from('produtos').select('id').limit(1);
        
        if (error && error.code === '42P01') {
          // Tabela não existe, mas conexão funcionou
          console.log("Conexão com o Supabase funcionou, mas a tabela 'produtos' não existe");
          setIsSupabaseReady(true); // Ainda consideramos que está pronto para usar dados estáticos
        } else if (error) {
          throw error;
        } else {
          setIsSupabaseReady(true);
        }
      } catch (err: any) {
        console.error('Supabase connection error:', err);
        setError(err.message || 'Erro ao conectar com o Supabase');
      }
    };

    checkSupabase();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-pink-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erro de Conexão</h1>
          <p className="text-gray-700 mb-4">
            Não foi possível conectar ao Supabase. Verifique suas variáveis de ambiente:
          </p>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto mb-4">
            VITE_SUPABASE_URL<br/>
            VITE_SUPABASE_ANON_KEY
          </pre>
          <p className="text-gray-700 mb-4">
            Mensagem de erro: <span className="text-red-500">{error}</span>
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-2">Como resolver este problema:</h2>
            <ol className="list-decimal pl-5 text-blue-800 space-y-2">
              <li>Acesse o painel do Supabase em <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">https://supabase.com</a></li>
              <li>Vá até o seu projeto e abra o Editor SQL</li>
              <li>Execute o script SQL do README.md para criar as tabelas necessárias</li>
              <li>Retorne para este aplicativo e recarregue a página</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/produto/:productId" element={<ProductPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
