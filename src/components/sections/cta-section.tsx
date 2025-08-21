function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a href="/demo-reserva">
        <button className="bg-brand-orange hover:bg-brand-orange-secondary text-white font-roboto font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base w-full">
          ¿Cómo Reservar?
        </button>
      </a>
      <a href="/auth/register">
        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-brand-primary font-roboto font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base w-full">
          Crear Cuenta
        </button>
      </a>
    </div>
  );
}

export function CTASection() {
  return (
    <section
      data-tour="cta-section"
      className="bg-brand-primary py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Contenido de texto */}
          <div className="text-center md:text-left">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6"
              style={{ fontFamily: "Roboto Condensed, sans-serif" }}
            >
              ¿Listo para tu Investigación?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
              Reserva tu espacio en CentroMundoX y accede a equipos de alta gama
              para desarrollar tu tesis, proyecto de investigación o trabajo
              académico con tecnología de vanguardia.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-center md:justify-end">
            <CTAButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
