import {
  Users,
  Sparkles,
  Monitor,
  Calendar,
  Lightbulb,
  Leaf,
} from "lucide-react";

interface RuleCardProps {
  readonly title: string;
  readonly icon: React.ReactNode;
  readonly rules: readonly string[];
  readonly iconBg: string;
}

function RuleCard({ title, icon, rules, iconBg }: RuleCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`${iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="font-roboto-condensed font-bold text-lg text-brand-secondary">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {rules.map((rule, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-brand-gray"
          >
            <span className="text-brand-orange mt-1">&#8226;</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LAB_RULES = [
  {
    title: "Respeto y Colaboracion",
    icon: <Users className="w-5 h-5 text-white" />,
    iconBg: "bg-blue-500",
    rules: [
      "Fomenta un ambiente de respeto y colaboracion. Trata a tus companeros y docentes con amabilidad y consideracion.",
      "Evita comportamientos que puedan interrumpir el trabajo de los demas, como ruidos excesivos o desorden.",
    ],
  },
  {
    title: "Cuidado del Espacio",
    icon: <Sparkles className="w-5 h-5 text-white" />,
    iconBg: "bg-purple-500",
    rules: [
      "Manten el laboratorio limpio y ordenado. Al finalizar tu actividad, asegurate de que todas las luces y equipos esten apagados antes de salir.",
      "Informa de inmediato cualquier dano o mal funcionamiento del equipo al Asistente o al Jefe del Dpto. de Gestion de Proyectos y Sistemas.",
      "No comas o bebas en este espacio. En los alrededores tienes espacios en los que puedes hacerlo.",
    ],
  },
  {
    title: "Uso del Equipamiento",
    icon: <Monitor className="w-5 h-5 text-white" />,
    iconBg: "bg-green-500",
    rules: [
      "Sigue las instrucciones de uso de cada equipo y herramienta. Si tienes dudas, pregunta a un profesor o asistente.",
      "Solo utiliza el equipamiento para los fines previstos. El uso inadecuado puede llevar a danos y poner en riesgo la seguridad.",
      'Los equipos no estan destinados para uso recreativo, ni para tareas comunes como revisar documentos, correos o redes sociales. Para estas tareas, usa los laboratorios de computacion "SL".',
    ],
  },
  {
    title: "Horarios y Reservas",
    icon: <Calendar className="w-5 h-5 text-white" />,
    iconBg: "bg-orange-500",
    rules: [
      "Respeta los horarios establecidos que te asignaron para el uso del laboratorio.",
      "Si es necesario reservar el espacio, envia un correo a cguillen@unimet.edu.ve con copia a cmorantes@unimet.edu.ve",
      "El tiempo de uso debe ser equitativo.",
    ],
  },
  {
    title: "Innovacion y Experimentacion",
    icon: <Lightbulb className="w-5 h-5 text-white" />,
    iconBg: "bg-yellow-500",
    rules: [
      "Siente la libertad de innovar y experimentar, pero hazlo con precaucion y responsabilidad, siempre bajo la supervision de un profesor.",
      "Comparte tus ideas y resultados con el grupo; la colaboracion es clave para el aprendizaje.",
    ],
  },
  {
    title: "Cuidado Ambiental",
    icon: <Leaf className="w-5 h-5 text-white" />,
    iconBg: "bg-emerald-500",
    rules: [
      "Manten practicas sostenibles y cuida del medio ambiente. Reduce, reutiliza y recicla cuando sea posible.",
      "Deja la basura en su lugar fuera del laboratorio.",
    ],
  },
] as const;

export function LabRulesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="titular text-brand-primary mb-4">
            Normas de Uso del Laboratorio Experimental del Metaverso
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-brand-gray text-lg leading-relaxed">
              Este espacio ha sido disenado para fomentar la{" "}
              <span className="font-semibold text-brand-primary">
                innovacion
              </span>
              , el{" "}
              <span className="font-semibold text-brand-primary">
                aprendizaje
              </span>{" "}
              y la{" "}
              <span className="font-semibold text-brand-primary">
                colaboracion
              </span>{" "}
              entre estudiantes y profesores del Centro Mundo X. Para asegurar
              un ambiente productivo y seguro para todos, por favor respeta las
              siguientes normas.
            </p>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAB_RULES.map((rule) => (
            <RuleCard
              key={rule.title}
              title={rule.title}
              icon={rule.icon}
              rules={rule.rules}
              iconBg={rule.iconBg}
            />
          ))}
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-8 py-4 rounded-xl">
            <p className="font-roboto-condensed font-bold text-lg">
              Juntos, crearemos un espacio de aprendizaje estimulante y seguro.
            </p>
            <p className="text-sm opacity-90 mt-1">
              Gracias por contribuir a la excelencia academica en nuestro
              laboratorio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
