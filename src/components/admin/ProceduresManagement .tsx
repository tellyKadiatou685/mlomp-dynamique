// src/components/admin/ProceduresManagement.tsx
import { useState, useEffect } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, FileText, Clock } from "lucide-react";
import procedureServices from "@/services/procedureServices";

interface Procedure {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  requiredDocs: string;
  processingTime: number;
  category: string;
  onlineUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const ProceduresManagement = () => {
  const [proceduresList, setProceduresList] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  
  // Formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [requiredDocs, setRequiredDocs] = useState<string[]>([""]);
  const [processingTime, setProcessingTime] = useState<number>(1);
  const [category, setCategory] = useState<string>("ETAT_CIVIL");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Charger les démarches
  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const procedures = await procedureServices.getAllProcedures();
      setProceduresList(procedures);
    } catch (error) {
      console.error("Erreur lors du chargement des démarches:", error);
      alert("Impossible de charger les démarches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setTitle(procedure.title);
    setDescription(procedure.description);
    setIcon(procedure.icon || "");
    
    // Parser les documents requis (qui sont stockés en JSON)
    let docs: string[] = [];
    try {
      docs = JSON.parse(procedure.requiredDocs);
    } catch (error) {
      // Si la chaîne n'est pas du JSON valide, on la considère comme un seul document
      docs = [procedure.requiredDocs];
    }
    setRequiredDocs(docs);
    
    setProcessingTime(procedure.processingTime);
    setCategory(procedure.category);
    setOnlineUrl(procedure.onlineUrl || "");
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIcon("");
    setRequiredDocs([""]);
    setProcessingTime(1);
    setCategory("ETAT_CIVIL");
    setOnlineUrl("");
    setSelectedProcedure(null);
  };

  const closeForm = () => {
    setFormMode("hidden");
    resetForm();
  };

  // Gestion des champs de documents requis
  const handleRequiredDocChange = (index: number, value: string) => {
    const newRequiredDocs = [...requiredDocs];
    newRequiredDocs[index] = value;
    setRequiredDocs(newRequiredDocs);
  };

  const addRequiredDoc = () => {
    setRequiredDocs([...requiredDocs, ""]);
  };

  const removeRequiredDoc = (index: number) => {
    if (requiredDocs.length > 1) {
      const newRequiredDocs = [...requiredDocs];
      newRequiredDocs.splice(index, 1);
      setRequiredDocs(newRequiredDocs);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      alert("Le titre, la description et la catégorie sont requis");
      return;
    }

    // Filtrer les documents vides
    const filteredDocs = requiredDocs.filter(doc => doc.trim() !== "");
    if (filteredDocs.length === 0) {
      alert("Au moins un document requis doit être spécifié");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const procedureData = {
        title,
        description,
        icon: icon || undefined,
        requiredDocs: filteredDocs,
        processingTime,
        category,
        onlineUrl: onlineUrl || undefined
      };
      
      if (formMode === "add") {
        await procedureServices.createProcedure(procedureData);
      } else if (formMode === "edit" && selectedProcedure) {
        await procedureServices.updateProcedure(selectedProcedure.id, procedureData);
      }
      
      await fetchProcedures();
      closeForm();
      alert(formMode === "add" ? "Démarche ajoutée avec succès" : "Démarche mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (procedureId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette démarche ?")) {
      return;
    }
    
    try {
      await procedureServices.deleteProcedure(procedureId);
      await fetchProcedures();
      alert("Démarche supprimée avec succès");
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
      case "ETAT_CIVIL":
        color = "bg-blue-100 text-blue-800";
        text = "État civil";
        break;
      case "IDENTITE":
        color = "bg-purple-100 text-purple-800";
        text = "Identité";
        break;
      case "ATTESTATIONS":
        color = "bg-green-100 text-green-800";
        text = "Attestations";
        break;
      case "URBANISME":
        color = "bg-yellow-100 text-yellow-800";
        text = "Urbanisme";
        break;
      case "SOCIAL":
        color = "bg-red-100 text-red-800";
        text = "Social";
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

  // Fonction pour afficher le délai de traitement
  const getProcessingTimeBadge = (days: number) => {
    let color = "";
    
    if (days <= 1) {
      color = "bg-green-100 text-green-800";
    } else if (days <= 7) {
      color = "bg-yellow-100 text-yellow-800";
    } else {
      color = "bg-red-100 text-red-800";
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {days} {days === 1 ? "jour" : "jours"}
      </span>
    );
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion des démarches administratives</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter une démarche
        </button>
      </div>
      
      {/* Liste des démarches */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Délai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proceduresList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucune démarche trouvée
                  </td>
                </tr>
              ) : (
                proceduresList.map((procedure) => (
                  <tr key={procedure.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{procedure.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCategoryBadge(procedure.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getProcessingTimeBadge(procedure.processingTime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {(() => {
                          try {
                            const docs = JSON.parse(procedure.requiredDocs);
                            return Array.isArray(docs) ? (
                              docs.map((doc, index) => (
                                <div key={index} className="text-sm text-gray-500 flex items-center">
                                  <FileText size={14} className="mr-1" /> {doc}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 flex items-center">
                                <FileText size={14} className="mr-1" /> {docs.toString()}
                              </div>
                            );
                          } catch (e) {
                            return (
                              <div className="text-sm text-gray-500 flex items-center">
                                <FileText size={14} className="mr-1" /> {procedure.requiredDocs}
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(procedure)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(procedure.id)}
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
                {formMode === "add" ? "Ajouter une démarche" : "Modifier la démarche"}
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
                  placeholder="Titre de la démarche"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description courte de la démarche"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                    required
                  >
                    <option value="ETAT_CIVIL">État civil</option>
                    <option value="IDENTITE">Identité</option>
                    <option value="ATTESTATIONS">Attestations</option>
                    <option value="URBANISME">Urbanisme</option>
                    <option value="SOCIAL">Social</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                    Icône (nom)
                  </label>
                  <input
                    id="icon"
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Nom de l'icône (ex: document, id-card)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de traitement (jours)
                  </label>
                  <div className="flex items-center">
                    <input
                      id="processingTime"
                      type="number"
                      min="1"
                      value={processingTime}
                      onChange={(e) => setProcessingTime(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                      required
                    />
                    <Clock size={20} className="ml-2 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="onlineUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de demande en ligne
                  </label>
                  <input
                    id="onlineUrl"
                    type="text"
                    value={onlineUrl}
                    onChange={(e) => setOnlineUrl(e.target.value)}
                    placeholder="/demarches/acte-naissance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documents requis
                </label>
                <div className="space-y-2">
                  {requiredDocs.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => handleRequiredDocChange(index, e.target.value)}
                        placeholder="Document requis"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mlomp-green"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequiredDoc(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        title="Supprimer ce document"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequiredDoc}
                    className="inline-flex items-center text-sm text-mlomp-green hover:text-green-700"
                  >
                    <Plus size={16} className="mr-1" /> Ajouter un document
                  </button>
                </div>
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

export default ProceduresManagement;