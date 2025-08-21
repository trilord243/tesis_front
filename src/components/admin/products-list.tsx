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
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-500">
                  S/N: {product.serialNumber}
                </p>
                <p className="text-xs text-gray-400">
                  Código: {product.codigo}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
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
          <Link href="/admin/products/add">
            <Button className="mt-4" style={{ backgroundColor: "#FF8200" }}>
              Agregar {type === "headset" ? "primer headset" : "controladores"}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}