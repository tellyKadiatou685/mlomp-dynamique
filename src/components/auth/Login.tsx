// src/components/auth/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Notez le 'a' minuscule dans le nom du fichier
import MlompLogo from "../common/MlompLogo.js";
import authServices from "@/services/authServices.js";

interface Credentials {
  email: string;
  password: string;
}

const Login = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: ""
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      await authServices.login(credentials);
      console.log("Connexion réussie");
      // Au lieu de rediriger vers la racine, redirigez vers la page Welcome
      navigate("/welcome"); // Changez ceci selon le chemin réel de votre composant Welcome
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError(error instanceof Error ? error.message : "Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <MlompLogo className="h-16 w-auto" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-mlomp-green">
            Administration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder à l'espace administrateur
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-mlomp-green focus:border-mlomp-green focus:z-10 sm:text-sm"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-mlomp-green focus:border-mlomp-green focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mlomp-green hover:bg-mlomp-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mlomp-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;