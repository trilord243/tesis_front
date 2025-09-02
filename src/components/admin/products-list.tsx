"use client";

import Link from "next/link";
import {
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductPrintButton } from "@/components/admin/product-print-button";
import type { Product } from "@/types/product";

interface ProductsListProps {
  products: Product[];
  type: "headset" | "controller";
}

export function ProductsList({ products, type }: ProductsListProps) {
  const filteredProducts = products.filter(p => p.type === type);

  return (
    <>
      {filteredProducts.length > 0 ? (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow min-h-[80px]"
            >
              <div className="flex-1 mr-4">
                <h4 className="font-semibold text-lg mb-1" style={{ color: "#1859A9" }}>
                  {product.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">S/N:</span> {product.serialNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Código:</span> {product.codigo}
                  </p>
                  <p className="text-gray-500 font-mono text-xs col-span-full truncate">
                    <span className="font-medium">RFID:</span> {product.hexValue}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-3 min-w-[120px]">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    product.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.isAvailable ? "Disponible" : "En uso"}
                </span>
                <ProductPrintButton product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No hay {type === "headset" ? "headsets" : "controladores"} registrados</p>
          <Link href="/admin/activos/add">
            <Button className="mt-4" style={{ backgroundColor: "#FF8200" }}>
              Agregar {type === "headset" ? "primer headset" : "controladores"}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}