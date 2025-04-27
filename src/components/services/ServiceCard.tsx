import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import serviceServices from "@/services/serviceServices";

// Composant individuel d'une carte de service
const ServiceCard = ({ title, description, link, image, delay = "delay-0" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: parseInt(delay.replace('delay-', '')) / 1000 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "/lovable-uploads/default-service.jpg";
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Link to={link} className="text-mlomp-green hover:text-mlomp-green-dark flex items-center font-medium mt-auto">
          En savoir plus
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

// Composant grille qui récupère et affiche tous les services
const ServiceGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appel à l'API pour récupérer les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Récupération des services...");
        setLoading(true);
        
        const data = await serviceServices.getAllServices();
        console.log("Données de services reçues:", data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Conversion des données de l'API au format attendu
          const formattedServices = data.map(service => ({
            id: service.id,
            title: service.title,
            description: service.description?.substring(0, 150) + '...' || "Aucune description disponible",
            link: `/services/${service.id}`,
            image: service.image || "/lovable-uploads/default-service.jpg"
          }));
          
          setServices(formattedServices);
          console.log("Services formatés:", formattedServices);
        } else {
          setError("Aucun service trouvé");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err);
        setError(err.message || "Une erreur est survenue lors du chargement des services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <p className="mt-4">Veuillez réessayer plus tard ou contacter l'administrateur</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucun service disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          title={service.title}
          description={service.description}
          link={service.link}
          image={service.image}
          delay={`delay-${index * 100}`}
        />
      ))}
    </div>
  );
};

// Export du composant principal et de la grille
ServiceCard.Grid = ServiceGrid;

export default ServiceCard;