import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LensRequest } from "@/lib/lens-requests";

interface LensRequestStatsProps {
  requests: LensRequest[];
}

export function LensRequestStats({ requests }: LensRequestStatsProps) {
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const statsCards = [
    {
      title: "Total",
      value: stats.total,
      subtitle: "Solicitudes totales",
      color: "#1859A9",
      icon: AlertCircle,
      bgColor: "text-blue-400",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      subtitle: "Requieren revisión",
      color: "#EAB308",
      icon: Clock,
      bgColor: "text-yellow-400",
    },
    {
      title: "Aprobadas",
      value: stats.approved,
      subtitle: "Solicitudes aprobadas",
      color: "#22C55E",
      icon: CheckCircle,
      bgColor: "text-green-400",
    },
    {
      title: "Rechazadas",
      value: stats.rejected,
      subtitle: "Solicitudes rechazadas",
      color: "#EF4444",
      icon: XCircle,
      bgColor: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span
                className="text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <stat.icon className={`h-8 w-8 ${stat.bgColor}`} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}