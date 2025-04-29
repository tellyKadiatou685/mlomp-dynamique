import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gray-200">
      {/* Background Image with Light Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20" 
        style={{ backgroundImage: `url('/lovable-uploads/c7524787-0fd9-49e5-8823-b9b491849da7.png')` }}
      >
        <div className="absolute inset-0 bg-gray-200/80" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte principal animé */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-gray-800 font-extrabold leading-tight mb-6 text-4xl md:text-5xl">
              Commune de Mlomp
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-xl">
              "Mlomp, une économie exemplaire, un niveau social élevé et une gestion transparente"
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/presentation" className="btn-primary transition-transform hover:scale-105">
                Découvrir Mlomp
              </Link>
              <Link to="/espace-citoyen" className="btn-secondary transition-transform hover:scale-105">
                Espace Citoyen
              </Link>
            </div>
          </motion.div>

          {/* Carte du Maire animée */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="relative overflow-hidden rounded-xl">
                <motion.img 
                  src="/lovable-uploads/25fa12d1-5705-42a3-b9da-60f1485c9bef.png" 
                  alt="Ansoumana Papiss Dieme - Maire de Mlomp" 
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100/90 to-transparent p-4">
                  <h3 className="text-gray-800 text-xl font-bold">Ansoumana Papiss Dieme</h3>
                  <p className="text-gray-600 text-sm">Maire de la Commune de Mlomp</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 italic">
                  "Ensemble, construisons un avenir prospère pour notre commune et offrons à chaque citoyen les moyens de s'épanouir."
                </p>
                <Link to="/presentation" className="flex items-center mt-3 text-mlomp-yellow hover:text-gray-800 transition-colors group">
                  <span>Message du maire</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
