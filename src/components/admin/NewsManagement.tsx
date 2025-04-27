// src/components/admin/NewsManager.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, Upload } from "lucide-react";
import newsServices from "@/services/newsServices";

const NewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedNews, setSelectedNews] = useState(null);
  
  // Formulaire
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  // Charger les actualités
  const fetchNews = async () => {
    try {
      setLoading(true);
      const news = await newsServices.getAllNews();
      setNewsList(news);
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      alert("Impossible de charger les actualités");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (news) => {
    setSelectedNews(news);
    setTitle(news.title);
    setContent(news.content);
    setCategory(news.category || "");
    setImagePreview(news.image || null);
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setImage(null);
    setImagePreview(null);
    setSelectedNews(null);
  };

  const closeForm = () => {
    setFormMode("hidden");
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setImage(file);
      
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("Le titre et le contenu sont requis");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const newsData = {
        title,
        content,
        category: category || undefined
      };
      
      if (formMode === "add") {
        await newsServices.createNews(newsData, image);
      } else if (formMode === "edit" && selectedNews) {
        await newsServices.updateNews(selectedNews.id, newsData, image);
      }
      
      await fetchNews();
      closeForm();
      alert(formMode === "add" ? "Actualité ajoutée avec succès" : "Actualité mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (newsId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      return;
    }
    
    try {
      await newsServices.deleteNews(newsId);
      await fetchNews();
      alert("Actualité supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion des actualités</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter une actualité
        </button>
      </div>
      
      {/* Liste des actualités */}
      {loading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="w-8 h-8 animate-spin text-mlomp-green" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Aucune actualité trouvée
                  </td>
                </tr>
              ) : (
                newsList.map((news) => (
                  <tr key={news.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {news.image && (
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{news.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {news.category ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {news.category}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Non définie</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(news.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(news)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="text-red-600 hover:text-red-900"
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-mlomp-green">
                {formMode === "add" ? "Ajouter une actualité" : "Modifier l'actualité"}
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
                  placeholder="Titre de l'actualité"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="culture">Culture</option>
                  <option value="education">Éducation</option>
                  <option value="environnement">Environnement</option>
                  <option value="sante">Santé</option>
                  <option value="evenements">Événements</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu de l'actualité"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green min-h-[200px]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                
                {!imagePreview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-mlomp-green transition-colors"
                  >
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Cliquez pour sélectionner une image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF jusqu'à 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Image preview" 
                      className="rounded-lg max-h-64 mx-auto border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      title="Supprimer l'image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
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
                      {formMode === "add" ? "Création..." : "Mise à jour..."}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      {formMode === "add" ? "Créer" : "Mettre à jour"}
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

export default NewsManager;