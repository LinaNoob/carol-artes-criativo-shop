
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/Product';
import { useToast } from '@/hooks/use-toast';
import { products as staticProducts } from '@/data/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingStaticData, setUsingStaticData] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          // Tabela não existe, usar dados estáticos
          console.log("Usando produtos estáticos por enquanto");
          setProducts(staticProducts);
          setUsingStaticData(true);
        } else {
          throw error;
        }
      } else {
        setProducts(data || []);
      }
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);
      setError(error.message);
      // Fallback para dados estáticos em caso de erro
      setProducts(staticProducts);
      setUsingStaticData(true);
      
      toast({
        title: "Usando dados locais",
        description: "As tabelas no Supabase ainda não foram criadas. Usando dados de exemplo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      if (usingStaticData) {
        toast({
          title: "Modo demonstração",
          description: "As tabelas do Supabase ainda não foram criadas. Execute o script SQL do README.",
          variant: "destructive"
        });
        return { error: "Tabelas não criadas no Supabase" };
      }
      
      const { data, error } = await supabase
        .from('produtos')
        .insert([product])
        .select();

      if (error) {
        throw error;
      }

      setProducts([...(data || []), ...products]);
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso"
      });
      
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar produto",
        description: error.message,
        variant: "destructive"
      });
      return { error: error.message };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      if (usingStaticData) {
        toast({
          title: "Modo demonstração",
          description: "As tabelas do Supabase ainda não foram criadas. Execute o script SQL do README.",
          variant: "destructive"
        });
        return { error: "Tabelas não criadas no Supabase" };
      }
      
      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso"
      });
      
      return { success: true, data };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar produto",
        description: error.message,
        variant: "destructive"
      });
      return { error: error.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      if (usingStaticData) {
        toast({
          title: "Modo demonstração",
          description: "As tabelas do Supabase ainda não foram criadas. Execute o script SQL do README.",
          variant: "destructive"
        });
        return { error: "Tabelas não criadas no Supabase" };
      }
      
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setProducts(products.filter(p => p.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso"
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive"
      });
      return { error: error.message };
    }
  };
  
  const getFeaturedProducts = () => {
    return products.filter(p => p.destaque);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    usingStaticData
  };
};
