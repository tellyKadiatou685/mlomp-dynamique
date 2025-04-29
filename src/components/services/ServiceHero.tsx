import React from "react";
import { motion } from "framer-motion";

const ServiceHero = () => {
  return (
    <section className="relative bg-gradient-to-r from-mlomp-green to-mlomp-green-light pt-32 pb-20 md:pt-36 md:pb-28">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/lovable-uploads/7da0caaf-815f-40f0-a79f-8ae98789853a.png')] bg-cover bg-center opacity-10"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      
      <div className="container-custom relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow">Nos Services Municipaux</h1>
          
          {/* Ligne décorative */}
          <div className="w-24 h-1 bg-white/50 mx-auto mb-6"></div>
          
          <motion.p
            className="text-lg md:text-xl mb-10 text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Découvrez les services et infrastructures que nous mettons à la disposition
            des citoyens pour améliorer leur qualité de vie et faciliter
            leur quotidien dans la commune de Mlomp.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a href="#services" className="btn-secondary">
              Explorer nos services
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;