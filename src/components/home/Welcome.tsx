// src/components/home/Welcome.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authServices from "../../services/authServices.js"; // Chemin relatif au lieu de @/services
import { LogOut } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Welcome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Vérifier l'état de l'authentification au chargement du composant
    const checkAuthStatus = async () => {
      try {
        // Vérifier si le token est valide
        const isAuthenticated = await authServices.verifyToken();
        
        if (isAuthenticated) {
          // Récupérer les informations de l'utilisateur
          const userData = authServices.getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    authServices.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mlomp-green"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto mt-8">
      {user ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-mlomp-green">
              Bonjour, {user.email} !
            </h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
          
          <p className="text-gray-700 mb-4">
            Bienvenue dans l'espace d'administration du site de la commune de Mlomp.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-semibold text-lg mb-2">Panel d'administration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link
                to="/admin/services"
                className="bg-mlomp-green hover:bg-mlomp-green-dark text-white p-4 rounded-md text-center transition-colors"
              >
                Gérer les services
              </Link>
              <Link to="/admin/news" className="bg-mlomp-green hover:bg-mlomp-green-dark text-white p-4 rounded-md text-center transition-colors">
                Gérer les actualités
              </Link>
              <Link
                to="/admin/projects"
                className="bg-mlomp-green hover:bg-mlomp-green-dark text-white p-4 rounded-md text-center transition-colors"
              >
                Gérer les projets
              </Link>
              
              <Link
                to="/admin/gallery"
                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-md text-center transition-colors"
              >
                Ma Galerie
              </Link>
              <Link
                to="/admin/procedures"
                className="bg-mlomp-green hover:bg-mlomp-green-dark text-white p-4 rounded-md text-center transition-colors"
              >
                Gérer les procédures
              </Link>
              <Link
                to="/admin/investissements"
                className="bg-mlomp-green hover:bg-mlomp-green-dark text-white p-4 rounded-md text-center transition-colors"
                
              >
              Gérer les investissements
              </Link>
              
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-mlomp-green mb-4">
            Bienvenue sur le site de la commune de Mlomp
          </h2>
          <p className="text-gray-700 mb-6">
            Vous n'êtes pas connecté. Pour accéder à l'espace d'administration, veuillez vous connecter.
          </p>
          <Link
            to="/login"
            className="bg-mlomp-green hover:bg-mlomp-green-dark text-white px-6 py-2 rounded-md inline-block transition-colors"
          >
            Se connecter
          </Link>
        </div>
      )}
    </div>
  );
};

export default Welcome;