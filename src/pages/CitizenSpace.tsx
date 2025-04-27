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

const ServiceCard = ({ icon, title, description, link }: ServiceCardProps) => {
  return (
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
};

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
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Espace Citoyen
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Un portail dédié aux services administratifs pour les habitants de Mlomp
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-mlomp-green hover:bg-mlomp-green-dark">
                  Démarches en ligne
                </Button>
                <Button variant="outline">
                  Prendre rendez-vous
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <SectionTitle 
              title="Nos Services" 
              subtitle="Accédez facilement à tous les services administratifs de la commune de Mlomp"
              centered
            />

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            >
              {staticServices.map((service, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ServiceCard {...service} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Démarches Administratives */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <SectionTitle 
              title="Démarches Administratives" 
              subtitle="Consultez les informations nécessaires pour vos démarches administratives"
              centered
            />
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12"
              >
                {procedures.map((procedure, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full">
                      <CardHeader className="flex flex-row items-center gap-4">
                        <div className="bg-mlomp-green/10 p-3 rounded-full text-mlomp-green">
                          {procedure.icon}
                        </div>
                        <div>
                          <CardTitle>{procedure.title}</CardTitle>
                          <p className="text-sm text-gray-500">{procedure.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Documents requis:</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 pl-2">
                              {procedure.documents.map((doc, idx) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Délai de traitement:</span>
                            <span className="bg-mlomp-blue/10 text-mlomp-blue text-sm px-2 py-1 rounded">
                              {procedure.delay}
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-2"
                            asChild={!!procedure.onlineUrl}
                          >
                            {procedure.onlineUrl ? (
                              <Link to={procedure.onlineUrl}>Demander en ligne</Link>
                            ) : (
                              "Demander en ligne"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="mt-12 text-center">
              <Button className="bg-mlomp-green hover:bg-mlomp-green-dark" asChild>
                <Link to="/espace-citoyen/demarches">Voir toutes les démarches</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Conseil Municipal */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Participez à la vie démocratique locale</h2>
                <p className="text-gray-600 mb-6">
                  La commune de Mlomp encourage la participation citoyenne active. Partagez vos idées, 
                  exprimez vos besoins et contribuez à l'amélioration de votre commune.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-mlomp-green/10 p-2 rounded-full text-mlomp-green mr-3 mt-1">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Réunions publiques</h3>
                      <p className="text-sm text-gray-600">Participez aux réunions du conseil municipal et aux consultations publiques</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-mlomp-green/10 p-2 rounded-full text-mlomp-green mr-3 mt-1">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Budget participatif</h3>
                      <p className="text-sm text-gray-600">Proposez des projets pour votre quartier et votez pour les initiatives que vous souhaitez voir réalisées</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-mlomp-green/10 p-2 rounded-full text-mlomp-green mr-3 mt-1">
                      <FileQuestion className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">Questions aux élus</h3>
                      <p className="text-sm text-gray-600">Posez vos questions directement aux élus municipaux via notre plateforme en ligne</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-8 bg-mlomp-green hover:bg-mlomp-green-dark">
                  Comment participer ?
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-mlomp-blue/5 to-mlomp-green/5 p-8 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-6">Prochaine réunion publique</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-mlomp-green mr-3" />
                    <div>
                      <span className="font-medium">Date et heure</span>
                      <p className="text-gray-600">15 Juillet 2023 à 14h00</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-mlomp-green mr-3" />
                    <div>
                      <span className="font-medium">Lieu</span>
                      <p className="text-gray-600">Salle du Conseil Municipal, Mairie de Mlomp</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Ordre du jour</span>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-mlomp-green mr-2">•</span>
                        <span>Présentation du budget participatif 2023-2024</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-mlomp-green mr-2">•</span>
                        <span>Projets d'aménagement urbain pour le centre-ville</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-mlomp-green mr-2">•</span>
                        <span>Questions diverses des citoyens</span>
                      </li>
                    </ul>
                  </div>
                  <Button className="w-full">S'inscrire à la réunion</Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default CitizenSpace;