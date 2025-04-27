// src/services/projectServices.ts
import config from '../config/config';
import authServices from './authServices';

// Improved interface with more specific types
interface ProjectData {
  id?: number;
  title: string;
  description: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  startDate?: string;
  endDate?: string;
  budget?: number;
  imageUrl?: string;
}

// Custom error class for more informative error handling
class ProjectError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ProjectError';
  }
}

class ProjectServices {
  private API_URL: string;

  constructor() {
    // Use base URL from configuration and add specific path
    this.API_URL = `${config.API_URL}/projects`;
    console.log('ProjectServices initialized with URL:', this.API_URL);
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

  // Centralized error handling method
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: { message?: string } | string;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      throw new ProjectError(
        typeof errorData === 'object' && errorData.message 
          ? errorData.message 
          : 'An unexpected error occurred', 
        response.status
      );
    }
    return response.json();
  }

  // Get all projects
  async getAllProjects(): Promise<ProjectData[]> {
    try {
      console.log('Fetching all projects');
      
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<ProjectData[]>(response);
      console.log('Projects retrieved:', data);
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  // Get project by ID
  async getProjectById(id: number): Promise<ProjectData> {
    try {
      console.log(`Fetching project with ID: ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      const data = await this.handleResponse<ProjectData>(response);
      console.log(`Project ${id} retrieved:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }

  // Create a new project
  async createProject(projectData: ProjectData, imageFile: File | null = null): Promise<ProjectData> {
    try {
      console.log('Creating new project:', projectData);
      
      // If an image is provided, use FormData
      if (imageFile) {
        console.log('Image provided, using FormData');
        
        const formData = new FormData();
        
        // Add project data
        Object.entries(projectData).forEach(([key, value]) => {
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
        
        const data = await this.handleResponse<ProjectData>(response);
        console.log('Project created successfully:', data);
        return data;
      } else {
        // Without image, use JSON
        console.log('No image, using JSON');
        
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(projectData)
        });
        
        const data = await this.handleResponse<ProjectData>(response);
        console.log('Project created successfully:', data);
        return data;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Update a project
  async updateProject(id: number, projectData: ProjectData, imageFile: File | null = null): Promise<ProjectData> {
    try {
      console.log(`Updating project ${id}:`, projectData);
      
      // If an image is provided, use FormData
      if (imageFile) {
        console.log('Image provided, using FormData');
        
        const formData = new FormData();
        
        // Add project data
        Object.entries(projectData).forEach(([key, value]) => {
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
        
        const data = await this.handleResponse<ProjectData>(response);
        console.log(`Project ${id} updated successfully:`, data);
        return data;
      } else {
        // Without image, use JSON
        console.log('No image, using JSON');
        
        const response = await fetch(`${this.API_URL}/${id}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(projectData)
        });
        
        const data = await this.handleResponse<ProjectData>(response);
        console.log(`Project ${id} updated successfully:`, data);
        return data;
      }
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }

  // Delete a project
  async deleteProject(id: number): Promise<void> {
    try {
      console.log(`Deleting project ${id}`);
      
      const response = await fetch(`${this.API_URL}/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      await this.handleResponse<void>(response);
      console.log(`Project ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
}

export default new ProjectServices();