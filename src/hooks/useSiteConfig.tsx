
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SiteConfig } from '@/types/Product';
import { useToast } from '@/hooks/use-toast';

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setConfig(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    try {
      let result;
      
      if (config?.id) {
        // Atualiza configuração existente
        const { data, error } = await supabase
          .from('site_config')
          .update(updates)
          .eq('id', config.id)
          .select();

        if (error) throw error;
        result = data?.[0];
      } else {
        // Insere nova configuração
        const { data, error } = await supabase
          .from('site_config')
          .insert([updates])
          .select();

        if (error) throw error;
        result = data?.[0];
      }

      setConfig(prev => prev ? { ...prev, ...updates } : result);
      
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do site foram atualizadas com sucesso"
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar configurações",
        description: error.message,
        variant: "destructive"
      });
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    fetchConfig,
    updateConfig
  };
};
