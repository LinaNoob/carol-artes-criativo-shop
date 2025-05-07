
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteConfig } from '@/types/Product';
import { useStorage } from '@/hooks/useStorage';
import { Skeleton } from '@/components/ui/skeleton';

interface SiteConfigFormProps {
  config: SiteConfig | null;
  loading: boolean;
  onUpdateConfig: (updates: Partial<SiteConfig>) => Promise<{ success?: boolean; error?: string }>;
}

const SiteConfigForm: React.FC<SiteConfigFormProps> = ({ config, loading, onUpdateConfig }) => {
  const { uploadImage, isUploading } = useStorage();
  const [localConfig, setLocalConfig] = useState<Partial<SiteConfig>>({
    banner_image: '',
    banner_title: '',
    banner_subtitle: '',
    banner_button_text: '',
    about_title: '',
    about_content: '',
    about_image: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setLocalConfig(config);
    }
  }, [config]);

  const handleChange = (field: keyof SiteConfig, value: string) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadImage(file, 'banners');
      if (!error && publicUrl) {
        handleChange('banner_image', publicUrl);
      }
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadImage(file, 'banners');
      if (!error && publicUrl) {
        handleChange('about_image', publicUrl);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateConfig(localConfig);
    setIsSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-6">Configurações do Site</h2>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Configurações do Site</h2>
        
        <Tabs defaultValue="banner">
          <TabsList className="mb-6">
            <TabsTrigger value="banner">Banner Principal</TabsTrigger>
            <TabsTrigger value="about">Seção Sobre</TabsTrigger>
          </TabsList>
          
          <TabsContent value="banner" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="banner-image">Imagem do Banner</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="banner-image"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
              </div>
              
              {localConfig.banner_image && (
                <div className="h-40 w-full mt-2 border rounded overflow-hidden bg-gray-100">
                  <img 
                    src={localConfig.banner_image} 
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <Input 
                value={localConfig.banner_image || ''}
                onChange={(e) => handleChange('banner_image', e.target.value)}
                placeholder="Ou cole a URL da imagem"
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner-title">Título do Banner</Label>
              <Input 
                id="banner-title"
                value={localConfig.banner_title || ''}
                onChange={(e) => handleChange('banner_title', e.target.value)}
                placeholder="Título principal do banner"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner-subtitle">Subtítulo do Banner</Label>
              <Textarea 
                id="banner-subtitle"
                value={localConfig.banner_subtitle || ''}
                onChange={(e) => handleChange('banner_subtitle', e.target.value)}
                placeholder="Subtítulo ou descrição do banner"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banner-button">Texto do Botão</Label>
              <Input 
                id="banner-button"
                value={localConfig.banner_button_text || ''}
                onChange={(e) => handleChange('banner_button_text', e.target.value)}
                placeholder="Ex: Ver Produtos"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-title">Título da Seção Sobre</Label>
              <Input 
                id="about-title"
                value={localConfig.about_title || ''}
                onChange={(e) => handleChange('about_title', e.target.value)}
                placeholder="Ex: Sobre a Carol Artes"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about-content">Conteúdo da Seção Sobre</Label>
              <Textarea 
                id="about-content"
                value={localConfig.about_content || ''}
                onChange={(e) => handleChange('about_content', e.target.value)}
                placeholder="Descrição sobre seu negócio..."
                rows={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about-image">Imagem da Seção Sobre</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="about-image"
                  type="file"
                  accept="image/*"
                  onChange={handleAboutImageUpload}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
              </div>
              
              {localConfig.about_image && (
                <div className="h-40 w-full mt-2 border rounded overflow-hidden bg-gray-100">
                  <img 
                    src={localConfig.about_image} 
                    alt="About Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <Input 
                value={localConfig.about_image || ''}
                onChange={(e) => handleChange('about_image', e.target.value)}
                placeholder="Ou cole a URL da imagem"
                className="mt-2"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-carol-pink hover:bg-opacity-90"
            disabled={isSaving || isUploading}
          >
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteConfigForm;
