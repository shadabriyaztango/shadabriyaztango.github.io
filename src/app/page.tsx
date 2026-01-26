"use client";

import HeroOverlay from "@/components/HeroOverlay";
import ThemeToggle from "@/components/ThemeToggle";
import ContactSection from "@/components/ContactSection";
import GrainTexture from "@/components/GrainTexture";

export default function Home() {
  return (
    <main className="min-h-screen relative font-sans">
      {/* Background */}
      <div className="fixed inset-0 bg-[var(--background)] z-0 transition-colors duration-1000" />

      {/* Grain Texture Overlay */}
      <GrainTexture />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* The 2D Overlay */}
      <HeroOverlay />

      {/* Contact Section */}
      <ContactSection
        linkedinUrl="https://www.linkedin.com/in/shadabriyaztango/"
        email="tangoshadabriyaz@gmail.com"
        githubUrl="https://github.com/shadabriyaztango"
      />
    </main>
  );
}
