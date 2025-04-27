// src/components/admin/ProjectsManagement.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, Upload } from "lucide-react";
import projectServices from "@/services/projectServices";

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string | null;
  budget: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  managerId: number;
  manager: {
    id: number;
    username: string;
  };
}

const ProjectsManagement = () => {
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PLANNED");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les projets
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projects = await projectServices.getAllProjects();
      setProjectsList(projects);
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
      alert("Impossible de charger les projets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (project: Project) => {
    setSelectedProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setStatus(project.status);
    setStartDate(project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "");
    setEndDate(project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "");
    setBudget(project.budget || "");
    
    // Utiliser directement l'URL de l'image Cloudinary
    setImagePreview(project.image || null);
    
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("PLANNED");
    setStartDate("");
    setEndDate("");
    setBudget("");
    setImage(null);
    setImagePreview(null);
    setSelectedProject(null);
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
    
    if (!title || !description || !startDate) {
      alert("Le titre, la description et la date de début sont requis");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const projectData = {
        title,
        description,
        status,
        startDate,
        endDate: endDate || undefined,
        budget: budget || undefined
      };
      
      if (formMode === "add") {
        await projectServices.createProject(projectData, image);
      } else if (formMode === "edit" && selectedProject) {
        await projectServices.updateProject(selectedProject.id, projectData, image);
      }
      
      await fetchProjects();
      closeForm();
      alert(formMode === "add" ? "Projet ajouté avec succès" : "Projet mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }
    
    try {
      await projectServices.deleteProject(projectId);
      await fetchProjects();
      alert("Projet supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  // Fonction pour afficher le statut avec une couleur
  const getStatusBadge = (status: string) => {
    let color = "";
    let text = "";
    
    switch (status) {
      case "PLANNED":
        color = "bg-blue-100 text-blue-800";
        text = "Planifié";
        break;
      case "IN_PROGRESS":
        color = "bg-yellow-100 text-yellow-800";
        text = "En cours";
        break;
      case "COMPLETED":
        color = "bg-green-100 text-green-800";
        text = "Terminé";
        break;
      case "CANCELLED":
        color = "bg-red-100 text-red-800";
        text = "Annulé";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        text = status;
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
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion des projets</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un projet
        </button>
      </div>
      
      {/* Liste des projets */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projectsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun projet trouvé
                  </td>
                </tr>
              ) : (
                projectsList.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{project.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.budget ? `${project.budget} FCFA` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(project)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
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
                {formMode === "add" ? "Ajouter un projet" : "Modifier le projet"}
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
                  placeholder="Titre du projet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
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
                  placeholder="Description du projet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green min-h-[150px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                    required
                  >
                    <option value="PLANNED">Planifié</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (FCFA)
                  </label>
                  <input
                    id="budget"
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget du projet"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin (optionnelle)
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  />
                </div>
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

export default ProjectsManagement;