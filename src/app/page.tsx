import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { ValuesSection } from "@/components/sections/values-section";
import { AboutSection } from "@/components/sections/about-section";
import { LabRulesSection } from "@/components/sections/lab-rules-section";
import { CTASection } from "@/components/sections/cta-section";

export default async function HomePage() {
  const authenticated = await isAuthenticated();
  const user = authenticated ? await getCurrentUser() : null;
  const isAdmin = user?.role === "admin";

  // Mostrar la landing page tanto para usuarios autenticados como no autenticados
  // Solo cambia el navbar según el estado de autenticación
  return (
    <>
      <Navbar
        isAuthenticated={authenticated}
        showAuthButtons={true}
        isAdmin={isAdmin}
      />
      <div className="min-h-screen bg-white" style={{ paddingTop: "80px" }}>
        <HeroSection />
        <ValuesSection />
        <AboutSection />
        <LabRulesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
