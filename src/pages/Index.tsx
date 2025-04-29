
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import NewsSection from "@/components/home/NewsSection";
import CitizenSection from "@/components/home/CitizenSection";
import InvestmentSection from "@/components/home/InvestmentSection";
import ContactSection from "@/components/home/ContactSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const Index = () => {
  // Add debugging to check if component renders
  useEffect(() => {
    console.log("Index component mounted");
    // This will help us see if the component is mounting
  }, []);

  return (
    <>
     
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <NewsSection />
          <CitizenSection />
          <InvestmentSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
