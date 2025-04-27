// src/services/authService.ts

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}
import config from '../config/config';
interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterResponse {
  message: string;
  token?: string;
  user?: User;
}

/**
 * Service d'authentification pour gérer les interactions avec l'API backend
 */
class AuthService {
    private API_URL: string;
    public token: string | null;

 

    constructor() {
      // Utiliser l'URL depuis la configuration
      this.API_URL = config.API_URL;
      
      // Récupérer le token du stockage local s'il existe
      this.token = localStorage.getItem('token');
      
      console.log('Service initialisé avec API_URL:', this.API_URL);
    }
  
    /**
     * Configure les en-têtes pour les requêtes API
     * @returns {Object} En-têtes HTTP avec ou sans token d'authentification
     */
    getHeaders(): Record<string, string> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
  
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
  
      return headers;
    }
  
    /**
     * Enregistre un nouvel utilisateur
     * @param {Object} userData - Données d'inscription (email, password, username)
     * @returns {Promise} Promesse résolue avec les données de l'utilisateur ou rejetée avec une erreur
     */
    async register(userData: { email: string; password: string; username: string }): Promise<RegisterResponse> {
      console.log('Tentative d\'inscription avec:', { ...userData, password: '***' });
      
      try {
        const response = await fetch(`${this.API_URL}/auth/register`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(userData)
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Erreur lors de l\'inscription:', data);
          throw new Error(data.message || 'Erreur lors de l\'inscription');
        }
        
        console.log('Inscription réussie:', data);
        
        // Enregistrer le token dans le stockage local et dans le service
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.token = data.token;
        }
        
        return data;
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
      }
    }
  
    /**
     * Connecte un utilisateur
     * @param {Object} credentials - Identifiants de connexion (email, password)
     * @returns {Promise} Promesse résolue avec les données de l'utilisateur ou rejetée avec une erreur
     */
    async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
      console.log('Tentative de connexion avec:', { ...credentials, password: '***' });
      
      try {
        const response = await fetch(`${this.API_URL}/auth/login`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(credentials)
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Erreur lors de la connexion:', data);
          throw new Error(data.message || 'Erreur lors de la connexion');
        }
        
        console.log('Connexion réussie:', data);
        
        // Enregistrer le token dans le stockage local et dans le service
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.token = data.token;
        }
        
        // Enregistrer les informations de l'utilisateur
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        return data;
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
      }
    }
  
    /**
     * Déconnecte l'utilisateur
     */
    logout(): void {
      console.log('Déconnexion de l\'utilisateur');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.token = null;
    }
  
    /**
     * Vérifie si l'utilisateur est authentifié
     * @returns {boolean} True si l'utilisateur est authentifié, sinon false
     */
    isAuthenticated(): boolean {
      return !!this.token;
    }
  
    /**
     * Récupère les informations de l'utilisateur connecté
     * @returns {Object|null} Informations de l'utilisateur ou null si non connecté
     */
    getCurrentUser(): User | null {
      try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        return null;
      }
    }
  
    /**
     * Vérifie si le token est toujours valide en interrogeant le backend
     * @returns {Promise<boolean>} Promesse résolue avec true si le token est valide, sinon false
     */
    async verifyToken(): Promise<boolean> {
      if (!this.token) {
        console.log('Aucun token à vérifier');
        return false;
      }
      
      try {
        console.log('Vérification de la validité du token');
        
        const response = await fetch(`${this.API_URL}/auth/profile`, {
          method: 'GET',
          headers: this.getHeaders()
        });
        
        if (!response.ok) {
          console.warn('Token invalide ou expiré');
          this.logout();
          return false;
        }
        
        console.log('Token valide');
        return true;
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        this.logout();
        return false;
      }
    }
}
  
// Exporter une instance unique du service
export default new AuthService();