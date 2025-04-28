// src/config/config.ts

// Vérifiez comment votre environnement est défini
const ENV = (import.meta.env?.MODE as string) || process.env.NODE_ENV || 'development';

interface Config {
  API_URL: string;
  ENV: string;
}

const configs: Record<string, Config> = {
  development: {
    API_URL: 'https://backendmlop-1.onrender.com/api', // Utilisez directement l'URL de Render
    ENV: 'development'
  },
  production: {
    API_URL: 'https://backendmlop-1.onrender.com/api',
    ENV: 'production'
  }
};

// Ajout d'une valeur par défaut plus explicite
const config: Config = configs[ENV] || {
  API_URL: 'https://backendmlop-1.onrender.com/api',
  ENV: 'development'
};

export default config;