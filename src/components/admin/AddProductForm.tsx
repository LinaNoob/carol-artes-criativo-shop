
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../../types/Product';
import { useStorage } from '@/hooks/useStorage';

interface AddProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<{ success?: boolean; error?: string }>;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onAddProduct }) => {
  const { uploadImage, uploadPDF, isUploading } = useStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    nome: '',
    preco: 0,
    imagem_url: '',
    pix_codigo: '',
    link_pdf: '',
    link_canva: '',
    descricao: '',
    categoria: '',
    destaque: false
  });

  const handleInputChange = (field: keyof Product, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadImage(file);
      if (!error && publicUrl) {
        handleInputChange('imagem_url', publicUrl);
      }
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadPDF(file);
      if (!error && publicUrl) {
        handleInputChange('link_pdf', publicUrl);
      }
    }
  };

  const handleSubmit = async () => {
    if (!newProduct.nome || !newProduct.preco || !newProduct.pix_codigo) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Garante que os campos estão com o tipo correto
    const productToAdd = {
      ...newProduct,
      preco: Number(newProduct.preco),
      nome: String(newProduct.nome),
      pix_codigo: String(newProduct.pix_codigo),
      descricao: String(newProduct.descricao || ''),
      categoria: String(newProduct.categoria || ''),
      destaque: Boolean(newProduct.destaque || false),
      imagem_url: String(newProduct.imagem_url || ''),
      link_pdf: String(newProduct.link_pdf || ''),
      link_canva: String(newProduct.link_canva || '')
    } as Omit<Product, 'id' | 'created_at'>;
    
    await onAddProduct(productToAdd);
    
    // Reset do formulário
    setNewProduct({
      nome: '',
      preco: 0,
      imagem_url: '',
      pix_codigo: '',
      link_pdf: '',
      link_canva: '',
      descricao: '',
      categoria: '',
      destaque: false
    });
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-6">Adicionar Novo Produto</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Nome do Produto *</Label>
              <Input 
                id="new-name"
                value={newProduct.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-price">Preço (R$) *</Label>
              <Input 
                id="new-price"
                type="number"
                step="0.01"
                value={newProduct.preco || ''}
                onChange={(e) => handleInputChange('preco', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-image">Imagem do Produto</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="new-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
            </div>
            
            {newProduct.imagem_url && (
              <div className="h-40 w-40 mx-auto mt-2 border rounded overflow-hidden">
                <img 
                  src={newProduct.imagem_url} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Input 
              value={newProduct.imagem_url || ''}
              onChange={(e) => handleInputChange('imagem_url', e.target.value)}
              placeholder="Ou cole a URL da imagem"
              className="mt-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-pix">Código PIX Copia e Cola *</Label>
            <Input 
              id="new-pix"
              value={newProduct.pix_codigo || ''}
              onChange={(e) => handleInputChange('pix_codigo', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-pdf">PDF do Produto</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="new-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
              </div>
              
              <Input 
                value={newProduct.link_pdf || ''}
                onChange={(e) => handleInputChange('link_pdf', e.target.value)}
                placeholder="Ou cole a URL do PDF"
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-canva">Link do Canva</Label>
              <Input 
                id="new-canva"
                value={newProduct.link_canva || ''}
                onChange={(e) => handleInputChange('link_canva', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-category">Categoria</Label>
              <Input 
                id="new-category"
                value={newProduct.categoria || ''}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 flex items-center mt-8">
              <input
                type="checkbox"
                id="new-featured"
                checked={newProduct.destaque || false}
                onChange={(e) => handleInputChange('destaque', e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="new-featured">Produto em Destaque</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-description">Descrição</Label>
            <Textarea 
              id="new-description"
              value={newProduct.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              className="bg-carol-pink hover:bg-opacity-90"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading || !newProduct.nome || !newProduct.preco || !newProduct.pix_codigo}
            >
              {isSubmitting ? "Adicionando..." : "Adicionar Produto"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
