// src/components/admin/ServicesManagement.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, Upload } from "lucide-react";
import serviceServices from "@/services/serviceServices";

interface Service {
  id: number;
  title: string;
  description: string;
  category: 'EDUCATION' | 'SANTE' | 'INFRASTRUCTURES';
  icon: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

const ServicesManagement = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<'EDUCATION' | 'SANTE' | 'INFRASTRUCTURES'>('EDUCATION');
  const [icon, setIcon] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const services = await serviceServices.getAllServices();
      setServicesList(services);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      alert("Impossible de charger les services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (service: Service) => {
    console.log('Service image:', service.image);
    
    setSelectedService(service);
    setTitle(service.title);
    setDescription(service.description);
    setCategory(service.category);
    setIcon(service.icon);
    
    // Utiliser directement l'URL Cloudinary
    if (service.image) {
      setImagePreview(service.image);
    } else {
      setImagePreview(null);
    }
    
    console.log('Image Preview URL:', service.image);
    
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory('EDUCATION');
    setIcon("");
    setImage(null);
    setImagePreview(null);
    setSelectedService(null);
  };

  const closeForm = () => {
    setFormMode("hidden");
    resetForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setImage(file);
      
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      alert("Le titre, la description et la catégorie sont requis");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const serviceData = {
        title,
        description,
        category,
        icon: icon || undefined
      };
      
      if (formMode === "add") {
        await serviceServices.createService(serviceData, image);
      } else if (formMode === "edit" && selectedService) {
        await serviceServices.updateService(selectedService.id, serviceData, image);
      }
      
      await fetchServices();
      closeForm();
      alert(formMode === "add" ? "Service ajouté avec succès" : "Service mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (serviceId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }
    
    try {
      await serviceServices.deleteService(serviceId);
      await fetchServices();
      alert("Service supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  // Fonction pour afficher la catégorie avec une couleur
  const getCategoryBadge = (category: string) => {
    let color = "";
    let text = "";
    
    switch (category) {
      case "EDUCATION":
        color = "bg-blue-100 text-blue-800";
        text = "Éducation";
        break;
      case "SANTE":
        color = "bg-green-100 text-green-800";
        text = "Santé";
        break;
      case "INFRASTRUCTURES":
        color = "bg-yellow-100 text-yellow-800";
        text = "Infrastructures";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        text = category;
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion des services</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un service
        </button>
      </div>
      
      {/* Liste des services */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icône</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicesList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun service trouvé
                  </td>
                </tr>
              ) : (
                servicesList.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {service.image && (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(service.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.icon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(service)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
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
                {formMode === "add" ? "Ajouter un service" : "Modifier le service"}
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
                  placeholder="Titre du service"
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
                  onChange={(e) => setCategory(e.target.value as 'EDUCATION' | 'SANTE' | 'INFRASTRUCTURES')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
                >
                  <option value="EDUCATION">Éducation</option>
                  <option value="SANTE">Santé</option>
                  <option value="INFRASTRUCTURES">Infrastructures</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                  Icône (classe ou nom)
                </label>
                <input
                  id="icon"
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Classe ou nom de l'icône"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green min-h-[150px]"
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
                      PNG, JPG, GIF, WEBP jusqu'à 10MB
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

export default ServicesManagement;