import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import newsServices from '@/services/newsServices';

// Types et interfaces
interface NewsDetail {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string | { id: number; username: string }; // Modification pour supporter les deux formats
  category: string;
  image?: string;
  readTime: string;
  tags?: string[];
}

// Composant NewsDetails
const NewsDetails: React.FC = () => {
  // Récupérer l'ID depuis les paramètres de l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [newsItem, setNewsItem] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour revenir à la page des actualités
  const onBack = () => {
    navigate('/actualites');
  };

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        // Valider l'ID d'actualité
        const newsId = id ? parseInt(id, 10) : undefined;
        
        if (newsId === undefined || isNaN(newsId)) {
          throw new Error("ID d'actualité invalide");
        }

        setLoading(true);
        
        // Récupérer les détails de l'actualité
        const data = await newsServices.getNewsById(newsId);
        
        if (data) {
          // S'assurer que l'auteur est une chaîne de caractères
          const formattedData = {
            ...data,
            // Gérer le cas où l'auteur est un objet avec username
            author: typeof data.author === 'object' && data.author !== null
              ? data.author.username || 'Auteur inconnu'
              : data.author || 'Auteur inconnu'
          };
          
          setNewsItem(formattedData);
        } else {
          throw new Error("Actualité non trouvée");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails de l'actualité:", err);
        setError(err instanceof Error ? err.message : "Impossible de charger les détails de l'actualité");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [id]);

  // Function to convert markdown-like content to HTML
  const convertContentToHTML = (content: string) => {
    if (!content) return '<p class="mb-4">Aucun contenu disponible</p>';
    
    return content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="list-disc ml-6">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^/m, '<p class="mb-4">')
      .replace(/$/, '</p>');
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem?.title || "",
        text: newsItem?.content?.substring(0, 200) + '...' || "",
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
            {newsItem.category && (
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span>{newsItem.category}</span>
              </div>
            )}
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