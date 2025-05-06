
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getStoredProducts, saveProducts, setAdminPassword } from '../utils/localStorage';
import { Product } from '../types/Product';
import { formatCurrency } from '../utils/helpers';

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

  return (
    <div className="bg-white min-h-screen p-4">
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
          </TabsList>
          
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Lista de Produtos</h2>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {products.map(product => (
                    <div 
                      key={product.id}
                      className={`p-3 rounded-md cursor-pointer ${
                        selectedProduct?.id === product.id 
                          ? 'bg-carol-pink text-white' 
                          : 'bg-white hover:bg-carol-light-pink'
                      }`}
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 overflow-hidden rounded">
                          <img 
                            src={product.imagePath} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                          <p className="text-xs opacity-80">{formatCurrency(product.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                {selectedProduct ? (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-6">Editar Produto</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nome do Produto</Label>
                            <Input 
                              id="edit-name"
                              value={selectedProduct.name}
                              onChange={(e) => handleUpdateProduct({ name: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-price">Preço (R$)</Label>
                            <Input 
                              id="edit-price"
                              type="number"
                              step="0.01"
                              value={selectedProduct.price}
                              onChange={(e) => handleUpdateProduct({ price: parseFloat(e.target.value) })}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-image">URL da Imagem</Label>
                          <Input 
                            id="edit-image"
                            value={selectedProduct.imagePath}
                            onChange={(e) => handleUpdateProduct({ imagePath: e.target.value })}
                          />
                          <div className="h-40 w-40 mx-auto mt-2 border rounded overflow-hidden">
                            <img 
                              src={selectedProduct.imagePath} 
                              alt={selectedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-pix">Código PIX Copia e Cola</Label>
                          <Input 
                            id="edit-pix"
                            value={selectedProduct.pixCode}
                            onChange={(e) => handleUpdateProduct({ pixCode: e.target.value })}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-pdf">Link do PDF</Label>
                            <Input 
                              id="edit-pdf"
                              value={selectedProduct.pdfLink}
                              onChange={(e) => handleUpdateProduct({ pdfLink: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="edit-canva">Link do Canva</Label>
                            <Input 
                              id="edit-canva"
                              value={selectedProduct.canvaLink}
                              onChange={(e) => handleUpdateProduct({ canvaLink: e.target.value })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Categoria</Label>
                            <Input 
                              id="edit-category"
                              value={selectedProduct.category}
                              onChange={(e) => handleUpdateProduct({ category: e.target.value })}
                            />
                          </div>
                          
                          <div className="space-y-2 flex items-center mt-8">
                            <input
                              type="checkbox"
                              id="edit-featured"
                              checked={selectedProduct.featured || false}
                              onChange={(e) => handleUpdateProduct({ featured: e.target.checked })}
                              className="mr-2 h-4 w-4"
                            />
                            <Label htmlFor="edit-featured">Produto em Destaque</Label>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Descrição</Label>
                          <Textarea 
                            id="edit-description"
                            value={selectedProduct.description}
                            onChange={(e) => handleUpdateProduct({ description: e.target.value })}
                            rows={4}
                          />
                        </div>
                        
                        <div className="pt-4 flex justify-between">
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteProduct(selectedProduct.id)}
                          >
                            Excluir Produto
                          </Button>
                          
                          <Button 
                            className="bg-carol-pink hover:bg-opacity-90"
                            onClick={() => {
                              toast({
                                title: "Alterações salvas",
                                description: "As alterações foram salvas automaticamente."
                              });
                            }}
                          >
                            Salvar Alterações
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Adicionar Novo Produto</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-name">Nome do Produto *</Label>
                      <Input 
                        id="new-name"
                        value={newProduct.name || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-price">Preço (R$) *</Label>
                      <Input 
                        id="new-price"
                        type="number"
                        step="0.01"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-image">URL da Imagem</Label>
                    <Input 
                      id="new-image"
                      value={newProduct.imagePath || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, imagePath: e.target.value })}
                      placeholder="/public/placeholder.svg"
                    />
                    {newProduct.imagePath && (
                      <div className="h-40 w-40 mx-auto mt-2 border rounded overflow-hidden">
                        <img 
                          src={newProduct.imagePath} 
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-pix">Código PIX Copia e Cola *</Label>
                    <Input 
                      id="new-pix"
                      value={newProduct.pixCode || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, pixCode: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-pdf">Link do PDF</Label>
                      <Input 
                        id="new-pdf"
                        value={newProduct.pdfLink || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, pdfLink: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-canva">Link do Canva</Label>
                      <Input 
                        id="new-canva"
                        value={newProduct.canvaLink || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, canvaLink: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-category">Categoria</Label>
                      <Input 
                        id="new-category"
                        value={newProduct.category || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2 flex items-center mt-8">
                      <input
                        type="checkbox"
                        id="new-featured"
                        checked={newProduct.featured || false}
                        onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                        className="mr-2 h-4 w-4"
                      />
                      <Label htmlFor="new-featured">Produto em Destaque</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-description">Descrição</Label>
                    <Textarea 
                      id="new-description"
                      value={newProduct.description || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      className="bg-carol-pink hover:bg-opacity-90"
                      onClick={handleAddProduct}
                    >
                      Adicionar Produto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Configurações</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-bold">Alterar Senha de Administrador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-admin-password">Nova Senha</Label>
                        <Input 
                          id="new-admin-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          onClick={handleChangePassword}
                          className="bg-carol-pink hover:bg-opacity-90"
                        >
                          Alterar Senha
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <h3 className="font-bold">Informações do Sistema</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Total de Produtos:</span> {products.length}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-semibold">Versão do Sistema:</span> 1.0.0
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Data de Atualização:</span> {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
