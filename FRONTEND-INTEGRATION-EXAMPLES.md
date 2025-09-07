# 🚀 Frontend Integration Examples

Ejemplos de integración específicos para diferentes frameworks y librerías del ecosistema React/Next.js.

## 🔧 Next.js 15 App Router (Server Actions)

### Server Actions para Products API

```typescript
// src/lib/actions/products-actions.ts
'use server';

import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export async function getProductsByLocation(location: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/products/location/${encodeURIComponent(location)}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by location:', error);
    return [];
  }
}

export async function searchProductsByLocation(query: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/products/search/location?q=${encodeURIComponent(query)}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

export async function getUserProducts(userCode: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/products/user/${userCode}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch user products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user products:', error);
    return [];
  }
}

export async function getLocationSummary() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/products/location-summary`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location summary');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching location summary:', error);
    return [];
  }
}

export async function getProductUser(productId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/products/${productId}/user`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch product user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product user:', error);
    return null;
  }
}
```

### Page Component con Server Actions

```tsx
// src/app/admin/inventory/page.tsx
import { getLocationSummary } from '@/lib/actions/products-actions';
import { InventoryClient } from './inventory-client';

export default async function InventoryPage() {
  const locationSummary = await getLocationSummary();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>
      <InventoryClient initialData={locationSummary} />
    </div>
  );
}
```

### Client Component con useActionState

```tsx
// src/app/admin/inventory/inventory-client.tsx
'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { getProductsByLocation, searchProductsByLocation, getUserProducts } from '@/lib/actions/products-actions';

interface InventoryClientProps {
  initialData: LocationSummary[];
}

export function InventoryClient({ initialData }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter by location
  const handleLocationFilter = async (location: string) => {
    setLoading(true);
    setSelectedLocation(location);
    
    try {
      const result = await getProductsByLocation(location);
      setProducts(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search by location text
  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchProductsByLocation(query);
      setProducts(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search by user
  const handleUserSearch = async (code: string) => {
    if (!code.trim()) return;
    
    setLoading(true);
    try {
      const result = await getUserProducts(code);
      setProducts(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {initialData.map((loc) => (
          <div
            key={loc.location}
            onClick={() => handleLocationFilter(loc.location)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedLocation === loc.location 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <h3 className="font-semibold text-sm mb-2">{loc.location}</h3>
            <p className="text-2xl font-bold text-blue-600">{loc.count}</p>
            <p className="text-xs text-gray-500">equipos</p>
          </div>
        ))}
      </div>

      {/* Search Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Buscar por ubicación</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ej: metaverso, cabinet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => handleLocationSearch(searchQuery)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Equipos de usuario</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ej: USER-2025-ABC123"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => handleUserSearch(userCode)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && selectedLocation && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos para los criterios seleccionados
        </div>
      )}
    </div>
  );
}
```

## 🎨 Shadcn/ui Components

### Product Card Component

```tsx
// src/components/ui/product-card.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { getProductUser } from '@/lib/actions/products-actions';

interface ProductCardProps {
  product: Product;
}

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  in_use: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-orange-100 text-orange-800',
  authorized_out: 'bg-purple-100 text-purple-800',
  retired: 'bg-red-100 text-red-800'
};

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  in_use: 'En Uso',
  maintenance: 'Mantenimiento',
  authorized_out: 'Fuera (Autorizado)',
  retired: 'Dado de Baja'
};

export function ProductCard({ product }: ProductCardProps) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const handleLoadUser = async () => {
    if (userInfo || !product.currentUser) return;
    
    setLoadingUser(true);
    try {
      const result = await getProductUser(product._id);
      setUserInfo(result);
      setShowUserInfo(true);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{product.type}</Badge>
          <Badge 
            className={statusColors[product.estadoUbicacion] || 'bg-gray-100 text-gray-800'}
          >
            {statusLabels[product.estadoUbicacion] || product.estadoUbicacion}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>{product.ubicacionFisica}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
            {product.serialNumber}
          </span>
        </div>

        {product.estadoUbicacion === 'maintenance' && (
          <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            <span>En mantenimiento</span>
          </div>
        )}

        {product.currentUser && (
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadUser}
              disabled={loadingUser}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              {loadingUser ? 'Cargando...' : 'Ver Usuario Asignado'}
            </Button>

            {showUserInfo && userInfo?.user && (
              <div className="bg-blue-50 p-3 rounded-md space-y-1">
                <p className="font-semibold text-sm">{userInfo.user.name}</p>
                <p className="text-xs text-gray-600">{userInfo.user.email}</p>
                <p className="text-xs text-gray-600 font-mono">{userInfo.user.codigo_acceso}</p>
                {userInfo.user.role === 'admin' && (
                  <Badge variant="secondary" className="text-xs">Administrador</Badge>
                )}
              </div>
            )}
          </div>
        )}

        {product.lastCheckoutTime && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              Último checkout: {new Date(product.lastCheckoutTime).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### Location Summary Component with Charts

```tsx
// src/components/dashboard/location-summary.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface LocationSummaryProps {
  data: LocationSummary[];
  onLocationSelect: (location: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function LocationSummary({ data, onLocationSelect }: LocationSummaryProps) {
  const totalProducts = data.reduce((sum, item) => sum + item.count, 0);

  const pieData = data.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Equipos por Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                <XAxis 
                  dataKey="location" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  onClick={(data) => onLocationSelect(data.location)}
                  className="cursor-pointer hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-gray-600">Total Equipos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {data.find(d => d.location.includes('Cabinet'))?.count || 0}
            </div>
            <p className="text-xs text-gray-600">En Cabinet</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {data.find(d => d.location.includes('En Uso'))?.count || 0}
            </div>
            <p className="text-xs text-gray-600">En Uso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {data.find(d => d.location.includes('Mantenimiento'))?.count || 0}
            </div>
            <p className="text-xs text-gray-600">Mantenimiento</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 📱 Mobile-First Filter Component

```tsx
// src/components/mobile/product-filters.tsx
'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, Search, User } from 'lucide-react';

interface ProductFiltersProps {
  locations: LocationSummary[];
  onLocationFilter: (location: string) => void;
  onLocationSearch: (query: string) => void;
  onUserSearch: (userCode: string) => void;
}

export function ProductFilters({ 
  locations, 
  onLocationFilter, 
  onLocationSearch, 
  onUserSearch 
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userCode, setUserCode] = useState('');

  const handleLocationSearch = () => {
    if (searchQuery.trim()) {
      onLocationSearch(searchQuery);
      setIsOpen(false);
    }
  };

  const handleUserSearch = () => {
    if (userCode.trim()) {
      onUserSearch(userCode);
      setIsOpen(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    onLocationFilter(location);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filtros de Búsqueda</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Location Search */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar por ubicación
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="ej: metaverso, cabinet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleLocationSearch}>Buscar</Button>
            </div>
          </div>

          {/* User Search */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Equipos de usuario
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="ej: USER-2025-ABC123"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUserSearch}>Buscar</Button>
            </div>
          </div>

          {/* Location List */}
          <div className="space-y-3">
            <Label>Filtrar por ubicación exacta</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {locations.map((location) => (
                <div
                  key={location.location}
                  onClick={() => handleLocationSelect(location.location)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                >
                  <span className="text-sm">{location.location}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {location.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

## 🔄 Real-time Updates with WebSockets

```tsx
// src/hooks/use-realtime-inventory.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useRealtimeInventory() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [inventoryUpdates, setInventoryUpdates] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
    
    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('inventory_update', (data) => {
      setInventoryUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates
    });

    socketInstance.on('product_checkout', (data) => {
      setInventoryUpdates(prev => [{
        type: 'checkout',
        message: `${data.userCode} retiró ${data.productName}`,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    });

    socketInstance.on('product_return', (data) => {
      setInventoryUpdates(prev => [{
        type: 'return',
        message: `${data.userCode} devolvió ${data.productName}`,
        timestamp: new Date()
      }, ...prev.slice(0, 9)]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { inventoryUpdates };
}

// Component using real-time updates
export function InventoryUpdates() {
  const { inventoryUpdates } = useRealtimeInventory();

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Actualizaciones en Tiempo Real</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {inventoryUpdates.map((update, index) => (
          <div key={index} className="text-sm p-2 bg-gray-50 rounded">
            <div className="flex justify-between items-start">
              <span>{update.message}</span>
              <span className="text-xs text-gray-500">
                {update.timestamp?.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Esta documentación adicional proporciona ejemplos específicos y listos para usar en proyectos Next.js 15 con las últimas características como Server Actions, componentes de Shadcn/ui, y actualizaciones en tiempo real con WebSockets.