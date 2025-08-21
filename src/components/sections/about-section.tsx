interface EquipmentItemProps {
  readonly title: string;
  readonly description: string;
}

function EquipmentItem({ title, description }: EquipmentItemProps) {
  return (
    <div className="flex items-start">
      <div className="bg-brand-orange w-3 h-3 rounded-full mt-2 mr-4 flex-shrink-0"></div>
      <div>
        <h4 className="font-roboto font-bold text-brand-secondary mb-2">
          {title}
        </h4>
        <p className="font-roboto text-brand-gray">{description}</p>
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <div>
      <h2 className="titular text-brand-primary mb-8">
        Equipos de Alta Gama para tu Investigación
      </h2>
      <div className="space-y-6">
        <EquipmentItem
          title="Computadores de Alto Rendimiento"
          description="Estaciones de trabajo especializadas con procesadores de última generación, ideal para análisis de datos, simulaciones y desarrollo de software."
        />
        <EquipmentItem
          title="Realidad Virtual y Aumentada"
          description="Lentes VR/AR de vanguardia para investigaciones en inmersión digital, visualización 3D y experiencias interactivas."
        />
        <EquipmentItem
          title="Equipos Especializados"
          description="Herramientas y dispositivos específicos para diferentes áreas de investigación, desde sensores IoT hasta equipos de medición avanzada."
        />
      </div>
    </div>
  );
}

function ResearchCard() {
  return (
    <div className="bg-gradient-to-br from-brand-orange/5 to-brand-primary/5 rounded-3xl p-12 text-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <h3 className="font-roboto-condensed font-black text-2xl text-brand-primary mb-4">
          Espacios para Tesis e Investigación
        </h3>
        <p className="font-roboto text-brand-gray leading-relaxed mb-6">
          Ambientes diseñados específicamente para el desarrollo de proyectos
          académicos, tesis de grado y postgrado, e investigaciones que
          requieren tecnología especializada y espacios colaborativos.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-brand-primary/5 rounded-lg p-3">
            <div className="font-bold text-brand-primary">Tesis</div>
            <div className="text-brand-gray">Pregrado y Postgrado</div>
          </div>
          <div className="bg-brand-orange/5 rounded-lg p-3">
            <div className="font-bold text-brand-orange">Investigación</div>
            <div className="text-brand-gray">Proyectos Académicos</div>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <div className="bg-gradient-to-r from-brand-primary to-brand-orange w-20 h-1 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

// Nueva sección de equipos específicos
interface EquipmentCardProps {
  readonly title: string;
  readonly description: string;
  readonly features: string[];
  readonly bgColor: string;
}

function EquipmentCard({
  title,
  description,
  features,
  bgColor,
}: EquipmentCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div
        className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
      >
        <div className="w-6 h-6 bg-white rounded-sm"></div>
      </div>
      <h3 className="font-roboto-condensed font-bold text-xl text-brand-secondary mb-3">
        {title}
      </h3>
      <p className="font-roboto text-brand-gray text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-3"></div>
            <span className="font-roboto text-brand-gray">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EquipmentShowcase() {
  const equipmentData = [
    {
      title: "Computadores Gaming/Workstation",
      description:
        "Estaciones de trabajo de alto rendimiento para desarrollo, análisis de datos y simulaciones complejas.",
      features: [
        "Procesadores Intel i9 / AMD Ryzen 9",
        "32GB+ RAM DDR5",
        "GPU RTX 4080/4090",
        "Almacenamiento SSD NVMe",
      ],
      bgColor: "bg-brand-primary/10",
    },
    {
      title: "Realidad Virtual",
      description:
        "Equipos VR de última generación para investigación en inmersión digital y visualización 3D.",
      features: [
        "Meta Quest Pro",
        "HTC Vive Pro 2",
        "Controladores de precisión",
        "Software especializado",
      ],
      bgColor: "bg-brand-orange/10",
    },
    {
      title: "Equipos Especializados",
      description:
        "Herramientas y dispositivos para investigaciones específicas en diversas áreas académicas.",
      features: [
        "Sensores IoT avanzados",
        "Equipos de medición",
        "Cámaras de alta resolución",
        "Instrumentos de laboratorio",
      ],
      bgColor: "bg-brand-secondary/10",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="titular text-brand-primary mb-4">
            Equipos Disponibles
          </h2>
          <p className="font-roboto text-brand-gray text-lg max-w-3xl mx-auto">
            Accede a tecnología de vanguardia para llevar tu investigación al
            siguiente nivel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {equipmentData.map((equipment) => (
            <EquipmentCard
              key={equipment.title}
              title={equipment.title}
              description={equipment.description}
              features={equipment.features}
              bgColor={equipment.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <>
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AboutContent />
            <ResearchCard />
          </div>
        </div>
      </section>
      <div data-tour="equipment-section">
        <EquipmentShowcase />
      </div>
    </>
  );
}
