import HeroOverlay from "@/components/HeroOverlay";
import ThemeToggle from "@/components/ThemeToggle";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import GrainTexture from "@/components/GrainTexture";
import SoundToggle from "@/components/SoundToggle";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-[var(--background)]" />

      {/* Particle Background */}
      <ParticleBackground />

      {/* Grain Texture Overlay */}
      <GrainTexture />

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Sound Toggle */}
      <SoundToggle />

      {/* The 2D Overlay */}
      <HeroOverlay />

      {/* Contact Section */}
      <ContactSection
        linkedinUrl="https://www.linkedin.com/in/shadabriyaztango/"
      />
    </main>
  );
}
