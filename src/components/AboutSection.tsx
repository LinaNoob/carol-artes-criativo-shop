
import React from 'react';

interface AboutSectionProps {
  title?: string;
  content?: string;
  imageSrc?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ 
  title = "Sobre a Carol Artes",
  content = "Somos uma empresa especializada em criar moldes digitais para papelaria personalizada. Nosso objetivo é ajudar empreendedores e entusiastas a criar produtos únicos com ferramentas simples como o Canva.",
  imageSrc = "/public/placeholder.svg"
}) => {
  return (
    <section id="sobre" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
            
            <div className="prose text-gray-600 max-w-none">
              <p className="mb-4">
                {content}
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <img 
                src={imageSrc} 
                alt="Sobre Carol Artes" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
