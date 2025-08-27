"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Lightbulb, Database } from "lucide-react";
import { getExistingProductNames, filterSuggestions } from "@/lib/product-suggestions";
import { cn } from "@/lib/utils";

interface ProductNameInputProps {
  value: string;
  onChange: (value: string) => void;
  productTypeName?: string | undefined;
  disabled?: boolean;
  placeholder?: string;
}

export function ProductNameInput({ 
  value, 
  onChange, 
  productTypeName, 
  disabled = false,
  placeholder = "Nombre del activo..."
}: ProductNameInputProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cargar sugerencias cuando cambie el tipo de producto
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoading(true);
      try {
        const existingNames = await getExistingProductNames(productTypeName);
        setSuggestions(existingNames);
      } catch (error) {
        console.error("Error loading product suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, [productTypeName]);

  // Filtrar sugerencias basado en el input del usuario
  useEffect(() => {
    if (value.trim()) {
      const filtered = filterSuggestions(value, suggestions);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && !filtered.includes(value));
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, suggestions]);

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setOpen(false);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor="name">Nombre del Activo</Label>
        {suggestions.length > 0 && !isLoading && (
          <Badge variant="outline" className="text-xs">
            <Database className="w-3 h-3 mr-1" />
            {suggestions.length} nombres existentes
          </Badge>
        )}
        {isLoading && (
          <Badge variant="outline" className="text-xs">
            <Lightbulb className="w-3 h-3 mr-1 animate-pulse" />
            Cargando...
          </Badge>
        )}
      </div>
      
      <div className="relative">
        <Popover open={open && showSuggestions} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                id="name"
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                  if (filteredSuggestions.length > 0) {
                    setOpen(true);
                  }
                }}
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10"
                required
              />
              {suggestions.length > 0 && !disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setOpen(!open)}
                  type="button"
                >
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>
                  {isLoading ? "Cargando nombres..." : "No se encontraron productos existentes"}
                </CommandEmpty>
                <CommandGroup heading={
                  productTypeName 
                    ? `Productos existentes: ${productTypeName}`
                    : "Productos existentes en la base de datos"
                }>
                  {filteredSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={() => handleSelectSuggestion(suggestion)}
                      className="cursor-pointer"
                    >
                      <Database className="mr-2 h-4 w-4 text-green-600" />
                      <div className="flex flex-col">
                        <span>{suggestion}</span>
                        <span className="text-xs text-gray-500">
                          Ya existe en la base de datos
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === suggestion ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Mostrar información contextual */}
      {productTypeName && suggestions.length > 0 && (
        <div className="text-xs text-gray-500 flex items-center">
          <Database className="w-3 h-3 mr-1" />
          Mostrando nombres existentes de tipo: <span className="font-medium ml-1">{productTypeName}</span>
        </div>
      )}
      {!productTypeName && suggestions.length > 0 && (
        <div className="text-xs text-gray-500 flex items-center">
          <Database className="w-3 h-3 mr-1" />
          Selecciona un tipo de producto para ver nombres específicos
        </div>
      )}
    </div>
  );
}