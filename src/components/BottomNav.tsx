
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, Info, MessageCircle } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="container mx-auto">
        <div className="flex justify-around py-3">
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-carol-pink">
            <Home size={20} />
            <span className="text-xs mt-1">Início</span>
          </Link>
          
          <a href="#produtos" className="flex flex-col items-center text-gray-600 hover:text-carol-pink">
            <Package size={20} />
            <span className="text-xs mt-1">Produtos</span>
          </a>
          
          <a href="#sobre" className="flex flex-col items-center text-gray-600 hover:text-carol-pink">
            <Info size={20} />
            <span className="text-xs mt-1">Sobre</span>
          </a>
          
          <a href="#contato" className="flex flex-col items-center text-gray-600 hover:text-carol-pink">
            <MessageCircle size={20} />
            <span className="text-xs mt-1">Contato</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
