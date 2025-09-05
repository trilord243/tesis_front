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
    <div className="overflow-x-auto border rounded-lg">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="min-w-[200px] font-semibold text-sm">Usuario</TableHead>
            <TableHead className="min-w-[120px] font-semibold text-sm">Estado</TableHead>
            <TableHead className="min-w-[150px] font-semibold text-sm hidden sm:table-cell">Fecha</TableHead>
            <TableHead className="min-w-[140px] font-semibold text-sm">Acceso</TableHead>
            <TableHead className="min-w-[160px] font-semibold text-center text-sm">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const StatusIcon = statusConfig[request.status].icon;
            return (
              <TableRow key={request._id}>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#1859A9" }}
                      >
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">{request.userName}</p>
                        {request.willLeaveMetaverse && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
                            🌐 Ext
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{request.userEmail}</p>
                      {request.willLeaveMetaverse && request.zoneName && (
                        <p className="text-xs text-blue-600 truncate">📍 {request.zoneName}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    className={`${statusConfig[request.status].color} border whitespace-nowrap`}
                  >
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[request.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 hidden sm:table-cell">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{formatDate(request.createdAt)}</p>
                    {request.processedAt && (
                      <p className="text-xs text-gray-500">
                        Procesada: {formatDate(request.processedAt)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {request.accessCode ? (
                    <div className="text-sm">
                      <p className="font-mono bg-gray-100 px-3 py-2 rounded-md text-sm font-semibold text-center">
                        {request.accessCode}
                      </p>
                      {request.expiresAt && (
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Expira: {formatDate(request.expiresAt)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Sin código</span>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewRequest(request)}
                      className="whitespace-nowrap px-2 sm:px-3"
                    >
                      <Eye className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    {onDeleteRequest && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(request._id)}
                        disabled={deletingId === request._id}
                        className="text-red-600 border-red-300 hover:bg-red-50 whitespace-nowrap px-2 sm:px-3"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-1" />
                        <span className="hidden sm:inline">{deletingId === request._id ? "..." : "Eliminar"}</span>
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