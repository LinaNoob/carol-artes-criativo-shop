
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import PurchaseModal from './PurchaseModal';
import { Product } from '../types/Product';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title = "Nossos Produtos", subtitle, loading = false }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section id="produtos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
          <div className="h-1 w-20 bg-carol-pink mx-auto mt-4"></div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-64" />
                <div className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onBuyClick={handleBuyClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-500">
                <p className="text-xl">Nenhum produto disponível no momento.</p>
                <p className="mt-2">Volte em breve para novidades!</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default ProductGrid;
