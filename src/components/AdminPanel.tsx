
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Product } from '../types/Product';

// Import hooks and components
import { useProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../hooks/useSiteConfig';
import AdminLayout from './admin/AdminLayout';
import ProductsList from './admin/ProductsList';
import ProductEditForm from './admin/ProductEditForm';
import AddProductForm from './admin/AddProductForm';
import SettingsForm from './admin/SettingsForm';
import SiteConfigForm from './admin/SiteConfigForm';
import SocialLinksForm from './admin/SocialLinksForm';
import { setSocialLinks } from '../utils/localStorage';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [socialLinks, setSocialLinksState] = useState({
    instagram: '',
    tiktok: '',
    shopee: '',
    whatsapp: '',
  });
  const { toast } = useToast();
  const { 
    products, 
    loading: productsLoading, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useProducts();
  
  const { 
    config, 
    loading: configLoading, 
    updateConfig 
  } = useSiteConfig();

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSaveSocialLinks = () => {
    setSocialLinks(socialLinks);
    
    toast({
      title: "Links sociais atualizados",
      description: "As redes sociais foram atualizadas com sucesso."
    });
  };

  return (
    <AdminLayout onClose={onClose}>
      <div className="my-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Painel de Administração</h1>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="add-product">Adicionar Produto</TabsTrigger>
            <TabsTrigger value="site-config">Configurações do Site</TabsTrigger>
            <TabsTrigger value="settings">Minha Conta</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductsList 
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
                isLoading={productsLoading}
              />
              
              <div className="md:col-span-2">
                {selectedProduct ? (
                  <ProductEditForm
                    selectedProduct={selectedProduct}
                    onUpdateProduct={updateProduct}
                    onDeleteProduct={deleteProduct}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-10 shadow-sm">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">Selecione um produto para editar</p>
                      {!productsLoading && products.length === 0 && (
                        <Button variant="outline" onClick={() => {
                          document.querySelector('[value="add-product"]')?.dispatchEvent(
                            new MouseEvent('click', { bubbles: true })
                          );
                        }}>
                          Adicionar Seu Primeiro Produto
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="add-product">
            <AddProductForm
              onAddProduct={addProduct}
            />
          </TabsContent>
          
          <TabsContent value="site-config">
            <SiteConfigForm
              config={config}
              loading={configLoading}
              onUpdateConfig={updateConfig}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsForm
              productsCount={products.length}
            />
          </TabsContent>

          <TabsContent value="social">
            <SocialLinksForm
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinksState}
              onSaveSocialLinks={handleSaveSocialLinks}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
