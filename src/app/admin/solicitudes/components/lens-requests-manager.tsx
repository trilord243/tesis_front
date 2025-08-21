"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

// Import our new components
import { LensRequestStats } from "@/components/admin/lens-request-stats";
import { LensRequestFilters } from "@/components/admin/lens-request-filters";
import { LensRequestTable } from "@/components/admin/lens-request-table";
import { LensRequestDialog } from "@/components/admin/lens-request-dialog";

// Import server actions
import {
  getAllLensRequests,
  deleteLensRequest,
  type LensRequest,
} from "@/lib/lens-requests";

export function LensRequestsManager() {
  const [requests, setRequests] = useState<LensRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LensRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<LensRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Filter requests when search term or status filter changes
  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getAllLensRequests();

      if (result.success && result.data) {
        setRequests(result.data);
        setError("");
      } else {
        setError(result.error || "Error al cargar solicitudes");
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading requests:", error);
      setError("Error inesperado al cargar solicitudes");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterRequests = useCallback(() => {
    let filtered = [...requests];

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.userName?.toLowerCase().includes(searchLower) ||
          req.userEmail?.toLowerCase().includes(searchLower) ||
          req.requestReason?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((req) => req.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter]);

  const handleViewRequest = useCallback((request: LensRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteRequest = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta solicitud?")) {
      return;
    }

    try {
      const result = await deleteLensRequest(id);

      if (result.success) {
        setSuccess(result.message || "Solicitud eliminada exitosamente");
        await loadRequests(); // Reload the list
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(result.error || "Error al eliminar solicitud");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      setError("Error inesperado al eliminar solicitud");
    }
  }, [loadRequests]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  }, []);

  const handleRequestUpdate = useCallback(() => {
    loadRequests(); // Reload requests after update
    setSuccess("Solicitud actualizada exitosamente");
    
    // Auto-clear success message after 5 seconds
    setTimeout(() => setSuccess(""), 5000);
  }, [loadRequests]);

  // Clear error after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mb-6">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="w-48 h-10 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <LensRequestStats requests={requests} />

      {/* Filters */}
      <LensRequestFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Requests Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Solicitudes de Lentes ({filteredRequests.length})
          </CardTitle>
          <CardDescription>
            Gestiona las solicitudes de acceso a lentes VR/AR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LensRequestTable
            requests={filteredRequests}
            onViewRequest={handleViewRequest}
            onDeleteRequest={handleDeleteRequest}
          />
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <LensRequestDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onUpdate={handleRequestUpdate}
      />
    </div>
  );
}