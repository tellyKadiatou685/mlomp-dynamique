import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Share2, 
  Image 
} from 'lucide-react';

// Types and Interfaces
interface NewsDetail {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image?: string;
  readTime: string;
  tags?: string[];
}

// Fallback data structure for static news
const staticNewsItem: NewsDetail = {
  id: 1,
  title: "Inauguration du nouveau centre culturel de Mlomp",
  content: `Le nouveau centre culturel de Mlomp a été inauguré hier en présence des autorités locales et des habitants de la commune. 
  
  Cet événement marque un tournant important dans le développement culturel de notre région. Le centre, fruit de plusieurs années de planification et d'investissement, offrira un espace moderne pour les arts, les spectacles et les rencontres communautaires.

  ### Un projet structurant pour la commune

  Le centre culturel comprend plusieurs espaces:
  - Une grande salle de spectacle de 300 places
  - Des salles d'exposition pour les artistes locaux
  - Un espace multimédia pour les formations et les activités éducatives
  - Une bibliothèque moderne avec un fonds documentaire riche

  ### Impact sur la communauté

  Ce nouveau lieu vise à:
  - Promouvoir la culture locale et traditionnelle
  - Offrir des opportunités de formation artistique
  - Créer un espace de rencontre et d'échange pour les habitants
  - Attirer des événements culturels régionaux et nationaux

  L'inauguration a été saluée par les autorités locales comme un pas significatif vers le développement culturel et social de Mlomp.`,
  date: "15 Juin 2023",
  author: "Mairie de Mlomp",
  category: "Culture",
  image: "/lovable-uploads/hopital.jpg",
  readTime: "10 min",
  tags: ["Culture", "Développement", "Infrastructure"]
};

// NewsDetails Component
const NewsDetails: React.FC<{ 
  newsId?: number; 
  onBack?: () => void;
  newsServices?: {
    getNewsById: (id: number) => Promise<any>;
  };
}> = ({ 
  newsId, 
  onBack = () => window.history.back(),
  newsServices: customNewsServices 
}) => {
  const [newsItem, setNewsItem] = useState<NewsDetail>(staticNewsItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        // Validate newsId
        if (newsId === undefined || newsId === null || isNaN(newsId)) {
          throw new Error("ID d'actualité invalide");
        }

        setLoading(true);
        
        // Use custom news services if provided, otherwise use fallback
        const services = customNewsServices || {
          getNewsById: async (id: number) => {
            // Simulate API call with static data
            console.warn(`Utilisation des données statiques pour l'ID ${id}`);
            return Promise.resolve(staticNewsItem);
          }
        };

        const data = await services.getNewsById(newsId);
        
        // Format the data with fallback values
        const formattedNewsItem: NewsDetail = {
          id: data.id || newsId,
          title: data.title || staticNewsItem.title,
          content: data.content || staticNewsItem.content,
          date: data.createdAt 
            ? new Date(data.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) 
            : staticNewsItem.date,
          author: data.author?.username || staticNewsItem.author,
          category: data.category || staticNewsItem.category,
          image: data.image 
            ? `https://backendmlop-1.onrender.com/uploads/news/${data.image}` 
            : staticNewsItem.image,
          readTime: `${Math.max(1, Math.ceil(data.content?.length / 1000))} min`,
          tags: data.tags || staticNewsItem.tags
        };

        setNewsItem(formattedNewsItem);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'actualité:", err);
        setError(err instanceof Error ? err.message : "Impossible de charger les détails de l'actualité");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [newsId, customNewsServices]);

  // Function to convert markdown-like content to HTML
  const convertContentToHTML = (content: string) => {
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="list-disc ml-6">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/m, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  // Share functionality (basic implementation)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.content.substring(0, 200) + '...',
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Lien copié dans le presse-papiers');
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-mlomp-green" />
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500 text-xl mb-4">{error || "Actualité introuvable"}</p>
        <button 
          onClick={onBack} 
          className="bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-mlomp-green-dark"
        >
          Retour aux actualités
        </button>
      </div>
    );
  }

  return (
    <div className="container-custom max-w-4xl pt-20">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-mlomp-green"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux actualités
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            {newsItem.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{newsItem.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{newsItem.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{newsItem.readTime} de lecture</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span>{newsItem.category}</span>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8">
            {newsItem.image ? (
              <img 
                src={newsItem.image} 
                alt={newsItem.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/lovable-uploads/hopital.jpg";
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-full">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: convertContentToHTML(newsItem.content) 
            }}
          />
        </div>

        {/* Tags and Share */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-medium">Tags:</span>
              {newsItem.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-mlomp-green/10 text-mlomp-green text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              
              <button 
                onClick={handleShare}
                className="ml-auto flex items-center text-gray-600 hover:text-mlomp-green"
              >
                <Share2 className="w-4 h-4 mr-2" /> Partager
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Restez informé</h3>
          <p className="text-gray-600 mb-6">
            Abonnez-vous à notre newsletter pour ne manquer aucune actualité de la commune.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="px-4 py-2 rounded-md border border-gray-300 flex-grow"
            />
            <button className="bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-mlomp-green-dark">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;