
import React from 'react';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/helpers';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsListProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  isLoading: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  products, 
  selectedProduct, 
  onSelectProduct,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Lista de Produtos</h2>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="p-3 rounded-md bg-white">
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 mr-3 rounded" />
                <div className="w-full">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Lista de Produtos</h2>
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {products.length === 0 ? (
          <div className="p-3 rounded-md bg-white text-center text-gray-500">
            Nenhum produto encontrado
          </div>
        ) : (
          products.map(product => (
            <div 
              key={product.id}
              className={`p-3 rounded-md cursor-pointer transition-colors ${
                selectedProduct?.id === product.id 
                  ? 'bg-carol-pink text-white' 
                  : 'bg-white hover:bg-carol-light-pink'
              }`}
              onClick={() => onSelectProduct(product)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 mr-3 overflow-hidden rounded bg-gray-100">
                  {product.imagem_url ? (
                    <img 
                      src={product.imagem_url} 
                      alt={product.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">{product.nome}</h3>
                  <p className="text-xs opacity-80">{formatCurrency(product.preco)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsList;
