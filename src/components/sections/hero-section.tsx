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
        Centro de Investigación de Centro mundo xaa
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
    <div className="bg-gradient-to-br from-brand-primary/10 to-brand-orange/10 rounded-3xl p-8 h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-brand-primary text-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-roboto-condensed font-black">CMX</span>
        </div>
        <p className="titular text-brand-secondary">CentroMundoXaaa</p>
        <p className="font-roboto text-brand-gray">Centro de Investigación</p>
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
          <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
          <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
        </div>
      </div>
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
