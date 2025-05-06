
import React from 'react';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/helpers';

interface ProductsListProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({ 
  products, 
  selectedProduct, 
  onSelectProduct 
}) => {
  return (
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
            onClick={() => onSelectProduct(product)}
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
  );
};

export default ProductsList;
