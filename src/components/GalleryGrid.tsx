// src/components/gallery/GalleryGrid.tsx
import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import galleryService from "../services/GalleryService";

// Définir SectionTitle localement
const SectionTitle = ({ title, subtitle, centered }: { title: string; subtitle: string; centered?: boolean }) => (
  <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-gray-600">{subtitle}</p>
    {centered && <div className="w-24 h-1 bg-mlomp-green mx-auto mt-4"></div>}
  </div>
);

// Interface pour les éléments de galerie
interface GalleryItem {
  id: string;
  title: string;
  mediaUrl: string;
  type: string;
  createdAt: string;
}

const GalleryGrid = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  // Charger les données depuis le service
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        setLoading(true);
        const data = await galleryService.getAllGalleryItems();
        console.log('Données récupérées:', data);
        setGalleryItems(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
        setError('Impossible de charger les images. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  // Fonction pour ouvrir l'image en grand
  const openImage = (item: GalleryItem) => {
    setSelectedImage(item);
    // Bloquer le défilement quand le modal est ouvert
    document.body.style.overflow = "hidden";
  };

  // Fonction pour fermer l'image
  const closeImage = () => {
    setSelectedImage(null);
    // Réactiver le défilement
    document.body.style.overflow = "auto";
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-mlomp-blue/5 to-mlomp-green/5">
      <div className="container-custom">
        <SectionTitle
          title="Galerie"
          subtitle="Découvrez en images les moments forts et le patrimoine de la commune de Mlomp"
          centered
        />

        {/* Message d'erreur */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Grille de la galerie */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-mlomp-green border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => openImage(item)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/lovable-uploads/hopital.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.type === "image" || item.type === "IMAGE" ? "photo" : "vidéo"}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Camera className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune image disponible pour le moment.</p>
          </div>
        )}

        {/* Section pour partager des photos */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Partagez vos photos avec nous</h3>
              <p className="text-gray-600 mb-6">
                Vous avez des photos ou vidéos de la commune de Mlomp que vous souhaitez partager ? 
                Envoyez-les nous pour qu'elles soient publiées dans notre galerie commune.
              </p>
              <button className="btn-primary bg-mlomp-green hover:bg-mlomp-green-dark text-white px-6 py-2 rounded-md transition-colors">
                Nous contacter
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-mlomp-green/10 to-mlomp-blue/10 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4">Événement à venir</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-24">Événement:</span>
                  <span>Exposition Photos</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Date:</span>
                  <span>25 Mai 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Lieu:</span>
                  <span>Centre Culturel de Mlomp</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-24">Thème:</span>
                  <span>Patrimoine naturel de Mlomp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <div 
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.mediaUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-white">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <p className="text-sm opacity-80">
                {new Date(selectedImage.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <button 
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
              onClick={closeImage}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;