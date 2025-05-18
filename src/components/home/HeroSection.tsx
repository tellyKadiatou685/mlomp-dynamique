import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background avec dégradé et motif subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200 z-0">
        <div 
          className="absolute inset-0 opacity-10 bg-repeat"
          style={{ 
            backgroundImage: `url('/lovable-uploads/pattern.svg')`,
            backgroundSize: '100px' 
          }}
        />
      </div>

      {/* Cercles décoratifs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-mlomp-green/10 rounded-full filter blur-3xl opacity-70 z-0"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-mlomp-yellow/10 rounded-full filter blur-3xl opacity-70 z-0"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Texte principal animé - occupe 7 colonnes sur grand écran */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-gray-800 font-bold leading-tight mb-6 text-4xl md:text-6xl">
              <span className="text-mlomp-green">Commune</span> de Mlomp
            </h1>
            
            <div className="h-1 w-28 bg-mlomp-yellow mb-6 rounded-full"></div>
            
            <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-xl leading-relaxed">
              "Mlomp, une économie exemplaire, un niveau social élevé et une gestion transparente"
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/presentation" 
                className="bg-mlomp-green hover:bg-mlomp-green-dark text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Découvrir Mlomp
              </Link>
              <Link 
                to="/espace-citoyen" 
                className="bg-white border-2 border-mlomp-yellow hover:bg-mlomp-yellow/10 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Espace Citoyen
              </Link>
            </div>
            
            {/* Stats indicateurs */}
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="text-center">
                <div className="text-mlomp-green text-2xl font-bold">18 500+</div>
                <div className="text-gray-600 text-sm">Habitants</div>
              </div>
              <div className="text-center">
                <div className="text-mlomp-green text-2xl font-bold">1965</div>
                <div className="text-gray-600 text-sm">Année de création</div>
              </div>
              <div className="text-center">
                <div className="text-mlomp-green text-2xl font-bold">25+</div>
                <div className="text-gray-600 text-sm">Projets en cours</div>
              </div>
            </div>
          </motion.div>
          
          {/* Carte du Maire animée - occupe 5 colonnes sur grand écran */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-2xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              {/* Élément décoratif */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-mlomp-yellow/20 rounded-full"></div>
              
              <div className="relative overflow-hidden rounded-xl">
                <div className="aspect-w-4 aspect-h-5">
                  <motion.img
                    src="/lovable-uploads/mm.jpeg"
                    alt="Ansoumana Papiss Dieme - Maire de Mlomp"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <h3 className="text-xl font-bold">Ansoumana Papiss Dieme</h3>
                  <p className="text-white/80 text-sm">Maire de la Commune de Mlomp</p>
                </div>
              </div>
              
              <div className="mt-6 relative">
                <svg className="absolute top-0 left-0 w-10 h-10 text-mlomp-green/10 transform -translate-x-4 -translate-y-6" 
                     fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-4.058 2.958-4.058 5.22v10.929h-5.92zm-11.003 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-4.059 2.958-4.059 5.22v10.629h-5.937z"></path>
                </svg>
                
                <p className="text-gray-600 italic mb-4 pl-6">
                  "Ensemble, construisons un avenir prospère pour notre commune et offrons à chaque citoyen les moyens de s'épanouir."
                </p>
                
                <Link to="/presentation" className="flex items-center justify-end mt-3 text-mlomp-green font-medium hover:text-mlomp-green-dark transition-colors group">
                  <span>Message du maire</span>
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Badge décoratif */}
            <div className="absolute -bottom-5 -left-5 bg-mlomp-yellow/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform rotate-3">
              Élu en 2023
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;