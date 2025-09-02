# Email Verification API Documentation

## Overview
El sistema de verificación de email requiere que los usuarios verifiquen su dirección de correo electrónico antes de poder iniciar sesión. Al registrarse, se envía automáticamente un código de 6 dígitos al email proporcionado.

## Flow Diagram
```
1. Usuario se registra → Se envía código automáticamente
2. Usuario ingresa código de verificación
3. Si el código es correcto → Email verificado ✓
4. Usuario puede iniciar sesión
```

## API Endpoints

### 1. Register User (Envía código automáticamente)
**POST** `/users`

**Request Body:**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "cedula": "12345678",
  "password": "miPassword123"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "cedula": "12345678",
  "emailVerified": false,
  "role": "user",
  // ... otros campos
}
```

**Nota:** El código de verificación se envía automáticamente al email proporcionado.

---

### 2. Verify Email Code
**POST** `/users/verify-email`

**Request Body:**
```json
{
  "email": "juan@example.com",
  "code": "123456"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Correo verificado exitosamente"
}
```

**Error Responses:**

- **400 Bad Request** - Código incorrecto:
```json
{
  "statusCode": 400,
  "message": "Código incorrecto. Te quedan 2 intento(s)",
  "error": "Bad Request"
}
```

- **400 Bad Request** - Código expirado:
```json
{
  "statusCode": 400,
  "message": "El código de verificación ha expirado",
  "error": "Bad Request"
}
```

- **400 Bad Request** - Máximo de intentos:
```json
{
  "statusCode": 400,
  "message": "Has excedido el número máximo de intentos. Solicita un nuevo código",
  "error": "Bad Request"
}
```

---

### 3. Resend Verification Code
**POST** `/users/resend-verification`

**Request Body:**
```json
{
  "email": "juan@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Código de verificación reenviado exitosamente"
}
```

**Error Responses:**

- **400 Bad Request** - Rate limiting (debe esperar 1 minuto entre reenvíos):
```json
{
  "statusCode": 400,
  "message": "Por favor espera 45 segundos antes de solicitar un nuevo código",
  "error": "Bad Request"
}
```

- **400 Bad Request** - Usuario no encontrado:
```json
{
  "statusCode": 400,
  "message": "Usuario no encontrado",
  "error": "Bad Request"
}
```

---

### 4. Check Verification Status
**GET** `/users/check-verification/{email}`

**Example:** `GET /users/check-verification/juan@example.com`

**Response (200 OK):**
```json
{
  "email": "juan@example.com",
  "verified": false
}
```

---

### 5. Login (Requiere email verificado)
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Success Response (200 OK):** *(Solo si el email está verificado)*
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):** *(Si el email NO está verificado)*
```json
{
  "statusCode": 401,
  "message": "Por favor verifica tu correo electrónico antes de iniciar sesión",
  "error": "Unauthorized"
}
```

---

## Frontend Implementation Guide

### 1. Registration Form
```typescript
// Componente de Registro
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    cedula: '',
    password: ''
  });
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setUserEmail(formData.email);
        setShowVerification(true); // Mostrar pantalla de verificación
        toast.success('¡Registro exitoso! Revisa tu correo para el código de verificación');
      }
    } catch (error) {
      toast.error('Error al registrarse');
    }
  };

  if (showVerification) {
    return <VerificationForm email={userEmail} />;
  }

  return (
    // ... formulario de registro
  );
};
```

### 2. Verification Component
```typescript
// Componente de Verificación
const VerificationForm = ({ email }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  // Manejo del código de verificación
  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Email verificado exitosamente!');
        router.push('/login'); // Redirigir al login
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Código reenviado a tu correo');
        
        // Deshabilitar botón por 60 segundos
        setResendDisabled(true);
        setCountdown(60);
        
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error al reenviar el código');
    }
  };

  return (
    <div className="verification-container">
      <h2>Verifica tu correo electrónico</h2>
      <p>Hemos enviado un código de 6 dígitos a {email}</p>
      
      <input
        type="text"
        placeholder="Ingresa el código de 6 dígitos"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        className="code-input"
      />
      
      <button 
        onClick={handleVerifyCode} 
        disabled={loading || code.length !== 6}
      >
        {loading ? 'Verificando...' : 'Verificar Código'}
      </button>

      <div className="resend-section">
        <p>¿No te llegó el código?</p>
        <button 
          onClick={handleResendCode} 
          disabled={resendDisabled}
          className="resend-button"
        >
          {resendDisabled 
            ? `Reenviar en ${countdown}s` 
            : 'Reenviar código'}
        </button>
      </div>
    </div>
  );
};
```

### 3. Login Form with Verification Check
```typescript
// Componente de Login
const LoginForm = () => {
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { access_token } = await response.json();
        // Guardar token y redirigir
        localStorage.setItem('token', access_token);
        router.push('/dashboard');
      } else if (response.status === 401) {
        const error = await response.json();
        
        // Verificar si es error de verificación de email
        if (error.message.includes('verifica tu correo')) {
          toast.error('Debes verificar tu correo antes de iniciar sesión');
          
          // Opcionalmente, mostrar botón para reenviar código
          setShowResendOption(true);
          setUnverifiedEmail(email);
        } else {
          toast.error('Credenciales incorrectas');
        }
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    // ... formulario de login
  );
};
```

---

## Important Notes for Frontend

### 1. **Código de Verificación**
- El código tiene **6 dígitos numéricos**
- Expira en **5 minutos**
- Máximo **3 intentos** por código
- Se envía automáticamente al registrarse

### 2. **Rate Limiting**
- Debe esperar **60 segundos** entre reenvíos
- El backend devuelve el tiempo restante de espera

### 3. **UX Recommendations**
- Mostrar input numérico para el código (6 dígitos)
- Auto-focus en el campo del código
- Mostrar contador regresivo para el botón de reenvío
- Validar que el código tenga 6 dígitos antes de enviar
- Mostrar mensajes de error claros del backend

### 4. **Estados del Email**
- `emailVerified: false` → Usuario registrado pero no verificado
- `emailVerified: true` → Usuario puede iniciar sesión

### 5. **Flujo de Usuario Ideal**
```
1. Usuario llena formulario de registro
2. Click en "Registrarse"
3. Automáticamente se muestra pantalla de verificación
4. Usuario revisa su email y encuentra el código
5. Ingresa el código de 6 dígitos
6. Click en "Verificar"
7. Redirige a login o dashboard
```

### 6. **Manejo de Errores**
- Si el código expira → Mostrar opción de reenviar
- Si excede intentos → Forzar reenvío de nuevo código
- Si el email no existe → Mostrar error claro

---

## Email Template Preview

El usuario recibirá un email con el siguiente formato:

```
De: CentroMundoX <f.escalona@symtechven.com>
Asunto: Verifica tu correo electrónico - CentroMundoX

¡Hola [Nombre]!

Gracias por registrarte en CentroMundoX. Para completar tu registro,
necesitamos verificar tu dirección de correo electrónico.

Tu código de verificación es:

        [ 123456 ]

Este código expirará en 5 minutos.

Si no has solicitado este código, puedes ignorar este correo de forma segura.

© CentroMundoX
```

---

## Testing the Implementation

Para probar la implementación:

1. **Crear usuario de prueba:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "cedula": "12345678",
    "password": "password123"
  }'
```

2. **Verificar código (reemplazar con código real):**
```bash
curl -X POST http://localhost:3000/users/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

3. **Reenviar código:**
```bash
curl -X POST http://localhost:3000/users/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```