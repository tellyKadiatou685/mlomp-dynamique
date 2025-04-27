import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/common/SectionTitle";
import { Loader2 } from "lucide-react";
import serviceServices from "@/services/serviceServices";

// Interface pour une catégorie
interface ServiceCategory {
  title: string;
  description: string;
  color: string;
  category: string;
  image?: string;
}

const ServiceCategories = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cette fonction va récupérer tous les services et ensuite les regrouper par catégorie
  useEffect(() => {
    const fetchAndGroupServices = async () => {
      try {
        console.log("Récupération des services pour les catégories...");
        setLoading(true);
        
        const services = await serviceServices.getAllServices();
        console.log("Services récupérés pour les catégories:", services);
        
        if (services && Array.isArray(services) && services.length > 0) {
          // Extraire les catégories uniques des services
          const categoryMap = new Map();
          
          services.forEach(service => {
            if (!service.category) return;
            
            // Si cette catégorie n'existe pas encore dans notre Map, on l'ajoute
            if (!categoryMap.has(service.category)) {
              categoryMap.set(service.category, {
                title: formatCategoryName(service.category),
                description: "Services disponibles dans cette catégorie",
                color: getCategoryColor(service.category),
                category: service.category,
                image: service.image || undefined
              });
            } else if (!categoryMap.get(service.category).image && service.image) {
              // Si on a trouvé une image pour une catégorie qui n'en avait pas encore
              const existing = categoryMap.get(service.category);
              categoryMap.set(service.category, {
                ...existing,
                image: service.image
              });
            }
          });
          
          // Convertir la Map en tableau pour le state
          const uniqueCategories = Array.from(categoryMap.values());
          console.log("Catégories uniques:", uniqueCategories);
          
          setCategories(uniqueCategories);
        } else {
          setError("Aucun service trouvé");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories:", err);
        setError("Erreur lors du chargement des catégories");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndGroupServices();
  }, []);

  // Fonction pour formater le nom de la catégorie
  const formatCategoryName = (category: string): string => {
    switch (category) {
      case "EDUCATION":
        return "Éducation";
      case "SANTE":
        return "Santé";
      case "INFRASTRUCTURES":
        return "Infrastructures";
      default:
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }
  };

  // Fonction pour obtenir la couleur en fonction de la catégorie
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "EDUCATION":
        return "bg-blue-50 text-blue-600";
      case "SANTE":
        return "bg-red-50 text-red-600";
      case "INFRASTRUCTURES":
        return "bg-orange-50 text-orange-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <section id="services">
        <SectionTitle
          title="Catégories de Services"
          subtitle="Explorez nos différentes catégories de services disponibles pour les citoyens"
          centered
        />
        <div className="flex justify-center items-center h-40 mt-10">
          <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    return (
      <section id="services">
        <SectionTitle
          title="Catégories de Services"
          subtitle="Explorez nos différentes catégories de services disponibles pour les citoyens"
          centered
        />
        <div className="text-center py-10 mt-10">
          <p className="text-gray-500">{error || "Aucune catégorie disponible pour le moment"}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services">
      <SectionTitle
        title="Catégories de Services"
        subtitle="Explorez nos différentes catégories de services disponibles pour les citoyens"
        centered
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className={`rounded-xl p-6 ${category.color} transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col`}
            variants={itemVariants}
          >
            <div className="flex flex-col items-center text-center">
              {category.image ? (
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/default-service.jpg";
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4">
                  <span className="text-3xl">{category.title.charAt(0)}</span>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p>{category.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ServiceCategories;