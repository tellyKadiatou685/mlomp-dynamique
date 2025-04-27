// src/services/newsServices.ts
import config from '../config/config';
import authServices from './authServices';

// Improved interface with more specific types
interface NewsData {
  id?: number;
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Custom error class for more informative error handling
class NewsError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NewsError';
  }
}

class NewsServices {
  private API_URL: string;

  constructor() {
    // Use base URL from configuration and add specific path
    this.API_URL = `${config.API_URL}/news`;
    console.log('NewsServices initialized with URL:', this.API_URL);
  }

  // Get headers with authentication if necessary
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

  // Centralized error handling method with generic type
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: { message?: string } | string;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      throw new NewsError(
        typeof errorData === 'object' && errorData.message 
          ? errorData.message 
          : 'An unexpected error occurred', 
        response.status
      );
    }
    return response.json();
  }

  // Get all news
  async getAllNews(): Promise<NewsData[]> {
    try {
      console.log('Fetching all news');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<NewsData[]>(response);
      console.log('News retrieved:', data);
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  // Get news by ID
  async getNewsById(id: number): Promise<NewsData> {
    try {
      console.log(`Fetching news with ID: ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<NewsData>(response);
      console.log(`News ${id} retrieved:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error);
      throw error;
    }
  }

  // Create a new news article
  async createNews(newsData: NewsData, imageFile: File | null = null): Promise<NewsData> {
    try {
      console.log('Creating new news:', newsData);
      
      // If an image is provided, use FormData
      if (imageFile) {
        console.log('Image provided, using FormData');
        
        const formData = new FormData();
        
        // Add news data
        Object.entries(newsData).forEach(([key, value]) => {
          if (value !== undefined && key !== 'imageUrl') {
            formData.append(key, value.toString());
          }
        });
        
        // Add image
        formData.append('image', imageFile);
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(true),
          body: formData
        });
        
        const data = await this.handleResponse<NewsData>(response);
        console.log('News created successfully:', data);
        return data;
      } else {
        // Without image, use JSON
        console.log('No image, using JSON');
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(newsData)
        });
        
        const data = await this.handleResponse<NewsData>(response);
        console.log('News created successfully:', data);
        return data;
      }
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }

  // Update a news article
  async updateNews(id: number, newsData: NewsData, imageFile: File | null = null): Promise<NewsData> {
    try {
      console.log(`Updating news ${id}:`, newsData);
      
      // If an image is provided, use FormData
      if (imageFile) {
        console.log('Image provided, using FormData');
        
        const formData = new FormData();
        
        // Add news data
        Object.entries(newsData).forEach(([key, value]) => {
          if (value !== undefined && key !== 'imageUrl') {
            formData.append(key, value.toString());
          }
        });
        
        // Add image
        formData.append('image', imageFile);
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(true),
          body: formData
        });
        
        const data = await this.handleResponse<NewsData>(response);
        console.log(`News ${id} updated successfully:`, data);
        return data;
      } else {
        // Without image, use JSON
        console.log('No image, using JSON');
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(newsData)
        });
        
        const data = await this.handleResponse<NewsData>(response);
        console.log(`News ${id} updated successfully:`, data);
        return data;
      }
    } catch (error) {
      console.error(`Error updating news ${id}:`, error);
      throw error;
    }
  }

  // Delete a news article
  async deleteNews(id: number): Promise<void> {
    try {
      console.log(`Deleting news ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      await this.handleResponse<void>(response);
      console.log(`News ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting news ${id}:`, error);
      throw error;
    }
  }
}

export default new NewsServices();