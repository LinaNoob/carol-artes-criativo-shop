
import React from 'react';
import { Product } from '../types/Product';
import { formatCurrency } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onBuyClick }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative pb-[100%]">
        <img 
          src={product.imagePath} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {product.featured && (
          <div className="absolute top-0 right-0 bg-carol-pink text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
            Destaque
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 h-14">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-16">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-carol-pink">
            {formatCurrency(product.price)}
          </span>
          
          <button 
            onClick={() => onBuyClick(product)}
            className="bg-carol-pink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
