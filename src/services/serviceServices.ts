// src/services/serviceServices.ts
import config from '../config/config';
import authServices from './authServices';

interface ServiceData {
  title: string;
  description: string;
  category: 'EDUCATION' | 'SANTE' | 'INFRASTRUCTURES';
  icon?: string;
}

class ServiceServices {
  private API_URL: string;

  constructor() {
    // Utiliser l'URL de base de la configuration et ajouter le chemin spécifique
    this.API_URL = `${config.API_URL}/services`;
    console.log('ServiceServices initialisé avec URL:', this.API_URL);
  }

  // Récupérer les en-têtes avec authentification si nécessaire
  private getHeaders(isFormData = false) {
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

  // Récupérer tous les services
  async getAllServices() {
    try {
      console.log('Récupération de tous les services');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur lors de la récupération des services:', error);
        throw new Error(error.message || 'Erreur lors de la récupération des services');
      }
      
      const data = await response.json();
      console.log('Services récupérés:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error);
      throw error;
    }
  }

  // Récupérer les services par catégorie
  async getServicesByCategory(category: string) {
    try {
      console.log(`Récupération des services de la catégorie: ${category}`);
      
      const response = await fetch(`${this.API_URL}/category/${category}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la récupération des services de la catégorie ${category}:`, error);
        throw new Error(error.message || `Erreur lors de la récupération des services de la catégorie ${category}`);
      }
      
      const data = await response.json();
      console.log(`Services de la catégorie ${category} récupérés:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des services de la catégorie ${category}:`, error);
      throw error;
    }
  }

  // Récupérer un service par son ID
  async getServiceById(id: number) {
    try {
      console.log(`Récupération du service avec l'ID: ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la récupération du service ${id}:`, error);
        throw new Error(error.message || `Erreur lors de la récupération du service ${id}`);
      }
      
      const data = await response.json();
      console.log(`Service ${id} récupéré:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du service ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau service
  async createService(serviceData: ServiceData, imageFile: File | null = null) {
    try {
      console.log('Création d\'un nouveau service:', serviceData);
      
      // Si une image est fournie, utiliser FormData
      if (imageFile) {
        console.log('Image fournie, utilisation de FormData');
        
        const formData = new FormData();
        
        // Ajouter les données du service
        Object.entries(serviceData).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        
        // Ajouter l'image - utiliser 'image' comme nom de champ pour Cloudinary
        formData.append('image', imageFile);
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Erreur lors de la création du service:', error);
          throw new Error(error.message || 'Erreur lors de la création du service');
        }
        
        const data = await response.json();
        console.log('Service créé avec succès:', data);
        return data;
      } else {
        // Sans image, utiliser JSON
        console.log('Pas d\'image, utilisation de JSON');
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(serviceData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Erreur lors de la création du service:', error);
          throw new Error(error.message || 'Erreur lors de la création du service');
        }
        
        const data = await response.json();
        console.log('Service créé avec succès:', data);
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la création du service:', error);
      throw error;
    }
  }

  // Mettre à jour un service
  async updateService(id: number, serviceData: ServiceData, imageFile: File | null = null) {
    try {
      console.log(`Mise à jour du service ${id}:`, serviceData);
      
      // Si une image est fournie, utiliser FormData
      if (imageFile) {
        console.log('Image fournie, utilisation de FormData');
        
        const formData = new FormData();
        
        // Ajouter les données du service
        Object.entries(serviceData).forEach(([key, value]) => {
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        });
        
        // Ajouter l'image - utiliser 'image' comme nom de champ pour Cloudinary
        formData.append('image', imageFile);
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(true),
          body: formData
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
          throw new Error(error.message || `Erreur lors de la mise à jour du service ${id}`);
        }
        
        const data = await response.json();
        console.log(`Service ${id} mis à jour avec succès:`, data);
        return data;
      } else {
        // Sans image, utiliser JSON
        console.log('Pas d\'image, utilisation de JSON');
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(serviceData)
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
          throw new Error(error.message || `Erreur lors de la mise à jour du service ${id}`);
        }
        
        const data = await response.json();
        console.log(`Service ${id} mis à jour avec succès:`, data);
        return data;
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un service
  async deleteService(id: number) {
    try {
      console.log(`Suppression du service ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error(`Erreur lors de la suppression du service ${id}:`, error);
        throw new Error(error.message || `Erreur lors de la suppression du service ${id}`);
      }
      
      const data = await response.json();
      console.log(`Service ${id} supprimé avec succès:`, data);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du service ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceServices();