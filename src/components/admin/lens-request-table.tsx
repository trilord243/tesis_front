"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User as UserIcon,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LensRequest } from "@/lib/lens-requests";

interface LensRequestTableProps {
  requests: LensRequest[];
  onViewRequest: (request: LensRequest) => void;
  onDeleteRequest?: (id: string) => void;
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  approved: {
    label: "Aprobada",
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: CheckCircle,
  },
  rejected: {
    label: "Rechazada",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
  },
};

export function LensRequestTable({ 
  requests, 
  onViewRequest, 
  onDeleteRequest 
}: LensRequestTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDeleteRequest) return;
    
    setDeletingId(id);
    try {
      await onDeleteRequest(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No se encontraron solicitudes</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usuario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Acceso</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const StatusIcon = statusConfig[request.status].icon;
            return (
              <TableRow key={request._id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#1859A9" }}
                      >
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{request.userName}</p>
                      <p className="text-sm text-gray-500">{request.userEmail}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusConfig[request.status].color} border`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{formatDate(request.createdAt)}</p>
                    {request.processedAt && (
                      <p className="text-xs text-gray-500">
                        Procesada: {formatDate(request.processedAt)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {request.accessCode && (
                    <div className="text-sm">
                      <p className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        {request.accessCode}
                      </p>
                      {request.expiresAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Expira: {formatDate(request.expiresAt)}
                        </p>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    {onDeleteRequest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(request._id)}
                        disabled={deletingId === request._id}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingId === request._id ? "..." : "Eliminar"}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}