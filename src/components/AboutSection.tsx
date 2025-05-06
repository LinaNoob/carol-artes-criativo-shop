
import React from 'react';

const AboutSection: React.FC = () => {
  const logoPath = "/lovable-uploads/a8ac69c1-ef1e-45f2-9ac0-7271189195dd.png";

  return (
    <section id="sobre" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Sobre a Carol Artes</h2>
          <div className="h-1 w-20 bg-carol-pink mx-auto"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <img 
              src={logoPath}
              alt="Carol Artes Logo" 
              className="mx-auto max-w-xs"
            />
          </div>
          
          <div className="md:w-2/3 md:pl-12">
            <div className="bg-carol-light-pink bg-opacity-50 p-6 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Papelaria Criativa e Personalizada</h3>
              <p className="text-gray-700 mb-4">
                A Carol Artes nasceu da paixão por papelaria e organização. Nosso objetivo é criar moldes, 
                templates e projetos personalizados que ajudem as pessoas a organizarem suas vidas de forma 
                bonita e funcional.
              </p>
              <p className="text-gray-700 mb-4">
                Cada produto é cuidadosamente desenvolvido pensando na praticidade e na estética, 
                unindo o útil ao agradável. Oferecemos moldes em PDF e projetos do Canva prontos para 
                personalização e uso imediato.
              </p>
              <p className="text-gray-700">
                Se você ama papelaria, planejamento e organização com um toque especial, você está no lugar certo!
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="text-carol-pink text-3xl mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800">Moldes em PDF</h4>
                <p className="text-gray-600 text-sm">Prontos para impressão e uso imediato</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="text-carol-pink text-3xl mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800">Projetos Canva</h4>
                <p className="text-gray-600 text-sm">Personalizáveis conforme sua necessidade</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="text-carol-pink text-3xl mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800">Design Exclusivo</h4>
                <p className="text-gray-600 text-sm">Criações únicas e encantadoras</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
