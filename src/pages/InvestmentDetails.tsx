import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Calendar, DollarSign, CheckCircle2, Image } from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import investmentServices from "@/services/investmentServices";

interface InvestmentDetail {
  id: number;
  title: string;
  description: string;
  amount: string;
  startYear?: string;
  endYear?: string;
  status: string;
  category: string;
  image?: string;
  fullDescription?: string;
  partners?: string[];
  expectedImpacts?: string[];
  location?: string;
}

const InvestmentDetails: React.FC = () => {
  const [investment, setInvestment] = useState<InvestmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestmentDetails = async () => {
      try {
        if (!id) {
          throw new Error("Aucun ID d'investissement n'a été fourni");
        }

        setLoading(true);
        const data = await investmentServices.getInvestmentById(parseInt(id, 10));
        
        // Format the data with fallback values
        const formattedInvestment: InvestmentDetail = {
          id: data.id,
          title: data.title,
          description: data.shortDescription || data.description.substring(0, 150) + "...",
          fullDescription: data.description,
          amount: data.amount,
          startYear: data.startYear || "",
          endYear: data.endYear || "",
          status: data.status,
          category: data.category,
          image: data.image ? `http://localhost:5000/uploads/investments/${data.image}` : undefined,
          partners: data.partners || [],
          expectedImpacts: data.expectedImpacts || [],
          location: data.location || "Non spécifié"
        };

        setInvestment(formattedInvestment);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'investissement:", err);
        setError("Impossible de charger les détails du projet d'investissement");
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500 text-xl mb-4">{error || "Projet introuvable"}</p>
        <Button onClick={() => navigate('/investissements')} className="bg-mlomp-green">
          Retour aux projets
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${investment.title} | Investissements Mlomp`}</title>
        <meta 
          name="description" 
          content={`Détails du projet d'investissement ${investment.title} à Mlomp`} 
        />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/investissements')} 
              className="mb-6 flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux projets
            </Button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              >
                {investment.image ? (
                  <img 
                    src={investment.image} 
                    alt={investment.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                    <Image className="w-16 h-16 mb-4" />
                    <p>Aucune image disponible</p>
                  </div>
                )}
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{investment.title}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-mlomp-blue/10 text-mlomp-blue text-sm px-3 py-1 rounded">
                      {investment.category}
                    </span>
                    <span className="bg-mlomp-green/10 text-mlomp-green text-sm px-3 py-1 rounded">
                      {investment.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-mlomp-green" />
                    <span className="font-medium">{investment.amount}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-mlomp-green" />
                    <span>
                      {investment.startYear} {investment.endYear && `- ${investment.endYear}`}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Description du projet</h2>
                  <p className="text-gray-600">{investment.fullDescription}</p>
                </div>

                {investment.location && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Localisation</h3>
                    <p className="text-gray-600">{investment.location}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Additional Project Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Partners */}
                {investment.partners && investment.partners.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Partenaires</h3>
                    <ul className="space-y-2">
                      {investment.partners.map((partner, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-mlomp-green" />
                          {partner}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expected Impacts */}
                {investment.expectedImpacts && investment.expectedImpacts.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Impacts attendus</h3>
                    <ul className="space-y-2">
                      {investment.expectedImpacts.map((impact, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-mlomp-green" />
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center bg-gray-50 p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Intéressé par ce projet ?</h3>
              <p className="text-gray-600 mb-6">
                Contactez notre équipe de développement économique pour plus d'informations
                ou pour discuter d'un potentiel partenariat.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-mlomp-green hover:bg-mlomp-green-dark">
                  Contacter l'équipe
                </Button>
                <Button variant="outline">Télécharger la fiche projet</Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default InvestmentDetails;