// src/components/admin/GalleryManager.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, Upload, Image } from "lucide-react";
import GalleryService from "@/services/GalleryService";


const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Formulaire
  const [title, setTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  // Charger les éléments de galerie
  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const items = await GalleryService.getAllGalleryItems();
      setGalleryItems(items);
    } catch (error) {
      console.error("Erreur lors du chargement de la galerie:", error);
      alert("Impossible de charger les éléments de galerie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (item) => {
    setSelectedItem(item);
    setTitle(item.title);
    setMediaPreview(item.mediaUrl || null);
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setMediaFile(null);
    setMediaPreview(null);
    setSelectedItem(null);
  };

  const closeForm = () => {
    setFormMode("hidden");
    resetForm();
  };

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setMediaFile(file);
      
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title) {
      alert("Le titre est requis");
      return;
    }
    
    if (formMode === "add" && !mediaFile) {
      alert("Veuillez sélectionner un fichier média");
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (formMode === "add") {
        await GalleryService.createGalleryItem(title, mediaFile);
      } else if (formMode === "edit" && selectedItem) {
        await GalleryService.updateGalleryItem(selectedItem.id, title, mediaFile);
      }
      
      await fetchGalleryItems();
      closeForm();
      alert(formMode === "add" ? "Élément ajouté avec succès" : "Élément mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément de la galerie ?")) {
      return;
    }
    
    try {
      await GalleryService.deleteGalleryItem(itemId);
      await fetchGalleryItems();
      alert("Élément supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion de la galerie</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un média
        </button>
      </div>
      
      {/* Liste des éléments de la galerie */}
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="w-8 h-8 animate-spin text-mlomp-green" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {galleryItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun élément trouvé dans la galerie
                  </td>
                </tr>
              ) : (
                galleryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <img 
                            src={item.mediaUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/lovable-uploads/hopital.jpg";
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.type === "image" || item.type === "IMAGE" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-pink-100 text-pink-800"
                      }`}>
                        {item.type === "image" || item.type === "IMAGE" ? "Image" : "Vidéo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Formulaire modal pour ajouter/modifier */}
      {formMode !== "hidden" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-mlomp-green">
                {formMode === "add" ? "Ajouter à la galerie" : "Modifier cet élément"}
              </h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titre
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de l'image ou vidéo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formMode === "add" ? "Média (Image ou Vidéo)" : "Remplacer le média"}
                </label>
                
                {!mediaPreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-mlomp-green transition-colors"
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Cliquez pour sélectionner une image ou vidéo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, MP4, etc.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={mediaPreview} 
                      alt="Aperçu du média" 
                      className="rounded-lg max-h-64 mx-auto border"
                    />
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Supprimer le média"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
                
                {formMode === "edit" && !mediaFile && (
                  <p className="text-xs text-gray-500 mt-2">
                    Laissez vide pour conserver le média actuel
                  </p>
                )}
              </div>
              
              <div className="flex justify-end pt-4 space-x-3">
                <button 
                  type="button" 
                  onClick={closeForm}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-mlomp-green text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {formMode === "add" ? "Ajout en cours..." : "Mise à jour..."}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {formMode === "add" ? "Ajouter" : "Mettre à jour"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;