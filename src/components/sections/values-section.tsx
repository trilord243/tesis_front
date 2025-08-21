interface ValueCardProps {
  readonly title: string;
  readonly description: string;
  readonly iconColor: string;
  readonly bgColor: string;
}

function ValueCard({ title, description, iconColor, bgColor }: ValueCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
      <div
        className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}
      >
        <div className={`w-8 h-8 ${iconColor} rounded-full`}></div>
      </div>
      <h3 className="font-roboto font-bold text-xl text-brand-secondary mb-4">
        {title}
      </h3>
      <p className="font-roboto text-brand-gray leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const VALUES_DATA = [
  {
    title: "Tecnología de Vanguardia",
    description:
      "Equipos de última generación incluyendo computadores de alto rendimiento, lentes VR y herramientas especializadas para investigación.",
    iconColor: "bg-brand-primary",
    bgColor: "bg-brand-primary/10",
  },
  {
    title: "Investigación de Calidad",
    description:
      "Espacios optimizados y recursos especializados para el desarrollo de tesis, proyectos académicos e investigaciones innovadoras.",
    iconColor: "bg-brand-orange",
    bgColor: "bg-brand-orange/10",
  },
  {
    title: "Acceso Democratizado",
    description:
      "Facilitamos el acceso a tecnología avanzada para estudiantes e investigadores, promoviendo la innovación y el conocimiento.",
    iconColor: "bg-brand-secondary",
    bgColor: "bg-brand-secondary/10",
  },
] as const;

export function ValuesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="titular text-brand-primary text-center mb-16">
          Nuestros Pilares Fundamentales
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {VALUES_DATA.map((value) => (
            <ValueCard
              key={value.title}
              title={value.title}
              description={value.description}
              iconColor={value.iconColor}
              bgColor={value.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
