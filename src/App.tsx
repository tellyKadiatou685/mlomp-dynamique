import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async"; // Importer Helmet ici
import Index from "./pages/Index";
import Presentation from "./pages/Presentation";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import News from "./pages/News";
import CitizenSpace from "./pages/CitizenSpace";
import Investment from "./pages/Investment";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import Welcome from "./components/home/Welcome";
import AdminPage from "./pages/AdminPage";
import AdminPage1 from "./pages/AdminPage1";
import AdminPage2 from "./pages/AdminPage2 ";
import AdminPage3 from "./pages/AdminPage3";
import AdminPage4 from "./pages/AdminPage4";

import NewsDetails from "./pages/NewsDetail";



// Create a new query client
const queryClient = new QueryClient();

// Add console logging for debugging
console.log("App component initialized");

const App = () => {
  return (
    <HelmetProvider>
      {/* Ajoute la balise meta ici */}
      <Helmet>
        <meta name="google-site-verification" content="hyV_KlbiuFNm8CUGd8TOg9pu9uj3XSmsFcy5R52MXQI" />
      </Helmet>

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/presentation" element={<Presentation />} />
              <Route path="/projets" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/actualites" element={<News />} />
              <Route path="/espace-citoyen" element={<CitizenSpace />} />
              <Route path="/investissements" element={<Investment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/admin/news" element={<AdminPage />} />
              <Route path="/actualites/:id" element={<NewsDetails />} />
              <Route path="/admin/projects" element={<AdminPage1 />} />
              <Route path="/admin/services" element={<AdminPage2 />} />
        
              <Route path="/admin/procedures" element={<AdminPage3 />} />
              <Route path="/admin/investissements" element={<AdminPage4 />} />


              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
