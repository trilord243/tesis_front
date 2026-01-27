# Informe de Seguridad - Ataque Detectado

**Fecha del informe:** 2026-01-22
**Aplicación:** centromundox-front (Heroku)
**Dominio afectado:** centromundox.net / www.centromundox.net

---

## Resumen Ejecutivo

Se detectó un ataque coordinado contra la aplicación CentroMundoX entre las **01:33 UTC** y **02:56 UTC** del 22 de enero de 2026. El ataque consistió en múltiples intentos de:

1. **Ejecución remota de código (RCE)** mediante inyección de JavaScript
2. **Creación de webshell/backdoor** en el sistema de archivos
3. **Conexión a servidor C2** (Command & Control) externo
4. **Escaneo de vulnerabilidades** en rutas comunes

**Resultado:** Los ataques fueron **BLOQUEADOS** gracias a:
- Sistema de archivos read-only de Heroku
- Permisos restrictivos del contenedor
- Timeout en conexiones salientes al servidor C2

---

## Estadísticas del Ataque

| Métrica | Valor |
|---------|-------|
| Duración del ataque | ~1 hora 23 minutos |
| Total de requests maliciosos analizados | 196 POSTs |
| Intentos de RCE (returnNaN) | 121 |
| Intentos de escribir archivos | 100 |
| Conexiones a servidor C2 | 222 |
| Errores HTTP 500 generados | 138 |
| Timeouts (503) | 13 |

---

## IPs Atacantes Identificadas

### Principal Atacante
| IP | Requests | País | ISP/Org | Tipo |
|----|----------|------|---------|------|
| **87.121.84.24** | 96 | USA (New York) | VPSVAULT.HOST LTD | VPS Hosting |

### Atacantes Secundarios
| IP | Requests | País | ISP/Org | Tipo |
|----|----------|------|---------|------|
| 195.3.222.78 | 41 | Polonia (Warsaw) | MEVSPACE / SKYTECHNOLOGY | VPS |
| 129.159.127.76 | 16 | USA (Virginia) | Oracle Cloud Infrastructure | Cloud |
| 72.55.179.209 | 14 | Canadá (Montreal) | Leaseweb Canada | Hosting |

### Servidor C2 (Command & Control)
| IP | País | ISP/Org | Propósito |
|----|------|---------|-----------|
| **176.65.132.224** | Países Bajos | Pfcloud UG / VMHeaven.io | Servidor destino para exfiltración |

### IPs de Escaneo (posible botnet)
- 64.62.197.47, 64.62.156.10, 64.62.156.192 (mismo rango)
- 65.49.1.24, 65.49.1.26
- 98.98.47.138
- 138.246.253.24

---

## Vectores de Ataque

### 1. Inyección de Código (RCE)
```
Error: ReferenceError: returnNaN is not defined
```
El atacante envió payloads JavaScript maliciosos intentando ejecutar funciones como `returnNaN`. Esto indica un intento de **prototype pollution** o **eval injection**.

### 2. Creación de Webshell
Archivos que intentaron crear:
```
/dev/shm/lrt    ← Memoria compartida (común en malware)
/tmp/lrt        ← Directorio temporal
/var/lrt        ← Directorio de sistema
/etc/lrt        ← Configuración del sistema
/dev/lrt        ← Dispositivos
/lrt            ← Raíz del sistema
lrt             ← Directorio actual
```
**Resultado:** Todos bloqueados con errores `EROFS` (read-only filesystem) y `EACCES` (permission denied).

### 3. Conexión a Servidor C2
```
Error: connect ETIMEDOUT 176.65.132.224:80
```
El código malicioso intentó establecer conexión HTTP con el servidor del atacante (posiblemente para:
- Exfiltrar datos
- Descargar malware adicional
- Establecer reverse shell

**Resultado:** Conexiones fallidas por timeout.

### 4. Escaneo de Vulnerabilidades
Rutas escaneadas buscando vulnerabilidades conocidas:
- `/swagger-ui.html`, `/v2/api-docs`, `/v3/api-docs` (Swagger/OpenAPI)
- `/telescope/requests` (Laravel Telescope)
- `/v2/_catalog` (Docker Registry)
- `/webjars/swagger-ui/index.html`

---

## Rutas Más Atacadas

| Ruta | Requests | Propósito |
|------|----------|-----------|
| `/` | 182 | Inyección de Server Actions |
| `/_next` | 32 | Bypass de middleware Next.js |
| `/favicon.ico` | 7 | Reconocimiento |
| `/swagger-ui.html` | 4 | Buscar documentación API |
| `/v2/api-docs` | 4 | Buscar endpoints expuestos |

---

## Hosts Atacados

| Host | Requests |
|------|----------|
| centromundox.net | 260 |
| www.centromundox.net | 168 |

---

## Línea de Tiempo

```
01:33:05 UTC - Inicio del ataque desde 87.121.84.24
01:33:54 UTC - Primeros intentos de conexión a C2 (176.65.132.224)
01:33:XX UTC - Intentos de escribir /lrt en múltiples ubicaciones
...
02:15:XX UTC - Se une 195.3.222.78 al ataque
02:22:XX UTC - Se une 87.121.84.24 con nuevo patrón
02:56:43 UTC - Último registro del ataque analizado
```

---

## Acciones Tomadas

### Ya implementadas:
1. **Bloqueo de IPs en middleware:**
   - 87.121.84.24
   - 195.3.222.78
   - 95.214.55.246

2. **Rate limiting:** 3 requests máximo para POST a rutas sospechosas

3. **Logging de seguridad:** Headers y body de requests sospechosos

### Pendientes:
1. [ ] Agregar IP del servidor C2: `176.65.132.224`
2. [ ] Agregar IPs secundarias al bloqueo
3. [ ] Configurar WAF en Cloudflare
4. [ ] Revisar reglas de firewall de Cloudflare

---

## Acciones Tomadas (2026-01-22)

### 1. Actualización Crítica de Next.js
- **Antes:** Next.js 15.4.4 (VULNERABLE)
- **Después:** Next.js 16.1.4 (PARCHEADO)

La versión 15.4.4 tenía una vulnerabilidad crítica de **RCE (Remote Code Execution) en React Flight Protocol** que el atacante estaba explotando activamente. Los errores `returnNaN is not defined` eran el resultado de payloads maliciosos siendo procesados por Server Actions.

**CVEs corregidos:**
- GHSA-9qr9-h5gf-34mp - RCE in React flight protocol
- GHSA-4342-x723-ch2f - SSRF via Middleware Redirect
- GHSA-w37m-7fhw-fmv9 - Server Actions Source Code Exposure
- GHSA-mwv6-3258-q52c - DoS with Server Components

### 2. Middleware de Seguridad Mejorado

**Nuevas IPs bloqueadas:**
```
87.121.84.24    - VPSVAULT.HOST (USA/NY) - Atacante principal
195.3.222.78    - MEVSPACE (Poland) - Intentos RCE
95.214.55.246   - Atacante previo
129.159.127.76  - Oracle Cloud (USA/VA) - POSTs sospechosos
72.55.179.209   - Leaseweb Canada - POSTs sospechosos
176.65.132.224  - Pfcloud (Netherlands) - Servidor C2 del atacante
```

**Nueva protección anti-bypass:**
- Se agregó verificación de header `CF-Connecting-IP`
- POSTs que no pasen por Cloudflare son bloqueados automáticamente
- Esto previene que atacantes accedan directamente a Heroku

### 3. Otras Vulnerabilidades Corregidas
- `jws` - Verificación HMAC incorrecta
- `qs` - DoS por agotamiento de memoria
- `tar` - Sobreescritura arbitraria de archivos
- `lodash` - Prototype Pollution
- `js-yaml` - Prototype Pollution
- `body-parser` - DoS

### 4. Configuración de Cloudflare
- DNS configurado con proxy activado para `centromundox.net` y `www`
- Se recomienda activar reglas WAF adicionales

## Recomendaciones Adicionales

### En Cloudflare
1. **Activar "Under Attack Mode"** si el ataque continúa
2. **Crear reglas WAF** para bloquear:
   - POSTs a `/` y `/_next` desde IPs no conocidas
   - Requests con `returnNaN` en el body
   - Requests intentando acceder a rutas de Swagger/API docs

3. **Bloquear países** (si no tienes usuarios legítimos):
   - Polonia (195.3.222.78)
   - Países Bajos (servidor C2)

### A mediano plazo
1. Implementar **logging persistente** en base de datos
2. Configurar **alertas automáticas** para patrones de ataque
3. Considerar **Cloudflare Pro** para reglas WAF avanzadas
4. Monitorear actualizaciones de seguridad de Next.js

---

## Datos para Cloudflare

### IPs para bloquear:
```
87.121.84.24
195.3.222.78
176.65.132.224
129.159.127.76
72.55.179.209
95.214.55.246
```

### ASNs sospechosos:
- AS215925 (VPSVAULT.HOST)
- AS201814 (MEVSPACE)
- AS51396 (Pfcloud UG)

### Regla WAF sugerida:
```
(http.request.method eq "POST" and http.request.uri.path eq "/") or
(http.request.method eq "POST" and http.request.uri.path contains "/_next") or
(http.request.body contains "returnNaN") or
(http.request.body contains "eval(") or
(http.request.body contains "__proto__")
```

---

## Conclusión

El ataque fue **detectado y mitigado** sin comprometer la integridad del sistema. Las protecciones de Heroku (filesystem read-only) y el rate limiting implementado funcionaron correctamente.

Sin embargo, el hecho de que código malicioso llegara a ejecutarse parcialmente (evidenciado por los intentos de conexión al servidor C2) indica que existe una vulnerabilidad en el manejo de Server Actions de Next.js que debería ser investigada.

**Nivel de severidad:** ALTO (se ejecutó código, aunque falló en su objetivo)
**Estado actual:** MITIGADO
**Acción requerida:** Revisar configuración de Cloudflare WAF

---

*Informe generado el 2026-01-22 por análisis de logs de Heroku*
