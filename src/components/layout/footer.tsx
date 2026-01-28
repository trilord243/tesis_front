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
        Laboratorio Experimental del Metaverso. Fomentando la innovación,
        el aprendizaje y la colaboración en tecnologías inmersivas.
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
          <FooterLink href="/dashboard/reservar-lab">Reserva de Laboratorio</FooterLink>
        </li>
        <li>
          <FooterLink href="/laboratorio">Laboratorio Metaverso</FooterLink>
        </li>
        <li>
          <FooterLink href="/dashboard/reservas">Equipos VR/AR</FooterLink>
        </li>
        <li>
          <FooterLink href="/demo-reserva">Tutoriales</FooterLink>
        </li>
      </ul>
    </div>
  );
}

function CompanySection() {
  return (
    <div>
      <h4 className="font-roboto font-bold text-lg mb-4">Universidad</h4>
      <ul className="space-y-2 font-roboto text-white/80">
        <li>
          <a
            href="https://www.unimet.edu.ve"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-orange transition-colors"
          >
            Universidad Metropolitana
          </a>
        </li>
        <li>
          <FooterLink href="/#about">Sobre Centro Mundo X</FooterLink>
        </li>
        <li>
          <FooterLink href="/#normas">Normas del Laboratorio</FooterLink>
        </li>
        <li>
          <FooterLink href="/auth/register">Registrarse</FooterLink>
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
        <div>
          <p className="text-xs text-white/60 mb-1">Jefe de Dpto.:</p>
          <a
            href="mailto:cguillen@unimet.edu.ve"
            className="hover:text-brand-orange transition-colors"
          >
            cguillen@unimet.edu.ve
          </a>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-1">Asistente:</p>
          <a
            href="mailto:cmorantes@unimet.edu.ve"
            className="hover:text-brand-orange transition-colors"
          >
            cmorantes@unimet.edu.ve
          </a>
        </div>
        <p>
          Lunes - Viernes
          <br />
          7:00 AM - 5:30 PM
        </p>
      </div>
    </div>
  );
}

function Copyright() {
  return (
    <div className="border-t border-white/20 mt-12 pt-8 text-center">
      <p className="font-roboto text-white/60">
        © {new Date().getFullYear()} Centro Mundo X - Universidad Metropolitana.
        Dpto. de Gestión de Proyectos y Sistemas.
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
