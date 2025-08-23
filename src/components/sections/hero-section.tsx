function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a href="/demo-reserva">
        <button className="bg-brand-primary hover:bg-brand-secondary text-white font-roboto font-bold px-8 py-4 rounded-lg transition-colors w-full">
          Reservar Espacio
        </button>
      </a>
      <a href="/demo-reserva">
        <button className="bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-roboto font-bold px-8 py-4 rounded-lg transition-colors w-full">
          ¿Cómo Reservar?
        </button>
      </a>
    </div>
  );
}

function HeroContent() {
  return (
    <div>
      <h1 className="headliner text-brand-primary mb-6">
        Centro de Investigación Centro Mundo X
      </h1>

      <p className="subcopy text-brand-gray mb-8">
        Accede a <strong>equipos de alta gama</strong> para tus proyectos de
        investigación. Computadores de alto rendimiento, lentes de realidad
        virtual y tecnología de última generación para <strong>tesis</strong>,{" "}
        <strong>investigaciones</strong>y proyectos académicos innovadores.
      </p>

      <ActionButtons />
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative rounded-3xl overflow-hidden h-[500px] md:h-[600px]">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://videos-empresas.nyc3.cdn.digitaloceanspaces.com/companies/asdasdasd@asadasd.com/video_1753896381926.mp4"
          type="video/mp4"
        />
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
