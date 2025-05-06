
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/Product';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
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
    getFeaturedProducts
  };
};
