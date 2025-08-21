"use client";

import { useState } from "react";
import { createMetaQuestSet } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Gamepad2, Loader2 } from "lucide-react";
import type {
  CreateMetaQuestSetData,
  MetaQuestSetResponse,
} from "@/types/product";

export function MetaQuestSetForm() {
  const [formData, setFormData] = useState<CreateMetaQuestSetData>({
    headsetName: "",
    headsetSerialNumber: "",
    controllers: [{ serialNumber: "" }, { serialNumber: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    set?: MetaQuestSetResponse;
  } | null>(null);

  const handleControllerChange = (index: number, value: string) => {
    const newControllers = [...formData.controllers];
    if (newControllers[index]) {
      newControllers[index].serialNumber = value;
      setFormData((prev) => ({ ...prev, controllers: newControllers }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Validation
      if (!formData.headsetName.trim()) {
        throw new Error("El nombre del headset es requerido");
      }
      if (!formData.headsetSerialNumber.trim()) {
        throw new Error("El número de serie del headset es requerido");
      }
      if (!formData.controllers[0].serialNumber.trim()) {
        throw new Error(
          "El número de serie del primer controlador es requerido"
        );
      }
      if (!formData.controllers[1].serialNumber.trim()) {
        throw new Error(
          "El número de serie del segundo controlador es requerido"
        );
      }

      // Check for duplicate serial numbers
      const serialNumbers = [
        formData.headsetSerialNumber.trim(),
        formData.controllers[0].serialNumber.trim(),
        formData.controllers[1].serialNumber.trim(),
      ];
      const uniqueSerials = new Set(serialNumbers);
      if (uniqueSerials.size !== serialNumbers.length) {
        throw new Error("Los números de serie deben ser únicos");
      }

      const setData: CreateMetaQuestSetData = {
        headsetName: formData.headsetName.trim(),
        headsetSerialNumber: formData.headsetSerialNumber.trim(),
        controllers: formData.controllers.map((c) => ({
          serialNumber: c.serialNumber.trim(),
        })),
      };

      const result = await createMetaQuestSet(setData);

      if (result.success) {
        setMessage({
          type: "success",
          text: `Set MetaQuest "${result.set?.headset.name}" creado exitosamente`,
          set: result.set,
        });
        // Reset form
        setFormData({
          headsetName: "",
          headsetSerialNumber: "",
          controllers: [{ serialNumber: "" }, { serialNumber: "" }],
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al crear el set MetaQuest",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={`${
            message.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              message.type === "success" ? "text-green-800" : "text-red-800"
            }
          >
            {message.text}
            {message.set && (
              <div className="mt-3 text-sm space-y-2">
                <div className="p-2 bg-white rounded border">
                  <p>
                    <strong>Headset:</strong> {message.set.headset.name}
                  </p>
                  <p>
                    <strong>Código:</strong> {message.set.headset.codigo}
                  </p>
                  <p>
                    <strong>EPC:</strong> {message.set.headset.hexValue}
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Controladores:</strong>
                  </p>
                  {message.set.controllers.map((controller, index) => (
                    <div
                      key={controller._id}
                      className="p-2 bg-white rounded border ml-4"
                    >
                      <p>
                        <strong>Controlador {index + 1}:</strong>{" "}
                        {controller.name}
                      </p>
                      <p>
                        <strong>Código:</strong> {controller.codigo}
                      </p>
                      <p>
                        <strong>EPC:</strong> {controller.hexValue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Headset Information */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-3" style={{ color: "#1859A9" }}>
            Información del Headset
          </h4>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="headsetName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del Headset *
              </label>
              <input
                type="text"
                id="headsetName"
                value={formData.headsetName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    headsetName: e.target.value,
                  }))
                }
                placeholder="Ej: MetaQuest 3, MetaQuest Pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="headsetSerialNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Serie del Headset *
              </label>
              <input
                type="text"
                id="headsetSerialNumber"
                value={formData.headsetSerialNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    headsetSerialNumber: e.target.value,
                  }))
                }
                placeholder="Ej: MQ3-12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Controllers Information */}
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold mb-3" style={{ color: "#FF8200" }}>
            Controladores (2)
          </h4>

          <div className="space-y-3">
            {formData.controllers.map((controller, index) => (
              <div key={index}>
                <label
                  htmlFor={`controller-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Número de Serie - Controlador {index + 1} *
                </label>
                <input
                  type="text"
                  id={`controller-${index}`}
                  value={controller.serialNumber}
                  onChange={(e) =>
                    handleControllerChange(index, e.target.value)
                  }
                  placeholder={`Ej: CTRL-${index === 0 ? "L" : "R"}-67890`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Information Box */}
        <div className="p-3 bg-gray-50 rounded-lg border text-sm text-gray-600">
          <p className="font-medium mb-1">¿Qué se creará?</p>
          <ul className="space-y-1">
            <li>• 1 Headset con el nombre y número de serie especificados</li>
            <li>• 2 Controladores automáticamente vinculados al headset</li>
            <li>• Códigos EPC únicos para cada producto</li>
            <li>• Códigos internos únicos para identificación</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          style={{ backgroundColor: "#FF8200" }}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando set MetaQuest...
            </>
          ) : (
            <>
              <Gamepad2 className="mr-2 h-4 w-4" />
              Crear Set Completo
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
