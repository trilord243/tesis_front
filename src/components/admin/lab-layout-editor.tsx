"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  Plus,
  Trash2,
  Save,
  Loader2,
  GripVertical,
  AlertCircle,
  Wand2,
  MapPinOff,
  PlusCircle,
  MinusCircle,
  Rows3,
  Columns3,
} from "lucide-react";

interface Computer {
  _id: string;
  number: number;
  name: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  software: string[];
  specialization: string;
  description: string;
  isAvailable: boolean;
  maintenanceNotes: string;
  accessLevel: "normal" | "special";
  allowedUserTypes: string[];
  gridRow: number;
  gridCol: number;
}

interface UserType {
  _id: string;
  value: string;
  label: string;
  isActive: boolean;
}

interface LabLayoutEditorProps {
  computers: Computer[];
  userTypes: UserType[];
  onSave: (computer: Computer) => Promise<void>;
  onAdd: (computer: Omit<Computer, "_id">) => Promise<void>;
  onDelete: (computerNumber: number) => Promise<void>;
}

// Grid configuration - initial defaults
const DEFAULT_GRID_ROWS = 4;
const DEFAULT_GRID_COLS = 5;
const MAX_GRID_ROWS = 10;
const MAX_GRID_COLS = 10;

export function LabLayoutEditor({
  computers,
  userTypes,
  onSave,
  onAdd,
  onDelete,
}: LabLayoutEditorProps) {
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [draggedComputer, setDraggedComputer] = useState<Computer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [targetCell, setTargetCell] = useState<{ row: number; col: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);

  // Grid dimensions state - calculate from existing computers or use defaults
  const [gridRows, setGridRows] = useState(() => {
    const maxRow = computers.length > 0 ? Math.max(...computers.map((c) => c.gridRow ?? 0)) : 0;
    return Math.max(maxRow + 1, DEFAULT_GRID_ROWS);
  });
  const [gridCols, setGridCols] = useState(() => {
    const maxCol = computers.length > 0 ? Math.max(...computers.map((c) => c.gridCol ?? 0)) : 0;
    return Math.max(maxCol + 1, DEFAULT_GRID_COLS);
  });

  // Form state for new computer
  const [newComputerForm, setNewComputerForm] = useState({
    number: 0,
    name: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    software: "",
    specialization: "",
    description: "",
    accessLevel: "normal" as "normal" | "special",
    allowedUserTypes: [] as string[],
  });

  // Functions to add/remove rows and columns
  const addRow = () => {
    if (gridRows < MAX_GRID_ROWS) {
      setGridRows(gridRows + 1);
    }
  };

  const removeRow = () => {
    // Check if any computer is in the last row
    const hasComputerInLastRow = computers.some((c) => (c.gridRow ?? 0) === gridRows - 1);
    if (hasComputerInLastRow) {
      alert("No puedes eliminar esta fila porque tiene computadoras asignadas. Muévelas primero.");
      return;
    }
    if (gridRows > 1) {
      setGridRows(gridRows - 1);
    }
  };

  const addCol = () => {
    if (gridCols < MAX_GRID_COLS) {
      setGridCols(gridCols + 1);
    }
  };

  const removeCol = () => {
    // Check if any computer is in the last column
    const hasComputerInLastCol = computers.some((c) => (c.gridCol ?? 0) === gridCols - 1);
    if (hasComputerInLastCol) {
      alert("No puedes eliminar esta columna porque tiene computadoras asignadas. Muévelas primero.");
      return;
    }
    if (gridCols > 1) {
      setGridCols(gridCols - 1);
    }
  };

  // Check if computers need auto-assignment (all at position 0,0)
  const needsAutoAssignment = useCallback(() => {
    if (computers.length === 0) return false;
    // Check if all computers are at position 0,0
    return computers.every((c) => c.gridRow === 0 && c.gridCol === 0);
  }, [computers]);

  // Auto-assign positions to computers
  const autoAssignPositions = async () => {
    if (computers.length === 0) return;

    setAutoAssigning(true);
    try {
      // Sort computers by number
      const sortedComputers = [...computers].sort((a, b) => a.number - b.number);

      // Assign positions in a grid pattern
      // First row: computers 1-5 (normal access)
      // Second row onwards: special access computers
      for (let i = 0; i < sortedComputers.length; i++) {
        const computer = sortedComputers[i];
        if (!computer) continue;

        let row: number;
        let col: number;

        if (computer.accessLevel === "normal") {
          // Normal access computers in row 0
          row = 0;
          col = i % gridCols;
        } else {
          // Special access computers in row 1
          const specialIndex = sortedComputers
            .filter((c) => c.accessLevel === "special")
            .indexOf(computer);
          row = 1;
          col = specialIndex % gridCols;
        }

        await onSave({
          ...computer,
          gridRow: row,
          gridCol: col,
        });
      }
    } finally {
      setAutoAssigning(false);
    }
  };

  // Get computer at a specific grid position
  const getComputerAt = useCallback(
    (row: number, col: number): Computer | undefined => {
      return computers.find((c) => {
        const computerRow = c.gridRow ?? 0;
        const computerCol = c.gridCol ?? 0;
        return computerRow === row && computerCol === col;
      });
    },
    [computers]
  );

  // Get computers without assigned positions (all at default 0,0 position)
  const getUnpositionedComputers = useCallback((): Computer[] => {
    // Get all computers at position 0,0 (default position means unassigned)
    const computersAtOrigin = computers.filter(
      (c) => (c.gridRow === 0 || c.gridRow === undefined || c.gridRow === null) &&
             (c.gridCol === 0 || c.gridCol === undefined || c.gridCol === null)
    );

    // Get computers that have been positioned (not at 0,0)
    const positionedComputers = computers.filter(
      (c) => (c.gridRow !== undefined && c.gridRow !== null && c.gridRow > 0) ||
             (c.gridCol !== undefined && c.gridCol !== null && c.gridCol > 0)
    );

    // If there are positioned computers, then all computers at 0,0 are unpositioned
    // (except potentially one that is intentionally at 0,0)
    if (positionedComputers.length > 0) {
      // All computers at origin are unpositioned
      return computersAtOrigin;
    }

    // If NO computers are positioned yet, all except one are unpositioned
    // (we keep one at 0,0 as a starting point)
    if (computersAtOrigin.length <= 1) {
      return [];
    }
    return computersAtOrigin.slice(1);
  }, [computers]);

  // Handle drag start
  const handleDragStart = (computer: Computer) => {
    setDraggedComputer(computer);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const computerAtPos = getComputerAt(row, col);
    if (!computerAtPos || computerAtPos._id === draggedComputer?._id) {
      e.dataTransfer.dropEffect = "move";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  // Handle drop
  const handleDrop = async (row: number, col: number) => {
    if (!draggedComputer) return;

    const computerAtPos = getComputerAt(row, col);
    if (computerAtPos && computerAtPos._id !== draggedComputer._id) {
      return; // Cell is occupied by another computer
    }

    setSaving(true);
    try {
      await onSave({
        ...draggedComputer,
        gridRow: row,
        gridCol: col,
      });
    } finally {
      setSaving(false);
      setDraggedComputer(null);
    }
  };

  // Handle cell click to add new computer or assign existing one
  const handleCellClick = (row: number, col: number) => {
    const computer = getComputerAt(row, col);
    if (computer) {
      setSelectedComputer(computer);
    } else {
      // Empty cell - check if there are unpositioned computers to assign
      setTargetCell({ row, col });
      const unpositioned = getUnpositionedComputers();
      if (unpositioned.length > 0) {
        // Show assign dialog to select from existing unpositioned computers
        setShowAssignDialog(true);
      } else {
        // No unpositioned computers - show add dialog to create new one
        const maxNumber = computers.length > 0
          ? Math.max(...computers.map((c) => c.number))
          : 0;
        setNewComputerForm({
          number: maxNumber + 1,
          name: "",
          cpu: "",
          gpu: "",
          ram: "",
          storage: "",
          software: "",
          specialization: "",
          description: "",
          accessLevel: "normal",
          allowedUserTypes: [],
        });
        setShowAddDialog(true);
      }
    }
  };

  // Handle assigning an existing computer to a cell
  const handleAssignComputer = async (computer: Computer) => {
    if (!targetCell) return;

    setSaving(true);
    try {
      await onSave({
        ...computer,
        gridRow: targetCell.row,
        gridCol: targetCell.col,
      });
      setShowAssignDialog(false);
      setTargetCell(null);
    } finally {
      setSaving(false);
    }
  };

  // Handle add new computer
  const handleAddComputer = async () => {
    if (!targetCell) return;

    setSaving(true);
    try {
      await onAdd({
        number: newComputerForm.number,
        name: newComputerForm.name,
        cpu: newComputerForm.cpu,
        gpu: newComputerForm.gpu,
        ram: newComputerForm.ram,
        storage: newComputerForm.storage,
        software: newComputerForm.software.split(",").map((s) => s.trim()).filter(Boolean),
        specialization: newComputerForm.specialization,
        description: newComputerForm.description,
        isAvailable: true,
        maintenanceNotes: "",
        accessLevel: newComputerForm.accessLevel,
        allowedUserTypes: newComputerForm.allowedUserTypes,
        gridRow: targetCell.row,
        gridCol: targetCell.col,
      });
      setShowAddDialog(false);
      setTargetCell(null);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete computer
  const handleDeleteComputer = async (computer: Computer) => {
    if (!confirm(`¿Estás seguro de eliminar la computadora #${computer.number}?`)) return;

    setSaving(true);
    try {
      await onDelete(computer.number);
      setSelectedComputer(null);
    } finally {
      setSaving(false);
    }
  };

  // Handle removing computer from layout (reset position to 0,0)
  const handleRemoveFromLayout = async (computer: Computer) => {
    setSaving(true);
    try {
      await onSave({
        ...computer,
        gridRow: 0,
        gridCol: 0,
      });
      setSelectedComputer(null);
    } finally {
      setSaving(false);
    }
  };

  // Generate cell ID
  const getCellId = (row: number, col: number) => `${row}-${col}`;

  // Render a grid cell
  const renderCell = (row: number, col: number) => {
    const computer = getComputerAt(row, col);
    const isDragTarget = draggedComputer && !computer;
    const cellId = getCellId(row, col);

    return (
      <div
        key={cellId}
        className={`
          relative w-24 h-24 border-2 rounded-lg transition-all duration-200
          ${computer
            ? computer.accessLevel === "special"
              ? "bg-orange-50 border-orange-300 hover:border-orange-500"
              : "bg-blue-50 border-blue-300 hover:border-blue-500"
            : isDragTarget
              ? "bg-green-50 border-green-400 border-dashed"
              : "bg-gray-50 border-gray-200 border-dashed hover:bg-gray-100 hover:border-gray-400"
          }
          ${draggedComputer?._id === computer?._id ? "opacity-50" : ""}
          cursor-pointer
        `}
        onClick={() => handleCellClick(row, col)}
        onDragOver={(e) => handleDragOver(e, row, col)}
        onDrop={() => handleDrop(row, col)}
      >
        {/* Cell ID label */}
        <span className="absolute top-1 left-1 text-sm font-bold text-gray-500 font-mono bg-white/80 px-1 rounded">
          {cellId}
        </span>

        {computer ? (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-1 pt-3"
            draggable
            onDragStart={() => handleDragStart(computer)}
            onDragEnd={() => setDraggedComputer(null)}
          >
            <GripVertical className="absolute top-1 right-1 h-3 w-3 text-gray-400 cursor-grab" />
            <Monitor
              className={`h-7 w-7 ${
                computer.accessLevel === "special" ? "text-orange-600" : "text-blue-600"
              } ${!computer.isAvailable ? "opacity-50" : ""}`}
            />
            <span className="font-bold text-sm">#{computer.number}</span>
            <span className="text-[10px] text-gray-500 text-center truncate w-full px-1">
              {computer.name.split(" ")[0]}
            </span>
            {!computer.isAvailable && (
              <Badge variant="secondary" className="absolute bottom-1 text-[9px] scale-75">
                Mant.
              </Badge>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center pt-2">
            <Plus className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructions and Actions */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Editor del Plano del Laboratorio</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Arrastra</strong> una computadora para moverla a otra posición</li>
                <li><strong>Clic</strong> en una celda vacía para agregar una nueva computadora</li>
                <li><strong>Clic</strong> en una computadora para ver detalles o eliminarla</li>
                <li>Cada celda tiene un ID <span className="font-mono text-xs bg-gray-200 px-1 rounded">fila-columna</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto-assign button */}
        {needsAutoAssignment() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Wand2 className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Las computadoras no tienen posiciones asignadas
                </p>
                <Button
                  onClick={autoAssignPositions}
                  disabled={autoAssigning}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {autoAssigning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Asignando...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Auto-asignar posiciones
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saving indicator */}
      {(saving || autoAssigning) && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{autoAssigning ? "Asignando posiciones..." : "Guardando..."}</span>
        </div>
      )}

      {/* Grid Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-100 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Rows3 className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filas: {gridRows}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={removeRow}
            disabled={gridRows <= 1}
            className="h-8 w-8 p-0"
            title="Quitar fila"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            disabled={gridRows >= MAX_GRID_ROWS}
            className="h-8 w-8 p-0"
            title="Agregar fila"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Columns3 className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Columnas: {gridCols}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={removeCol}
            disabled={gridCols <= 1}
            className="h-8 w-8 p-0"
            title="Quitar columna"
          >
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addCol}
            disabled={gridCols >= MAX_GRID_COLS}
            className="h-8 w-8 p-0"
            title="Agregar columna"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xs text-gray-500">
          (Máximo: {MAX_GRID_ROWS}x{MAX_GRID_COLS})
        </span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block bg-white rounded-xl border-2 border-gray-300 p-6">
          <h3 className="text-center font-bold text-gray-700 mb-4">
            Distribución del Laboratorio ({gridRows}x{gridCols})
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
            {Array.from({ length: gridRows }).map((_, row) =>
              Array.from({ length: gridCols }).map((_, col) => renderCell(row, col))
            )}
          </div>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-50 border-2 border-blue-300" />
              <span>Acceso Normal (todos)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-50 border-2 border-orange-300" />
              <span>Acceso Restringido</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-50 border-2 border-dashed border-gray-300" />
              <span>Vacío</span>
            </div>
          </div>
        </div>
      </div>

      {/* Computer Details Dialog */}
      <Dialog open={!!selectedComputer} onOpenChange={() => setSelectedComputer(null)}>
        <DialogContent className="max-w-md">
          {selectedComputer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Monitor className={
                    selectedComputer.accessLevel === "special" ? "text-orange-600" : "text-blue-600"
                  } />
                  Computadora #{selectedComputer.number}
                </DialogTitle>
                <DialogDescription>{selectedComputer.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">CPU:</span>
                    <p className="text-gray-600">{selectedComputer.cpu}</p>
                  </div>
                  <div>
                    <span className="font-semibold">GPU:</span>
                    <p className="text-gray-600">{selectedComputer.gpu}</p>
                  </div>
                  <div>
                    <span className="font-semibold">RAM:</span>
                    <p className="text-gray-600">{selectedComputer.ram}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Almacenamiento:</span>
                    <p className="text-gray-600">{selectedComputer.storage}</p>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-sm">Especialización:</span>
                  <p className="text-gray-600 text-sm">{selectedComputer.specialization}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Nivel de acceso:</span>
                  <Badge variant={selectedComputer.accessLevel === "special" ? "default" : "outline"}>
                    {selectedComputer.accessLevel === "special" ? "Restringido" : "Normal (todos)"}
                  </Badge>
                </div>
                {selectedComputer.accessLevel === "special" && (
                  <div>
                    <span className="font-semibold text-sm">Usuarios permitidos:</span>
                    {selectedComputer.allowedUserTypes && selectedComputer.allowedUserTypes.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedComputer.allowedUserTypes.map((typeValue) => {
                          const userType = userTypes.find((ut) => ut.value === typeValue);
                          return (
                            <Badge key={typeValue} variant="secondary" className="text-xs">
                              {userType?.label || typeValue}
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Ninguno (nadie puede acceder)</p>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Estado:</span>
                  <Badge variant={selectedComputer.isAvailable ? "default" : "secondary"}>
                    {selectedComputer.isAvailable ? "Disponible" : "En mantenimiento"}
                  </Badge>
                </div>
                <div>
                  <span className="font-semibold text-sm">Posición:</span>
                  <p className="text-gray-600 text-sm">
                    Fila {selectedComputer.gridRow + 1}, Columna {selectedComputer.gridCol + 1}
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="text-orange-600 hover:bg-orange-50 border-orange-200"
                  onClick={() => handleRemoveFromLayout(selectedComputer)}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MapPinOff className="h-4 w-4 mr-2" />
                  )}
                  Quitar del Plano
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => handleDeleteComputer(selectedComputer)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
                <Button variant="outline" onClick={() => setSelectedComputer(null)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Computer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Computadora</DialogTitle>
            <DialogDescription>
              Agregar computadora en posición: Fila {(targetCell?.row ?? 0) + 1}, Columna{" "}
              {(targetCell?.col ?? 0) + 1}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                type="number"
                value={newComputerForm.number}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, number: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={newComputerForm.name}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, name: e.target.value })
                }
                placeholder="Workstation VR-01"
              />
            </div>
            <div className="space-y-2">
              <Label>CPU</Label>
              <Input
                value={newComputerForm.cpu}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, cpu: e.target.value })
                }
                placeholder="Intel Core i9-14900K"
              />
            </div>
            <div className="space-y-2">
              <Label>GPU</Label>
              <Input
                value={newComputerForm.gpu}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, gpu: e.target.value })
                }
                placeholder="NVIDIA RTX 4090 24GB"
              />
            </div>
            <div className="space-y-2">
              <Label>RAM</Label>
              <Input
                value={newComputerForm.ram}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, ram: e.target.value })
                }
                placeholder="128GB DDR5"
              />
            </div>
            <div className="space-y-2">
              <Label>Almacenamiento</Label>
              <Input
                value={newComputerForm.storage}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, storage: e.target.value })
                }
                placeholder="2TB NVMe SSD"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Software (separado por comas)</Label>
              <Input
                value={newComputerForm.software}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, software: e.target.value })
                }
                placeholder="Unity, Blender, Unreal Engine 5"
              />
            </div>
            <div className="space-y-2">
              <Label>Especialización</Label>
              <Input
                value={newComputerForm.specialization}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, specialization: e.target.value })
                }
                placeholder="Desarrollo VR/AR"
              />
            </div>
            <div className="space-y-2">
              <Label>Nivel de Acceso</Label>
              <Select
                value={newComputerForm.accessLevel}
                onValueChange={(v) =>
                  setNewComputerForm({
                    ...newComputerForm,
                    accessLevel: v as "normal" | "special",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal (todos los usuarios)</SelectItem>
                  <SelectItem value="special">Especial (restringido)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newComputerForm.accessLevel === "special" && userTypes.length > 0 && (
              <div className="col-span-2 space-y-2">
                <Label>Tipos de Usuario Permitidos</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Selecciona los tipos de usuario que pueden acceder a esta computadora. Si no seleccionas ninguno, nadie podrá acceder.
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto p-2 border rounded-md bg-gray-50">
                  {userTypes.filter((ut) => ut.isActive).map((userType) => {
                    const isSelected = newComputerForm.allowedUserTypes.includes(userType.value);
                    return (
                      <div
                        key={userType._id}
                        className={`
                          flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                          ${isSelected ? "bg-blue-100 border-blue-300 border" : "bg-white border border-gray-200 hover:bg-gray-100"}
                        `}
                        onClick={() => {
                          const newAllowed = isSelected
                            ? newComputerForm.allowedUserTypes.filter((t) => t !== userType.value)
                            : [...newComputerForm.allowedUserTypes, userType.value];
                          setNewComputerForm({
                            ...newComputerForm,
                            allowedUserTypes: newAllowed,
                          });
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm">{userType.label}</span>
                      </div>
                    );
                  })}
                </div>
                {newComputerForm.allowedUserTypes.length > 0 && (
                  <p className="text-xs text-blue-600">
                    {newComputerForm.allowedUserTypes.length} tipo(s) seleccionado(s)
                  </p>
                )}
              </div>
            )}
            <div className="col-span-2 space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={newComputerForm.description}
                onChange={(e) =>
                  setNewComputerForm({ ...newComputerForm, description: e.target.value })
                }
                placeholder="Descripción de la computadora y sus capacidades..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddComputer} disabled={saving || !newComputerForm.name}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Agregar Computadora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Existing Computer Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Asignar Computadora</DialogTitle>
            <DialogDescription>
              Selecciona una computadora existente para asignarla a la posición: Fila{" "}
              {(targetCell?.row ?? 0) + 1}, Columna {(targetCell?.col ?? 0) + 1}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 max-h-[400px] overflow-y-auto">
            {getUnpositionedComputers().map((computer) => (
              <div
                key={computer._id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${computer.accessLevel === "special"
                    ? "bg-orange-50 border-orange-200 hover:border-orange-400"
                    : "bg-blue-50 border-blue-200 hover:border-blue-400"
                  }
                `}
                onClick={() => handleAssignComputer(computer)}
              >
                <Monitor
                  className={`h-8 w-8 ${
                    computer.accessLevel === "special" ? "text-orange-600" : "text-blue-600"
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">#{computer.number}</span>
                    <span className="text-gray-700">{computer.name}</span>
                    {computer.accessLevel === "special" && (
                      <Badge className="bg-orange-500 text-white text-xs">Especial</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{computer.specialization}</p>
                </div>
              </div>
            ))}
            {getUnpositionedComputers().length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No hay computadoras sin posición asignada.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowAssignDialog(false);
                const maxNumber = computers.length > 0
                  ? Math.max(...computers.map((c) => c.number))
                  : 0;
                setNewComputerForm({
                  number: maxNumber + 1,
                  name: "",
                  cpu: "",
                  gpu: "",
                  ram: "",
                  storage: "",
                  software: "",
                  specialization: "",
                  description: "",
                  accessLevel: "normal",
                  allowedUserTypes: [],
                });
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Nueva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
