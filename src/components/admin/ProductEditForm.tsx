
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../../types/Product';
import { useToast } from '@/hooks/use-toast';

interface ProductEditFormProps {
  selectedProduct: Product;
  onUpdateProduct: (updatedFields: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ 
  selectedProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) => {
  const { toast } = useToast();

  return (
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
                onChange={(e) => onUpdateProduct({ name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Preço (R$)</Label>
              <Input 
                id="edit-price"
                type="number"
                step="0.01"
                value={selectedProduct.price}
                onChange={(e) => onUpdateProduct({ price: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-image">URL da Imagem</Label>
            <Input 
              id="edit-image"
              value={selectedProduct.imagePath}
              onChange={(e) => onUpdateProduct({ imagePath: e.target.value })}
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
              onChange={(e) => onUpdateProduct({ pixCode: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-pdf">Link do PDF</Label>
              <Input 
                id="edit-pdf"
                value={selectedProduct.pdfLink}
                onChange={(e) => onUpdateProduct({ pdfLink: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-canva">Link do Canva</Label>
              <Input 
                id="edit-canva"
                value={selectedProduct.canvaLink}
                onChange={(e) => onUpdateProduct({ canvaLink: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Input 
                id="edit-category"
                value={selectedProduct.category}
                onChange={(e) => onUpdateProduct({ category: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 flex items-center mt-8">
              <input
                type="checkbox"
                id="edit-featured"
                checked={selectedProduct.featured || false}
                onChange={(e) => onUpdateProduct({ featured: e.target.checked })}
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
              onChange={(e) => onUpdateProduct({ description: e.target.value })}
              rows={4}
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button
              variant="destructive"
              onClick={() => onDeleteProduct(selectedProduct.id)}
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
  );
};

export default ProductEditForm;
