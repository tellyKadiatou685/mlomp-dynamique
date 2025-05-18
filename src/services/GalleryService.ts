// src/services/galleryService.ts
import config from '../config/config';
import authServices from './authServices';

// Interface pour les données de galerie
interface GalleryItem {
  id?: string;
  title: string;
  mediaUrl?: string;
  type?: string;
  publicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Classe d'erreur personnalisée pour une gestion plus informative des erreurs
class GalleryError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GalleryError';
  }
}

class GalleryService {
  private API_URL: string;

  constructor() {
    // Utiliser l'URL de base de la configuration et ajouter le chemin spécifique
    this.API_URL = `${config.API_URL}/gallery`;
    console.log('GalleryService initialized with URL:', this.API_URL);
  }

  // Obtenir les headers avec authentification si nécessaire
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
      
      throw new GalleryError(
        typeof errorData === 'object' && errorData.message 
          ? errorData.message 
          : 'Une erreur inattendue est survenue', 
        response.status
      );
    }
    return response.json();
  }

  // Récupérer tous les éléments de la galerie
  async getAllGalleryItems(): Promise<GalleryItem[]> {
    try {
      console.log('Fetching all gallery items');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<GalleryItem[]>(response);
      console.log('Gallery items retrieved:', data);
      return data;
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }
  }

  // Récupérer un élément de galerie par ID
  async getGalleryItemById(id: string): Promise<GalleryItem> {
    try {
      console.log(`Fetching gallery item with ID: ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<GalleryItem>(response);
      console.log(`Gallery item ${id} retrieved:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching gallery item ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouvel élément de galerie
  async createGalleryItem(title: string, mediaFile: File): Promise<GalleryItem> {
    try {
      console.log('Creating new gallery item:', { title });
      
      // Utiliser FormData pour l'upload de fichier
      const formData = new FormData();
      
      // Ajouter le titre
      formData.append('title', title);
      
      // Ajouter le fichier média
      formData.append('mediaUrl', mediaFile);
      
      console.log('FormData prepared with file:', mediaFile.name);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: formData
      });
      
      const data = await this.handleResponse<GalleryItem>(response);
      console.log('Gallery item created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  }

  // Mettre à jour un élément de galerie
  async updateGalleryItem(id: string, title: string, mediaFile?: File): Promise<GalleryItem> {
    try {
      console.log(`Updating gallery item ${id}:`, { title });
      
      const formData = new FormData();
      
      // Ajouter le titre
      formData.append('title', title);
      
      // Ajouter le fichier média si fourni
      if (mediaFile) {
        formData.append('mediaUrl', mediaFile);
        console.log('FormData prepared with file:', mediaFile.name);
      } else {
        console.log('Updating without new media file');
      }
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: formData
      });
      
      const data = await this.handleResponse<GalleryItem>(response);
      console.log(`Gallery item ${id} updated successfully:`, data);
      return data;
    } catch (error) {
      console.error(`Error updating gallery item ${id}:`, error);
      throw error;
    }
  }

  // Supprimer un élément de galerie
  async deleteGalleryItem(id: string): Promise<void> {
    try {
      console.log(`Deleting gallery item ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      await this.handleResponse<void>(response);
      console.log(`Gallery item ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting gallery item ${id}:`, error);
      throw error;
    }
  }
}

export default new GalleryService();