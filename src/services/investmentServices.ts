// src/services/investmentServices.ts
import config from '../config/config';
import authServices from './authServices';

// Interface mise à jour avec des types plus précis
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

// Classe d'erreur personnalisée pour une gestion d'erreur plus informative
class InvestmentError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'InvestmentError';
  }
}

class InvestmentServices {
  private API_URL: string;

  constructor() {
    // Utiliser l'URL de base de la configuration
    this.API_URL = `${config.API_URL}/investments`;
    console.log('InvestmentServices initialisé avec URL:', this.API_URL);
  }

  // Récupérer les en-têtes avec authentification si nécessaire
  private getHeaders(isFormData = false): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const token = authServices.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Méthode centralisée de gestion des réponses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: { message?: string } | string;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      throw new InvestmentError(
        typeof errorData === 'object' && errorData.message 
          ? errorData.message 
          : 'Une erreur inattendue est survenue', 
        response.status
      );
    }
    return response.json();
  }

  // Récupérer tous les investissements
  async getAllInvestments(): Promise<Investment[]> {
    try {
      console.log('Récupération de tous les investissements');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<Investment[]>(response);
      console.log('Investissements récupérés:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des investissements:', error);
      throw error;
    }
  }

  // Créer un nouvel investissement
  async createInvestment(investmentData: Partial<Investment>, imageFile: File | null = null): Promise<Investment> {
    try {
      console.log('Création d\'un nouvel investissement:', investmentData);
      
      // Si une image est fournie, utiliser FormData
      if (imageFile) {
        console.log('Image fournie, utilisation de FormData');
        
        const formData = new FormData();
        
        // Ajouter les données de l'investissement
        Object.entries(investmentData).forEach(([key, value]) => {
          if (value !== undefined && key !== 'image') {
            formData.append(key, value.toString());
          }
        });
        
        // Ajouter l'image
        formData.append('image', imageFile);
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: formData
        });
        
        const data = await this.handleResponse<Investment>(response);
        console.log('Investissement créé avec succès:', data);
        return data;
      } else {
        // Sans image, utiliser JSON
        console.log('Pas d\'image, utilisation de JSON');
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(investmentData)
        });
        
        const data = await this.handleResponse<Investment>(response);
        console.log('Investissement créé avec succès:', data);
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'investissement:', error);
      throw error;
    }
  }

  // Mettre à jour un investissement
  async updateInvestment(id: number, investmentData: Partial<Investment>, imageFile: File | null = null): Promise<Investment> {
    try {
      console.log(`Mise à jour de l'investissement ${id}:`, investmentData);
      
      // Si une image est fournie, utiliser FormData
      if (imageFile) {
        console.log('Image fournie, utilisation de FormData');
        
        const formData = new FormData();
        
        // Ajouter les données de l'investissement
        Object.entries(investmentData).forEach(([key, value]) => {
          if (value !== undefined && key !== 'image') {
            formData.append(key, value.toString());
          }
        });
        
        // Ajouter l'image
        formData.append('image', imageFile);
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(true),
          body: formData
        });
        
        const data = await this.handleResponse<Investment>(response);
        console.log(`Investissement ${id} mis à jour avec succès:`, data);
        return data;
      } else {
        // Sans image, utiliser JSON
        console.log('Pas d\'image, utilisation de JSON');
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(investmentData)
        });
        
        const data = await this.handleResponse<Investment>(response);
        console.log(`Investissement ${id} mis à jour avec succès:`, data);
        return data;
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'investissement ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un investissement
  async deleteInvestment(id: number): Promise<void> {
    try {
      console.log(`Suppression de l'investissement ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      await this.handleResponse<void>(response);
      console.log(`Investissement ${id} supprimé avec succès`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'investissement ${id}:`, error);
      throw error;
    }
  }
}

export default new InvestmentServices();