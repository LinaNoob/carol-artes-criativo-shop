
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  getStoredProducts, 
  saveProducts, 
  setAdminPassword, 
  getSocialLinks, 
  setSocialLinks,
  SocialLinks
} from '../utils/localStorage';
import { Product } from '../types/Product';

// Import the new component files
import ProductsList from './admin/ProductsList';
import ProductEditForm from './admin/ProductEditForm';
import AddProductForm from './admin/AddProductForm';
import SettingsForm from './admin/SettingsForm';
import SocialLinksForm from './admin/SocialLinksForm';

interface AdminPanelProps {
  initialProducts: Product[];
  onClose: () => void;
  onProductsUpdated: (products: Product[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ initialProducts, onClose, onProductsUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    imagePath: '/public/placeholder.svg',
    pixCode: '',
    pdfLink: '',
    canvaLink: '',
    description: '',
    category: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [socialLinks, setSocialLinksState] = useState<SocialLinks>({
    instagram: '',
    tiktok: '',
    shopee: '',
    whatsapp: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Combine local storage products with initial products
    const storedProducts = getStoredProducts();
    const combinedProducts = [...initialProducts];
    
    // Add any stored products that aren't in the initial list
    storedProducts.forEach(storedProduct => {
      if (!combinedProducts.find(p => p.id === storedProduct.id)) {
        combinedProducts.push(storedProduct);
      }
    });
    
    setProducts(combinedProducts);
    
    // Load social links
    const links = getSocialLinks();
    if (links) {
      setSocialLinksState({
        instagram: links.instagram || '',
        tiktok: links.tiktok || '',
        shopee: links.shopee || '',
        whatsapp: links.whatsapp || ''
      });
    }
  }, [initialProducts]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleUpdateProduct = (updatedFields: Partial<Product>) => {
    if (!selectedProduct) return;
    
    const updatedProduct = { ...selectedProduct, ...updatedFields };
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? updatedProduct : p
    );
    
    setProducts(updatedProducts);
    setSelectedProduct(updatedProduct as Product);
    saveProducts(updatedProducts);
    onProductsUpdated(updatedProducts);
    
    toast({
      title: "Produto atualizado",
      description: `${updatedProduct.name} foi atualizado com sucesso.`
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
      onProductsUpdated(updatedProducts);
      setSelectedProduct(null);
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso."
      });
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.pixCode) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    const productId = `produto${Date.now()}`;
    const newProductComplete = {
      ...newProduct,
      id: productId,
      price: Number(newProduct.price)
    } as Product;
    
    const updatedProducts = [...products, newProductComplete];
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    onProductsUpdated(updatedProducts);
    
    // Reset the form
    setNewProduct({
      name: '',
      price: 0,
      imagePath: '/public/placeholder.svg',
      pixCode: '',
      pdfLink: '',
      canvaLink: '',
      description: '',
      category: '',
    });
    
    toast({
      title: "Produto adicionado",
      description: `${newProductComplete.name} foi adicionado com sucesso.`
    });
  };

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    setAdminPassword(newPassword);
    setNewPassword('');
    
    toast({
      title: "Senha alterada",
      description: "A senha de administrador foi alterada com sucesso."
    });
  };
  
  const handleSaveSocialLinks = () => {
    setSocialLinks(socialLinks);
    
    toast({
      title: "Links sociais atualizados",
      description: "As redes sociais foram atualizadas com sucesso."
    });
  };

  return (
    <div className="bg-white min-h-screen p-4 pt-20 pb-20">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
          <Button variant="outline" onClick={onClose}>
            Sair do Modo Admin
          </Button>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="add-product">Adicionar Produto</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ProductsList 
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
              />
              
              <div className="md:col-span-2">
                {selectedProduct ? (
                  <ProductEditForm
                    selectedProduct={selectedProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-10">
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">Selecione um produto para editar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="add-product">
            <AddProductForm
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              onAddProduct={handleAddProduct}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsForm
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              onChangePassword={handleChangePassword}
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
    </div>
  );
};

export default AdminPanel;
