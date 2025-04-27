import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionTitle from "@/components/common/SectionTitle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Tag, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import newsServices from "@/services/newsServices";

// Données statiques pour les actualités (fallback)
const staticNewsItems = [
  {
    id: 1,
    title: "Inauguration du nouveau centre culturel de Mlomp",
    excerpt: "Le nouveau centre culturel de Mlomp a été inauguré hier en présence des autorités locales et des habitants de la commune.",
    date: "15 Juin 2023",
    author: "Mairie de Mlomp",
    category: "Culture",
    image: "/lovable-uploads/hopital.jpg",
    readTime: "3 min"
  },
  {
    id: 2,
    title: "Lancement du programme de reforestation communautaire",
    excerpt: "Un nouveau programme de reforestation communautaire a été lancé dans la commune de Mlomp pour lutter contre la déforestation.",
    date: "2 Mai 2023",
    author: "Service Environnement",
    category: "Environnement",
    image: "/lovable-uploads/foreste.jpeg",
    readTime: "4 min"
  },
  {
    id: 3,
    title: "Rénovation des infrastructures scolaires de la commune",
    excerpt: "La commune a entamé des travaux de rénovation dans plusieurs écoles pour améliorer les conditions d'apprentissage des élèves.",
    date: "18 Avril 2023",
    author: "Service Éducation",
    category: "Éducation",
    image: "/lovable-uploads/ecole.jpeg",
    readTime: "5 min"
  }
];

const News = () => {
  const [newsItems, setNewsItems] = useState(staticNewsItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Appel à l'API pour récupérer les actualités depuis le backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await newsServices.getAllNews();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Transformer les données dynamiques
          const formattedNews = data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.content?.substring(0, 150) + '...' || "Aucune description disponible",
            date: new Date(item.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            author: item.author?.username || "Mairie de Mlomp",
            category: item.category || "Actualité",
            image: item.image || "/lovable-uploads/hopital.jpg",
            readTime: `${Math.max(1, Math.ceil(item.content?.length / 1000))} min`
          }));
          
          // Combiner données dynamiques et statiques
          const combinedNews = [
            ...formattedNews,
            ...staticNewsItems.filter(
              staticItem => !formattedNews.some(dynamicItem => dynamicItem.id === staticItem.id)
            )
          ];
          
          setNewsItems(combinedNews);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des actualités:", error);
        // En cas d'erreur, conserver les données statiques
        setError("Impossible de charger les dernières actualités. Affichage des actualités archivées.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchNews();
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
        <title>Actualités | Commune de Mlomp</title>
        <meta 
          name="description" 
          content="Découvrez les dernières actualités de la commune de Mlomp, les événements à venir et les projets en cours dans notre belle région du Sénégal." 
        />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-mlomp-green/10 to-mlomp-yellow/10 py-16 md:py-24">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                Actualités de Mlomp
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Restez informé des dernières nouvelles, événements et initiatives de la commune de Mlomp.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Actualités récentes */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <SectionTitle 
              title="Dernières Actualités" 
              subtitle="Découvrez les événements récents et les actualités importantes de notre commune"
              centered
            />

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-mlomp-green" />
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <p className="mt-2 text-gray-600">Affichage des actualités statiques</p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
              >
                {newsItems.map((news) => (
                  <motion.div key={news.id} variants={itemVariants}>
                    <Card className="h-full flex flex-col hover:shadow-md transition-all duration-300">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/lovable-uploads/hopital.jpg";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-mlomp-orange text-white text-xs px-2 py-1 rounded-full">
                          {news.category}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-4">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {news.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {news.readTime}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{news.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription className="text-gray-600">
                          {news.excerpt}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center pt-0">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span>{news.author}</span>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-mlomp-green hover:text-mlomp-green-dark">
                          <Link to={`/actualites/${news.id}`} className="flex items-center">
                            <span>Lire plus</span>
                            <ArrowRight className="ml-1 w-3 h-3" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="mt-16 text-center">
              <Button className="bg-mlomp-green hover:bg-mlomp-green-dark">
                Voir toutes les actualités
              </Button>
            </div>
          </div>
        </section>

        {/* Section Abonnement */}
        <section className="py-16 bg-mlomp-blue/5">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Restez informé
                </h2>
                <p className="text-gray-600 mb-8">
                  Abonnez-vous à notre newsletter pour recevoir les dernières actualités de la commune directement dans votre boîte mail.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="px-4 py-2 rounded-md border border-gray-300 flex-grow"
                  />
                  <Button className="bg-mlomp-green hover:bg-mlomp-green-dark">
                    S'abonner
                  </Button>
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

export default News;