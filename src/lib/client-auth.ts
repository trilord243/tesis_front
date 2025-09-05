// Función para obtener el token JWT desde el cliente
export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Intentar obtener de localStorage primero (para acceso cliente)
  const tokenFromStorage = localStorage.getItem('auth-token');
  if (tokenFromStorage) {
    return tokenFromStorage;
  }

  // Si no está en localStorage, intentar con cookies no-httpOnly como fallback
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('client-auth-token='));
  
  if (authCookie) {
    const tokenValue = authCookie.split('=')[1];
    return tokenValue || null;
  }
  
  return null;
}

// Función para guardar el token en el cliente
export function setClientAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  // Guardar en localStorage para acceso desde cliente
  localStorage.setItem('auth-token', token);
  
  // También como cookie accesible para casos donde localStorage no funcione
  document.cookie = `client-auth-token=${token}; path=/; max-age=3600; samesite=lax${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
}

// Función para limpiar el token del cliente
export function clearClientAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  // Limpiar localStorage
  localStorage.removeItem('auth-token');
  
  // Limpiar cookie
  document.cookie = 'client-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}