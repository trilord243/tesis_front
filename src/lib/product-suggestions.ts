import { Product } from "@/types/product";

// Función para obtener nombres únicos de productos existentes por tipo
export async function getExistingProductNames(productTypeName?: string): Promise<string[]> {
  try {
    // Obtener todos los productos desde la API
    const response = await fetch("/api/products", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error fetching products for suggestions");
      return [];
    }

    const result = await response.json();
    const products: Product[] = result.products || [];

    // Filtrar por tipo si se especifica
    let filteredProducts = products;
    if (productTypeName) {
      filteredProducts = products.filter(product => 
        product.type?.toLowerCase() === productTypeName.toLowerCase()
      );
    }

    // Obtener nombres únicos
    const uniqueNames = Array.from(new Set(
      filteredProducts.map(product => product.name).filter(Boolean)
    ));

    // Ordenar alfabéticamente
    return uniqueNames.sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.error("Error getting existing product names:", error);
    return [];
  }
}

// Función para obtener todos los nombres únicos sin filtrar por tipo
export async function getAllExistingProductNames(): Promise<string[]> {
  return getExistingProductNames(); // Sin filtro de tipo
}

// Función para filtrar sugerencias basándose en el input del usuario
export function filterSuggestions(input: string, suggestions: string[]): string[] {
  if (!input.trim()) return suggestions.slice(0, 10); // Mostrar máximo 10 sin filtro
  
  const query = input.toLowerCase().trim();
  
  const filtered = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query)
  ).sort((a, b) => {
    // Priorizar coincidencias exactas
    const aExact = a.toLowerCase() === query;
    const bExact = b.toLowerCase() === query;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Luego priorizar coincidencias que empiecen con el query
    const aStartsWith = a.toLowerCase().startsWith(query);
    const bStartsWith = b.toLowerCase().startsWith(query);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // Por último, orden alfabético
    return a.localeCompare(b);
  });

  // Limitar a 8 sugerencias máximo para mejor UX
  return filtered.slice(0, 8);
}

// Función auxiliar para verificar si un nombre ya existe exactamente
export function checkIfNameExists(name: string, existingNames: string[]): boolean {
  return existingNames.some(existing => 
    existing.toLowerCase() === name.toLowerCase()
  );
}

// Función para obtener sugerencias con indicador de si ya existe
export function getSuggestionsWithExistenceCheck(
  input: string, 
  suggestions: string[]
): Array<{ name: string; exists: boolean }> {
  const filtered = filterSuggestions(input, suggestions);
  
  return filtered.map(name => ({
    name,
    exists: true // Todos los nombres vienen de productos existentes
  }));
}