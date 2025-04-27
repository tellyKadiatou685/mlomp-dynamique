// src/components/admin/InvestmentsManagement.tsx
import { useState, useEffect, useRef } from "react";
import { Loader2, Edit, Trash2, Plus, X, Check, Upload, Calendar, DollarSign } from "lucide-react";
import investmentServices from "@/services/investmentServices";
import config from "@/config/config"; 

interface Investment {
  id: number;
  title: string;
  category: string;
  description: string;
  shortDescription: string | null;
  amount: string;
  startYear: string | null;
  endYear: string | null;
  status: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  managerId: number | null;
  manager: {
    id: number;
    username: string;
  } | null;
}

const InvestmentsManagement = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState("hidden"); // hidden, add, edit
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  
  // États du formulaire
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les investissements
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentServices.getAllInvestments();
      console.log("Investissements récupérés:", data);
      setInvestments(data);
    } catch (error) {
      console.error("Erreur lors du chargement des investissements:", error);
      alert("Impossible de charger les investissements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Gestion du formulaire
  const openAddForm = () => {
    resetForm();
    setFormMode("add");
  };

  const openEditForm = (investment: Investment) => {
    setSelectedInvestment(investment);
    setTitle(investment.title);
    setCategory(investment.category);
    setDescription(investment.description);
    setShortDescription(investment.shortDescription || "");
    setAmount(investment.amount);
    setStartYear(investment.startYear || "");
    setEndYear(investment.endYear || "");
    setStatus(investment.status);
    
    // Utiliser directement l'URL Cloudinary
    setImagePreview(investment.image);
    
    setFormMode("edit");
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDescription("");
    setShortDescription("");
    setAmount("");
    setStartYear("");
    setEndYear("");
    setStatus("En recherche de partenaires");
    setImage(null);
    setImagePreview(null);
    setSelectedInvestment(null);
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
    
    if (!title || !category || !description || !amount || !status) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const investmentData = {
        title,
        category,
        description,
        shortDescription: shortDescription || undefined,
        amount,
        startYear: startYear || undefined,
        endYear: endYear || undefined,
        status
      };
      
      if (formMode === "add") {
        await investmentServices.createInvestment(investmentData, image);
      } else if (formMode === "edit" && selectedInvestment) {
        await investmentServices.updateInvestment(selectedInvestment.id, investmentData, image);
      }
      
      await fetchInvestments();
      closeForm();
      alert(formMode === "add" ? "Investissement ajouté avec succès" : "Investissement mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (investmentId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet investissement ?")) {
      return;
    }
    
    try {
      await investmentServices.deleteInvestment(investmentId);
      await fetchInvestments();
      alert("Investissement supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  // Fonction pour afficher le statut avec une couleur
  const getStatusBadge = (status: string) => {
    let color = "";
    
    switch (status.toLowerCase()) {
      case "en recherche de partenaires":
        color = "bg-blue-100 text-blue-800";
        break;
      case "études préliminaires":
        color = "bg-yellow-100 text-yellow-800";
        break;
      case "recherche d'investisseurs":
        color = "bg-purple-100 text-purple-800";
        break;
      case "en cours":
        color = "bg-green-100 text-green-800";
        break;
      case "terminé":
        color = "bg-gray-100 text-gray-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-mlomp-green">Gestion des investissements</h2>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-mlomp-green text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus size={16} />
          Ajouter un investissement
        </button>
      </div>
      
      {/* Liste des investissements */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucun investissement trouvé
                  </td>
                </tr>
              ) : (
                investments.map((investment) => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {investment.image && (
                          <img 
                            src={investment.image} 
                            alt={investment.title}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                            onError={(e) => {
                              // Image de secours si le chargement échoue
                              e.currentTarget.src = "/path/to/default-investment-image.jpg";
                            }}
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">{investment.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.amount} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {investment.startYear}{investment.endYear ? ` - ${investment.endYear}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(investment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditForm(investment)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(investment.id)}
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
                {formMode === "add" ? "Ajouter un investissement" : "Modifier l'investissement"}
              </h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Le reste du formulaire reste identique */}
              {/* ... (copier le reste du code du formulaire) ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsManagement;