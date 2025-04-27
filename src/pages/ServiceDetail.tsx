import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ServiceLayout from '@/components/services/ServiceLayout';
import serviceServices from '@/services/serviceServices';
import { Loader2 } from 'lucide-react';

// Detailed interface matching the expected structure in ServiceLayout
interface ServiceData {
  id: number;
  title: string;
  description: string;
  category: 'EDUCATION' | 'SANTE' | 'INFRASTRUCTURES';
  image?: string | null;
  icon?: string;
  longDescription?: string;
  contactInfo?: {
    email: string;
    phone: string;
    address: string;
  };
  hours?: string;
  responsiblePerson?: string;
  relatedServices?: any[]; // Adjust type as needed
}

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<ServiceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!serviceId) {
        setError("Identifiant de service manquant");
        setLoading(false);
        return;
      }

      try {
        console.log(`Récupération des détails du service ${serviceId}...`);
        setLoading(true);

        const data = await serviceServices.getServiceById(Number(serviceId));
        console.log("Données du service reçues:", data);

        if (data) {
          // Formater les données du service avec toutes les propriétés nécessaires
          const formattedService: ServiceData = {
            id: data.id,
            title: data.title,
            description: data.description || "Aucune description disponible",
            category: data.category,
            image: data.image, // URL Cloudinary directe
            icon: data.icon || 'default-icon',
            longDescription: data.description,
            contactInfo: {
              email: "contact@mlomp.sn",
              phone: "+221 77 000 00 00",
              address: "Mairie de Mlomp"
            },
            hours: "Lundi au Vendredi, 8h-17h",
            responsiblePerson: "Administration communale",
            relatedServices: [] // Vous pouvez ajouter une logique pour récupérer des services liés
          };

          setService(formattedService);
        } else {
          setError("Service non trouvé");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du service:", err);
        setError("Erreur lors du chargement du service");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceId]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
      </div>
    );
  }

  // Rediriger vers la page des services si le service n'existe pas
  if (error || !service) {
    console.error("Erreur ou service non trouvé:", error);
    return <Navigate to="/services" replace />;
  }

  return <ServiceLayout service={service} />;
};

export default ServiceDetail;