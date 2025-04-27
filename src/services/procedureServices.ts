// src/services/procedureServices.ts
import config from '../config/config';
import authServices from './authServices';

interface ProcedureData {
  title: string;
  description: string;
  icon?: string;
  requiredDocs: string[];
  processingTime: number;
  category: string;
  onlineUrl?: string;
}

class ProcedureServices {
  private API_URL: string;

  constructor() {
    // Remplacer l'URL codée en dur par celle de la configuration
    this.API_URL = `${config.API_URL}/procedures`;
    console.log('ProcedureServices initialisé avec URL:', this.API_URL);
  }
  // Récupérer les en-têtes avec authentification si nécessaire
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    const token = authServices.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Récupérer toutes les démarches administratives
  async getAllProcedures() {
    try {
      console.log('Récupération de toutes les démarches administratives');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur lors de la récupération des démarches:', error);
        throw new Error(error.message || 'Erreur lors de la récupération des démarches');
      }
      
      const data = await response.json();
      console.log('Démarches récupérées:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des démarches:', error);
      throw error;
    }
  }

  // Récupérer les démarches par catégorie
  async getProceduresByCategory(category: string) {
    try {
      console.log(`Récupération des démarches de la catégorie: ${category}`);
      
      const response = await fetch(`${this.API_URL}/category/${category}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la récupération des démarches de la catégorie ${category}:`, error);
        throw new Error(error.message || `Erreur lors de la récupération des démarches de la catégorie ${category}`);
      }
      
      const data = await response.json();
      console.log(`Démarches de la catégorie ${category} récupérées:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des démarches de la catégorie ${category}:`, error);
      throw error;
    }
  }

  // Récupérer une démarche par son ID
  async getProcedureById(id: number) {
    try {
      console.log(`Récupération de la démarche avec l'ID: ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la récupération de la démarche ${id}:`, error);
        throw new Error(error.message || `Erreur lors de la récupération de la démarche ${id}`);
      }
      
      const data = await response.json();
      console.log(`Démarche ${id} récupérée:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la démarche ${id}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle démarche administrative
  async createProcedure(procedureData: ProcedureData) {
    try {
      console.log('Création d\'une nouvelle démarche administrative:', procedureData);
      
      // Si requiredDocs est un tableau, on le laisse tel quel, sinon on le transforme en tableau
      const dataToSend = {
        ...procedureData,
        requiredDocs: Array.isArray(procedureData.requiredDocs) 
          ? procedureData.requiredDocs 
          : [procedureData.requiredDocs]
      };
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur lors de la création de la démarche:', error);
        throw new Error(error.message || 'Erreur lors de la création de la démarche');
      }
      
      const data = await response.json();
      console.log('Démarche créée avec succès:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la démarche:', error);
      throw error;
    }
  }

  // Mettre à jour une démarche administrative
  async updateProcedure(id: number, procedureData: ProcedureData) {
    try {
      console.log(`Mise à jour de la démarche ${id}:`, procedureData);
      
      // Si requiredDocs est un tableau, on le laisse tel quel, sinon on le transforme en tableau
      const dataToSend = {
        ...procedureData,
        requiredDocs: Array.isArray(procedureData.requiredDocs) 
          ? procedureData.requiredDocs 
          : [procedureData.requiredDocs]
      };
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la mise à jour de la démarche ${id}:`, error);
        throw new Error(error.message || `Erreur lors de la mise à jour de la démarche ${id}`);
      }
      
      const data = await response.json();
      console.log(`Démarche ${id} mise à jour avec succès:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la démarche ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une démarche administrative
  async deleteProcedure(id: number) {
    try {
      console.log(`Suppression de la démarche ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la suppression de la démarche ${id}:`, error);
        throw new Error(error.message || `Erreur lors de la suppression de la démarche ${id}`);
      }
      
      const data = await response.json();
      console.log(`Démarche ${id} supprimée avec succès:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la démarche ${id}:`, error);
      throw error;
    }
  }
}

export default new ProcedureServices();