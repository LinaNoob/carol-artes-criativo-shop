
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../../types/Product';

interface AddProductFormProps {
  newProduct: Partial<Product>;
  setNewProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  onAddProduct: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ 
  newProduct, 
  setNewProduct, 
  onAddProduct 
}) => {
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
              onClick={onAddProduct}
            >
              Adicionar Produto
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
