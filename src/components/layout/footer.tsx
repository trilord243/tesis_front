import Link from "next/link";
import Image from "next/image";

interface FooterLinkProps {
  readonly href: string;
  readonly children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link href={href} className="hover:text-brand-orange transition-colors">
      {children}
    </Link>
  );
}

function FooterLogo() {
  return (
    <div className="mb-6">
      <Image
        src="/centro-mundo-x-logo3.png"
        alt="Centro Mundo X"
        width={200}
        height={67}
        className="h-16 w-auto brightness-0 invert"
        priority
      />
      <p className="text-white/80 text-sm font-roboto mt-2">
        Sistema de Reservas
      </p>
    </div>
  );
}

function CompanyInfo() {
  return (
    <div>
      <FooterLogo />
      <p className="font-roboto text-white/80 leading-relaxed">
        Innovación y excelencia en cada reserva. Comprometidos con tu
        experiencia y el desarrollo sostenible.
      </p>
    </div>
  );
}

function ServicesSection() {
  return (
    <div>
      <h4 className="font-roboto font-bold text-lg mb-4">Servicios</h4>
      <ul className="space-y-2 font-roboto text-white/80">
        <li>
          <FooterLink href="#">Reservas Online</FooterLink>
        </li>
        <li>
          <FooterLink href="#">Gestión de Eventos</FooterLink>
        </li>
        <li>
          <FooterLink href="#">Soporte 24/7</FooterLink>
        </li>
        <li>
          <FooterLink href="#">API Integración</FooterLink>
        </li>
      </ul>
    </div>
  );
}

function CompanySection() {
  return (
    <div>
      <h4 className="font-roboto font-bold text-lg mb-4">Empresa</h4>
      <ul className="space-y-2 font-roboto text-white/80">
        <li>
          <FooterLink href="#">Sobre Nosotros</FooterLink>
        </li>
        <li>
          <FooterLink href="#">Nuestros Valores</FooterLink>
        </li>
        <li>
          <FooterLink href="#">Carreras</FooterLink>
        </li>
        <li>
          <FooterLink href="#">Contacto</FooterLink>
        </li>
      </ul>
    </div>
  );
}

function ContactSection() {
  return (
    <div>
      <h4 className="font-roboto font-bold text-lg mb-4">Contacto</h4>
      <div className="space-y-3 font-roboto text-white/80">
        <p>info@centromundox.com</p>
        <p>+1 (555) 123-4567</p>
        <p>
          Lunes - Viernes
          <br />
          9:00 AM - 6:00 PM
        </p>
      </div>
    </div>
  );
}

function Copyright() {
  return (
    <div className="border-t border-white/20 mt-12 pt-8 text-center">
      <p className="font-roboto text-white/60">
        © 2024 Centro Mundo X. Todos los derechos reservados. Diseñado siguiendo
        nuestro manual de marca corporativa.
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-secondary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <CompanyInfo />
          <ServicesSection />
          <CompanySection />
          <ContactSection />
        </div>
        <Copyright />
      </div>
    </footer>
  );
}
