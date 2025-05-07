
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '../../types/Product';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductEditFormProps {
  selectedProduct: Product;
  onUpdateProduct: (productId: string, updatedFields: Partial<Product>) => Promise<{ success?: boolean; error?: string }>;
  onDeleteProduct: (productId: string) => Promise<{ success?: boolean; error?: string }>;
}

const ProductEditForm: React.FC<ProductEditFormProps> = ({ 
  selectedProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) => {
  const { toast } = useToast();
  const { uploadImage, uploadPDF, isUploading } = useStorage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product>(selectedProduct);

  // Atualiza o estado local quando o produto selecionado muda
  React.useEffect(() => {
    setProduct(selectedProduct);
  }, [selectedProduct]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setProduct({ ...product, [field]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadImage(file);
      if (error) {
        toast({
          title: "Erro no upload",
          description: error,
          variant: "destructive"
        });
      } else if (publicUrl) {
        handleInputChange('imagem_url', publicUrl);
      }
    }
  };

  const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { publicUrl, error } = await uploadPDF(file);
      if (error) {
        toast({
          title: "Erro no upload",
          description: error,
          variant: "destructive"
        });
      } else if (publicUrl) {
        handleInputChange('link_pdf', publicUrl);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await onUpdateProduct(product.id, product);
    setIsSaving(false);
    
    if (result.error) {
      toast({
        title: "Erro ao salvar",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setIsDeleting(true);
      const result = await onDeleteProduct(product.id);
      setIsDeleting(false);
      
      if (result.error) {
        toast({
          title: "Erro ao excluir",
          description: result.error,
          variant: "destructive"
        });
      }
    }
  };

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
                value={product.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Preço (R$)</Label>
              <Input 
                id="edit-price"
                type="number"
                step="0.01"
                value={product.preco}
                onChange={(e) => handleInputChange('preco', parseFloat(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-image">Imagem do Produto</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
            </div>
            
            {product.imagem_url && (
              <div className="h-40 w-40 mx-auto mt-2 border rounded overflow-hidden bg-gray-100">
                <img 
                  src={product.imagem_url} 
                  alt={product.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Input 
              value={product.imagem_url || ''}
              onChange={(e) => handleInputChange('imagem_url', e.target.value)}
              placeholder="Ou cole a URL da imagem"
              className="mt-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-pix">Código PIX Copia e Cola</Label>
            <Input 
              id="edit-pix"
              value={product.pix_codigo}
              onChange={(e) => handleInputChange('pix_codigo', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-pdf">PDF do Produto</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="edit-pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handlePDFUpload}
                  disabled={isUploading}
                />
                {isUploading && <span className="text-sm text-gray-500">Enviando...</span>}
              </div>
              
              <Input 
                value={product.link_pdf || ''}
                onChange={(e) => handleInputChange('link_pdf', e.target.value)}
                placeholder="Ou cole a URL do PDF"
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-canva">Link do Canva</Label>
              <Input 
                id="edit-canva"
                value={product.link_canva || ''}
                onChange={(e) => handleInputChange('link_canva', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria</Label>
              <Input 
                id="edit-category"
                value={product.categoria || ''}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 flex items-center mt-8">
              <input
                type="checkbox"
                id="edit-featured"
                checked={product.destaque || false}
                onChange={(e) => handleInputChange('destaque', e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="edit-featured">Produto em Destaque</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Textarea 
              id="edit-description"
              value={product.descricao || ''}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? "Excluindo..." : "Excluir Produto"}
            </Button>
            
            <Button 
              className="bg-carol-pink hover:bg-opacity-90"
              onClick={handleSave}
              disabled={isDeleting || isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductEditForm;
