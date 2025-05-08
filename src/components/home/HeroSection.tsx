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

      {/* Grande demi-cercle pour l'image */}
      <div className="absolute top-24 right-0 w-1/2 h-3/4 bg-mlomp-green/5 rounded-l-full z-0 overflow-hidden">
        <motion.img
          src="/lovable-uploads/mm.jpeg"
          alt="Ansoumana Papiss Dieme - Maire de Mlomp"
          className="h-full w-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Texte principal animé - occupe 7 colonnes sur grand écran */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h5 className="text-gray-600 font-medium mb-2 uppercase tracking-wider">Coach business & Mentor</h5>
            
            <h1 className="text-gray-800 font-bold leading-tight mb-6 text-4xl md:text-5xl">
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
            
            {/* 3 étapes - comme dans l'exemple */}
            <div className="mt-12">
              <h3 className="font-bold text-lg mb-2 text-center">3 ÉTAPES POUR</h3>
              <p className="font-bold text-xl text-center">Impacter son audience</p>
            </div>
          </motion.div>
          
          {/* Espace réservé pour l'image - celle-ci est déjà placée en absolu */}
          <div className="lg:col-span-5">
            {/* L'image est placée en position absolue dans le demi-cercle plus haut */}
          </div>
        </div>
      </div>

      {/* Ligne pointillée décorative (comme dans l'exemple) */}
      <div className="absolute bottom-32 right-1/3 z-10 hidden lg:block">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 20H120" stroke="#888" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="110" cy="20" r="5" fill="#FFD700" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;