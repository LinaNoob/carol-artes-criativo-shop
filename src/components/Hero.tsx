
import React, { useRef, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackImagePath = "/lovable-uploads/f2e269b4-c9ec-4c2f-8372-842b14e79b73.png";

  useEffect(() => {
    const handleError = () => {
      if (videoRef.current) {
        videoRef.current.style.display = 'none';
        const container = videoRef.current.parentElement;
        if (container) {
          const img = document.createElement('img');
          img.src = fallbackImagePath;
          img.alt = "Carol Artes";
          img.className = "w-full h-full object-cover absolute inset-0 rounded-full";
          container.appendChild(img);
        }
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('error', handleError);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <div className="relative bg-white py-24 mt-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden border-4 border-carol-pink shadow-lg mb-8">
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover absolute inset-0"
            >
              <source src="/video/demo.mp4" type="video/mp4" />
              {/* Fallback handled by useEffect */}
            </video>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-carol-pink mb-4 font-playfair text-center">
            Papelaria Personalizada
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-xl text-center">
            Moldes em PDF e projetos do Canva para tornar seu dia mais organizado e bonito
          </p>
          
          <div className="animate-bounce mt-8">
            <a href="#produtos" className="flex flex-col items-center text-gray-500 hover:text-carol-pink transition-colors">
              <span className="text-sm mb-1">Ver Produtos</span>
              <ArrowDown size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
