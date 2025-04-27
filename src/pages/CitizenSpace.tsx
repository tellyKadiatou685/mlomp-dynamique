import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTitle from "@/components/common/SectionTitle";
import { FileText, UserCheck, MessageSquare, ClipboardList, Calendar, MapPin, FileQuestion, FileCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import procedureServices from "@/services/procedureServices";

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
};

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => (
  <Link
    to={link}
    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
  >
    <div className="bg-mlomp-blue/10 p-4 rounded-full mb-4 text-mlomp-blue group-hover:bg-mlomp-blue group-hover:text-white transition-all">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </Link>
);

// Données statiques pour les services
const staticServices = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Documents Administratifs",
    description: "Accédez aux formulaires et soumettez vos demandes en ligne",
    link: "/espace-citoyen/documents"
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    title: "Démarches Administratives",
    description: "Guide pour effectuer vos démarches auprès de la commune",
    link: "/espace-citoyen/demarches"
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Contacter la Mairie",
    description: "Adressez vos questions et préoccupations directement à nos services",
    link: "/espace-citoyen/contact"
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Décisions Municipales",
    description: "Consultez les délibérations et arrêtés du conseil municipal",
    link: "/espace-citoyen/decisions"
  }
];

// Données statiques pour les procédures (fallback)
const staticProcedures = [
  {
    title: "Acte de naissance",
    description: "Demande de copie ou d'extrait d'acte de naissance",
    icon: <FileText className="h-5 w-5" />,
    documents: ["Pièce d'identité", "Formulaire de demande"],
    delay: "3 jours"
  },
  {
    title: "Carte d'identité",
    description: "Demande ou renouvellement de carte d'identité nationale",
    icon: <UserCheck className="h-5 w-5" />,
    documents: ["Acte de naissance", "Photos d'identité", "Certificat de résidence"],
    delay: "15 jours"
  },
  {
    title: "Certificat de résidence",
    description: "Attestation officielle de domicile",
    icon: <MapPin className="h-5 w-5" />,
    documents: ["Pièce d'identité", "Justificatif de domicile"],
    delay: "1 jour"
  },
  {
    title: "Acte de mariage",
    description: "Demande de copie ou d'extrait d'acte de mariage",
    icon: <FileCheck className="h-5 w-5" />,
    documents: ["Pièces d'identité des époux", "Livret de famille"],
    delay: "2 jours"
  }
];

const CitizenSpace = () => {
  const [procedures, setProcedures] = useState(staticProcedures);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour récupérer les démarches administratives depuis l'API
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        console.log("Récupération des démarches administratives...");
        setLoading(true);
        
        const data = await procedureServices.getAllProcedures();
        console.log("Démarches récupérées:", data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Conversion des données de l'API au format attendu par le composant
          const formattedProcedures = data.map(procedure => {
            // Conversion de la chaîne JSON en tableau pour les documents requis
            let requiredDocs: string[] = [];
            try {
              requiredDocs = JSON.parse(procedure.requiredDocs);
              // Si ce n'est pas un tableau, on le convertit en tableau
              if (!Array.isArray(requiredDocs)) {
                requiredDocs = [procedure.requiredDocs];
              }
            } catch (error) {
              // Si le parsing échoue, on utilise la chaîne comme un seul document
              requiredDocs = [procedure.requiredDocs];
            }
            
            // Détermination de l'icône en fonction du titre ou de l'icône dans les données
            let procedureIcon;
            switch (procedure.icon?.toLowerCase()) {
              case 'document':
              case 'file':
              case 'file-text':
                procedureIcon = <FileText className="h-5 w-5" />;
                break;
              case 'id-card':
              case 'user':
              case 'user-check':
                procedureIcon = <UserCheck className="h-5 w-5" />;
                break;
              case 'map':
              case 'location':
              case 'map-pin':
                procedureIcon = <MapPin className="h-5 w-5" />;
                break;
              case 'certificate':
              case 'check':
              case 'file-check':
                procedureIcon = <FileCheck className="h-5 w-5" />;
                break;
              default:
                // Détermination par titre si pas d'icône spécifiée
                if (procedure.title.toLowerCase().includes('naissance')) {
                  procedureIcon = <FileText className="h-5 w-5" />;
                } else if (procedure.title.toLowerCase().includes('identité') || procedure.title.toLowerCase().includes('carte')) {
                  procedureIcon = <UserCheck className="h-5 w-5" />;
                } else if (procedure.title.toLowerCase().includes('résidence') || procedure.title.toLowerCase().includes('domicile')) {
                  procedureIcon = <MapPin className="h-5 w-5" />;
                } else if (procedure.title.toLowerCase().includes('mariage')) {
                  procedureIcon = <FileCheck className="h-5 w-5" />;
                } else {
                  procedureIcon = <FileText className="h-5 w-5" />;
                }
            }
            
            return {
              title: procedure.title,
              description: procedure.description,
              icon: procedureIcon,
              documents: requiredDocs,
              delay: `${procedure.processingTime} ${procedure.processingTime === 1 ? 'jour' : 'jours'}`,
              onlineUrl: procedure.onlineUrl
            };
          });
          
          // Limitons à 4 procédures pour l'affichage
          setProcedures(formattedProcedures.slice(0, 4));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des démarches administratives:", err);
        setError("Erreur lors du chargement des démarches");
        // On conserve les données statiques en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Espace Citoyen | Commune de Mlomp</title>
        <meta 
          name="description" 
          content="Accédez aux services en ligne de la commune de Mlomp, effectuez vos démarches administratives et restez informé des décisions municipales." 
        />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-mlomp-blue/10 to-mlomp-green/10 py-16 md:py-24">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-bold text-mlomp-blue">Bienvenue sur l'Espace Citoyen</h1>
              <p className="mt-4 text-lg text-gray-600">Effectuez vos démarches administratives en ligne en toute simplicité.</p>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <SectionTitle title="Nos Services" />
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
            >
              {staticServices.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Procedures Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <SectionTitle title="Nos Démarches Administratives" />
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8"
            >
              {loading ? (
                <div className="col-span-4 text-center">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto text-mlomp-blue" />
                </div>
              ) : error ? (
                <div className="col-span-4 text-center text-red-500">{error}</div>
              ) : (
                procedures.map((procedure, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          {procedure.icon}
                          <span>{procedure.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{procedure.description}</p>
                        <p className="mt-2 text-xs text-gray-500">Documents nécessaires: {procedure.documents.join(', ')}</p>
                        <p className="mt-2 text-xs text-gray-500">Délai: {procedure.delay}</p>
                        {procedure.onlineUrl && (
                          <Link to={procedure.onlineUrl}>
                            <Button className="mt-4">Effectuer la démarche</Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CitizenSpace;
