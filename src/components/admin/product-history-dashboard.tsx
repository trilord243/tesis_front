"use client";

import { useState } from "react";
import { History, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { ProductHistoryTimeline } from "./product-history-timeline";
import { ProductHistoryStatsComponent } from "./product-history-stats";

interface ProductHistoryDashboardProps {
  product: Product;
  trigger?: React.ReactNode;
}

export function ProductHistoryDashboard({
  product,
  trigger
}: ProductHistoryDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button variant="outline" size="sm" title="Ver historial completo">
      <History className="h-4 w-4 mr-2" />
      Historial
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial Completo del Producto
          </DialogTitle>
          <DialogDescription>
            {product.name} - {product.serialNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="timeline" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Línea de Tiempo
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estadísticas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="flex-1 mt-4 overflow-hidden">
              <ProductHistoryTimeline product={product} />
            </TabsContent>

            <TabsContent value="stats" className="flex-1 mt-4 overflow-auto">
              <ProductHistoryStatsComponent product={product} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente compacto para mostrar en cards o listas
export function ProductHistoryPreview({ product }: { product: Product }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Historial Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-gray-500">
          Última actualización: {new Date(product.updatedAt).toLocaleDateString("es-ES")}
        </div>
        <div className="text-xs text-gray-500">
          Creado: {new Date(product.createdAt).toLocaleDateString("es-ES")}
        </div>
        <ProductHistoryDashboard
          product={product}
          trigger={
            <Button variant="outline" size="sm" className="w-full mt-2">
              <History className="h-3 w-3 mr-1" />
              Ver Historial Completo
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}