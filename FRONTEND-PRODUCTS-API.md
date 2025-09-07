# 📱 Frontend Products API Documentation

Documentación completa de los endpoints de productos para el desarrollo del frontend, incluyendo filtros por ubicación y asignación de usuarios.

## 🗺️ Base URL
```
http://localhost:3000/products
```

## 🔍 Endpoints de Filtrado y Búsqueda

### 1. Buscar Productos por Ubicación Exacta

**Endpoint:** `GET /products/location/{location}`

```typescript
// Ejemplo de uso en React/Next.js
const getProductsByLocation = async (location: string) => {
  const response = await fetch(`/api/products/location/${encodeURIComponent(location)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Ejemplos de ubicaciones válidas
const locations = [
  "Cabinet - Laboratorio del Metaverso",
  "En Uso - Laboratorio del Metaverso", 
  "Fuera del Metaverso",
  "Laboratorio de Robótica",
  "Oficina Principal"
];
```

**Respuesta:**
```typescript
interface Product {
  _id: string;
  name: string;
  serialNumber: string;
  hexValue: string;
  type: "headset" | "controller" | "tracker" | "accessory" | "other";
  ubicacionFisica: string;
  estadoUbicacion: "available" | "in_use" | "maintenance" | "authorized_out";
  currentUser?: string;
  lastCheckoutUser?: string;
  lastCheckoutTime?: Date;
  // ... otros campos
}

// Ejemplo de respuesta
[
  {
    "_id": "674a8b16c4f09b4a88123456",
    "name": "Meta Quest 3 - Unidad 001",
    "serialNumber": "MQ3-2024-001", 
    "hexValue": "3814AEC870000000000003F1",
    "type": "headset",
    "ubicacionFisica": "Cabinet - Laboratorio del Metaverso",
    "estadoUbicacion": "available",
    "currentUser": null
  }
]
```

### 2. Buscar Productos por Texto de Ubicación

**Endpoint:** `GET /products/search/location?q={query}`

```typescript
// Búsqueda flexible por texto
const searchProductsByLocation = async (searchQuery: string) => {
  const response = await fetch(`/api/products/search/location?q=${encodeURIComponent(searchQuery)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Ejemplos de búsqueda
searchProductsByLocation("metaverso");  // Encuentra todo lo que tenga "metaverso"
searchProductsByLocation("cabinet");    // Encuentra todo lo que tenga "cabinet"
searchProductsByLocation("uso");        // Encuentra productos "En Uso"
```

### 3. Obtener Resumen de Ubicaciones

**Endpoint:** `GET /products/location-summary`

```typescript
const getLocationSummary = async () => {
  const response = await fetch('/api/products/location-summary', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

**Respuesta:**
```typescript
interface LocationSummary {
  location: string;
  count: number;
}

// Ejemplo de respuesta
[
  {
    "location": "Cabinet - Laboratorio del Metaverso",
    "count": 15
  },
  {
    "location": "En Uso - Laboratorio del Metaverso", 
    "count": 8
  },
  {
    "location": "Fuera del Metaverso",
    "count": 3
  }
]
```

## 👤 Endpoints de Asignación de Usuarios

### 4. Obtener Productos de un Usuario Específico

**Endpoint:** `GET /products/user/{userCode}`

```typescript
const getUserProducts = async (userCode: string) => {
  const response = await fetch(`/api/products/user/${userCode}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Ejemplos de códigos de usuario
getUserProducts("ADMIN-2025-6DJK");
getUserProducts("USER-2025-ABC123");
```

### 5. Obtener Usuario que Tiene un Producto (por ID)

**Endpoint:** `GET /products/{productId}/user`

```typescript
const getProductUser = async (productId: string) => {
  const response = await fetch(`/api/products/${productId}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};
```

**Respuesta:**
```typescript
interface ProductUserResponse {
  product: Product;
  user: {
    _id: string;
    name: string;
    email: string;
    codigo_acceso: string;
    role: "admin" | "user";
  } | null;
  message: string;
}

// Ejemplo de respuesta
{
  "product": {
    "_id": "674a8b16c4f09b4a88123456",
    "name": "Meta Quest 3 - Unidad 001",
    "currentUser": "USER-2025-ABC123"
  },
  "user": {
    "_id": "674a8b16c4f09b4a88654321",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "codigo_acceso": "USER-2025-ABC123",
    "role": "user"
  },
  "message": "Producto asignado al usuario Juan Pérez"
}
```

### 6. Obtener Usuario por RFID (hexValue)

**Endpoint:** `GET /products/hex/{hexValue}/user`

```typescript
const getUserByRFID = async (hexValue: string) => {
  const response = await fetch(`/api/products/hex/${hexValue}/user`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// Ejemplo con hexValue de RFID
getUserByRFID("3814AEC870000000000003F1");
```

## 🎨 Componentes React de Ejemplo

### 1. Componente de Filtro por Ubicación

```tsx
import React, { useState, useEffect } from 'react';

interface LocationFilterProps {
  onLocationSelect: (location: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState<LocationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/products/location-summary');
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  if (loading) return <div>Cargando ubicaciones...</div>;

  return (
    <div className="location-filter">
      <h3>Filtrar por Ubicación</h3>
      <select onChange={(e) => onLocationSelect(e.target.value)}>
        <option value="">Todas las ubicaciones</option>
        {locations.map((loc) => (
          <option key={loc.location} value={loc.location}>
            {loc.location} ({loc.count})
          </option>
        ))}
      </select>
    </div>
  );
};
```

### 2. Componente de Búsqueda de Usuario

```tsx
import React, { useState } from 'react';

interface UserSearchProps {
  onUserFound: (products: Product[]) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserFound }) => {
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userCode.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/products/user/${userCode}`);
      const products = await response.json();
      onUserFound(products);
    } catch (error) {
      console.error('Error searching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-search">
      <h3>Buscar Equipos de Usuario</h3>
      <div className="search-input">
        <input
          type="text"
          placeholder="Código de usuario (ej: USER-2025-ABC123)"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </div>
  );
};
```

### 3. Componente de Lista de Productos con Usuario

```tsx
import React from 'react';

interface ProductWithUserProps {
  products: Product[];
}

export const ProductWithUser: React.FC<ProductWithUserProps> = ({ products }) => {
  const [userDetails, setUserDetails] = useState<{[key: string]: any}>({});

  const fetchUserForProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/user`);
      const data = await response.json();
      setUserDetails(prev => ({
        ...prev,
        [productId]: data.user
      }));
    } catch (error) {
      console.error('Error fetching user for product:', error);
    }
  };

  return (
    <div className="products-with-users">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <h4>{product.name}</h4>
          <p><strong>Ubicación:</strong> {product.ubicacionFisica}</p>
          <p><strong>Estado:</strong> {product.estadoUbicacion}</p>
          
          {product.currentUser && (
            <div className="user-info">
              <button 
                onClick={() => fetchUserForProduct(product._id)}
                className="load-user-btn"
              >
                Ver Usuario Asignado
              </button>
              
              {userDetails[product._id] && (
                <div className="user-details">
                  <p><strong>Usuario:</strong> {userDetails[product._id].name}</p>
                  <p><strong>Email:</strong> {userDetails[product._id].email}</p>
                  <p><strong>Código:</strong> {userDetails[product._id].codigo_acceso}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

## 📊 Dashboard de Estado de Inventario

```tsx
import React, { useState, useEffect } from 'react';

export const InventoryDashboard: React.FC = () => {
  const [locationSummary, setLocationSummary] = useState<LocationSummary[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Cargar resumen de ubicaciones al montar
    const loadLocationSummary = async () => {
      const response = await fetch('/api/products/location-summary');
      const data = await response.json();
      setLocationSummary(data);
    };
    
    loadLocationSummary();
  }, []);

  const handleLocationChange = async (location: string) => {
    setSelectedLocation(location);
    
    if (location) {
      const response = await fetch(`/api/products/location/${encodeURIComponent(location)}`);
      const data = await response.json();
      setProducts(data);
    } else {
      setProducts([]);
    }
  };

  return (
    <div className="inventory-dashboard">
      <h2>Dashboard de Inventario</h2>
      
      {/* Resumen por ubicaciones */}
      <div className="location-summary">
        <h3>Equipos por Ubicación</h3>
        <div className="location-cards">
          {locationSummary.map((loc) => (
            <div 
              key={loc.location}
              className={`location-card ${selectedLocation === loc.location ? 'selected' : ''}`}
              onClick={() => handleLocationChange(loc.location)}
            >
              <h4>{loc.location}</h4>
              <p className="count">{loc.count} equipos</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de productos filtrados */}
      {selectedLocation && (
        <div className="filtered-products">
          <h3>Equipos en: {selectedLocation}</h3>
          <ProductWithUser products={products} />
        </div>
      )}
    </div>
  );
};
```

## 🚀 Hook Personalizado para Gestión de Estado

```tsx
import { useState, useEffect, useCallback } from 'react';

export const useProductFilters = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<LocationSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las ubicaciones
  const loadLocations = useCallback(async () => {
    try {
      const response = await fetch('/api/products/location-summary');
      const data = await response.json();
      setLocations(data);
    } catch (err) {
      setError('Error loading locations');
    }
  }, []);

  // Filtrar por ubicación
  const filterByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/products/location/${encodeURIComponent(location)}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error filtering products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar por usuario
  const searchByUser = useCallback(async (userCode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/products/user/${userCode}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error searching user products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar por texto de ubicación
  const searchByLocation = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/products/search/location?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error searching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  return {
    products,
    locations,
    loading,
    error,
    filterByLocation,
    searchByUser,
    searchByLocation,
    refreshLocations: loadLocations
  };
};
```

## 📱 Estados de Productos y UI

### Estados de Ubicación
```typescript
type EstadoUbicacion = 
  | "available"        // Disponible en cabinet
  | "in_use"          // En uso dentro del metaverso
  | "maintenance"     // En mantenimiento
  | "authorized_out"  // Autorizado fuera del metaverso
  | "retired";        // Dado de baja

// Mapeo para mostrar en UI
const estadoLabels: Record<EstadoUbicacion, { label: string; color: string }> = {
  available: { label: "Disponible", color: "green" },
  in_use: { label: "En Uso", color: "blue" },
  maintenance: { label: "Mantenimiento", color: "orange" },
  authorized_out: { label: "Fuera (Autorizado)", color: "purple" },
  retired: { label: "Dado de Baja", color: "red" }
};
```

### Ubicaciones Comunes
```typescript
const commonLocations = [
  "Cabinet - Laboratorio del Metaverso",
  "En Uso - Laboratorio del Metaverso",
  "Fuera del Metaverso",
  "Laboratorio de Robótica",
  "Oficina Principal",
  "En Mantenimiento",
  "Almacén General"
];
```

## 🛠️ Notas de Implementación

1. **Autenticación**: Todos los endpoints requieren token JWT
2. **Encoding**: Usar `encodeURIComponent()` para ubicaciones con espacios
3. **Error Handling**: Implementar manejo de errores para cada request
4. **Loading States**: Mostrar indicadores de carga apropiados
5. **Cache**: Considerar cache local para el resumen de ubicaciones
6. **Real-time**: Los datos pueden cambiar cuando usuarios retiran/devuelven equipos

Esta documentación proporciona todo lo necesario para implementar filtros avanzados y seguimiento de asignación de usuarios en el frontend.