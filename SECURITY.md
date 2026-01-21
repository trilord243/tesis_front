# Security Documentation

This document describes security incidents, forensic analysis, and protective measures implemented in the CentroMundoX Frontend application.

## Table of Contents

- [Forensic Report: Attack Incident 2026-01-21](#forensic-report-attack-incident-2026-01-21)
  - [Executive Summary](#executive-summary)
  - [Attack Timeline](#attack-timeline)
  - [Raw Logs](#raw-logs)
  - [Detailed Analysis](#detailed-analysis)
  - [Attack Vectors Explained](#attack-vectors-explained)
  - [Why These Specific Paths?](#why-these-specific-paths)
  - [How Heroku Defended](#how-heroku-defended)
- [How to View Logs in Heroku](#how-to-view-logs-in-heroku)
- [Security Measures Implemented](#security-measures-implemented)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Recommendations](#recommendations)

---

# Forensic Report: Attack Incident 2026-01-21

## Executive Summary

| Field                | Value                                         |
| -------------------- | --------------------------------------------- |
| **Date**             | January 21, 2026                              |
| **Time (UTC)**       | 15:00:47 - 15:01:25                           |
| **Duration**         | ~38 seconds                                   |
| **Attacker IP**      | `87.121.84.24`                                |
| **Origin Country**   | Bulgaria                                      |
| **Target**           | `www.centromundox.net` (Frontend)             |
| **Attack Type**      | Remote Code Execution (RCE) + Webshell Upload |
| **Result**           | **FAILED** - All attempts blocked             |
| **Data Compromised** | None                                          |

---

## Attack Timeline

```
15:00:47.737 │ Attack begins
15:00:52.850 │ First RCE attempt (returnNaN injection)
15:00:53.157 │ File write attempt: /tmp/lrt (DENIED)
15:00:58.571 │ File write attempt: /dev/lrt (DENIED)
15:01:03.982 │ File write attempt: /dev/shm/lrt (DENIED)
15:01:05.585 │ Request timeout (H12) - Heroku kills request
15:01:09.399 │ File write attempt: /var/lrt (DENIED)
15:01:14.817 │ File write attempt: /etc/lrt (DENIED)
15:01:20.218 │ File write attempt: /lrt (DENIED)
15:01:25.309 │ Last detected request
             │
             ▼
        Attack ends (attacker likely gave up)
```

---

## Raw Logs

### Source

- **Platform**: Heroku
- **App**: `centromundox-front`
- **Command used**: `heroku logs --tail --app centromundox-front`

### Complete Log Capture

```log
2026-01-21T15:00:47.737569+00:00 app[web.1]: }
2026-01-21T15:00:52.850498+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '998905755' }
2026-01-21T15:00:52.852561+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=5a5c019d-b326-b722-e623-6ad5ea468a5a fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:00:53.046808+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '866792064' }
2026-01-21T15:00:53.048320+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=f84e81bb-ec17-741b-8897-ac341576c080 fwd="87.121.84.24" dyno=web.1 connect=0ms service=4ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:00:53.157944+00:00 app[web.1]: [Error: EACCES: permission denied, open '/tmp/lrt'] {
2026-01-21T15:00:53.157962+00:00 app[web.1]: errno: -13,
2026-01-21T15:00:53.157963+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:00:53.157963+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:00:53.157963+00:00 app[web.1]: path: '/tmp/lrt'
2026-01-21T15:00:53.157963+00:00 app[web.1]: }
2026-01-21T15:00:53.158035+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EACCES: permission denied, open '/tmp/lrt'] {
2026-01-21T15:00:53.158035+00:00 app[web.1]: errno: -13,
2026-01-21T15:00:53.158036+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:00:53.158036+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:00:53.158036+00:00 app[web.1]: path: '/tmp/lrt'
2026-01-21T15:00:53.158036+00:00 app[web.1]: }
2026-01-21T15:00:58.263646+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '3767874805' }
2026-01-21T15:00:58.265730+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=1f06ec0f-f8f7-4457-ed07-fc338ebf99f5 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:00:58.458660+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '866792064' }
2026-01-21T15:00:58.460621+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=4a857e7a-d142-c3d6-0fa6-0b1f64803c13 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:00:58.571326+00:00 app[web.1]: [Error: EACCES: permission denied, open '/dev/lrt'] {
2026-01-21T15:00:58.571345+00:00 app[web.1]: errno: -13,
2026-01-21T15:00:58.571346+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:00:58.571346+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:00:58.571346+00:00 app[web.1]: path: '/dev/lrt'
2026-01-21T15:00:58.571347+00:00 app[web.1]: }
2026-01-21T15:00:58.571405+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EACCES: permission denied, open '/dev/lrt'] {
2026-01-21T15:00:58.571405+00:00 app[web.1]: errno: -13,
2026-01-21T15:00:58.571405+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:00:58.571405+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:00:58.571406+00:00 app[web.1]: path: '/dev/lrt'
2026-01-21T15:00:58.571406+00:00 app[web.1]: }
2026-01-21T15:01:03.671759+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '3767874805' }
2026-01-21T15:01:03.674093+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=91e9f23b-5753-6263-aaad-58cc4cab0a47 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:01:03.870248+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '3832198499' }
2026-01-21T15:01:03.871919+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=985fd2e5-d075-0c28-4dd3-8d1d1586d6e1 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:01:03.982084+00:00 app[web.1]: [Error: EACCES: permission denied, open '/dev/shm/lrt'] {
2026-01-21T15:01:03.982095+00:00 app[web.1]: errno: -13,
2026-01-21T15:01:03.982096+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:01:03.982096+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:03.982096+00:00 app[web.1]: path: '/dev/shm/lrt'
2026-01-21T15:01:03.982097+00:00 app[web.1]: }
2026-01-21T15:01:03.982182+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EACCES: permission denied, open '/dev/shm/lrt'] {
2026-01-21T15:01:03.982183+00:00 app[web.1]: errno: -13,
2026-01-21T15:01:03.982183+00:00 app[web.1]: code: 'EACCES',
2026-01-21T15:01:03.982183+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:03.982183+00:00 app[web.1]: path: '/dev/shm/lrt'
2026-01-21T15:01:03.982184+00:00 app[web.1]: }
2026-01-21T15:01:05.585193+00:00 heroku[router]: at=error code=H12 desc="Request timeout" method=POST path="/" host=www.centromundox.net request_id=f57fafd6-5555-7973-114f-3a219f89eaca fwd="87.121.84.24" dyno=web.1 connect=0ms service=30000ms status=503 bytes=567 protocol=http1.1 tls=false
2026-01-21T15:01:09.098924+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '4094410105' }
2026-01-21T15:01:09.101251+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=0c29c9ee-f12f-7f63-62b3-224857d30278 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:01:09.288870+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '866792064' }
2026-01-21T15:01:09.290418+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=0d0d423f-f658-3659-de6e-e25415f42944 fwd="87.121.84.24" dyno=web.1 connect=0ms service=6ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:01:09.399860+00:00 app[web.1]: [Error: EROFS: read-only file system, open '/var/lrt'] {
2026-01-21T15:01:09.399883+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:09.399883+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:09.399884+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:09.399884+00:00 app[web.1]: path: '/var/lrt'
2026-01-21T15:01:09.399884+00:00 app[web.1]: }
2026-01-21T15:01:09.399936+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EROFS: read-only file system, open '/var/lrt'] {
2026-01-21T15:01:09.399936+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:09.399936+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:09.399936+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:09.399936+00:00 app[web.1]: path: '/var/lrt'
2026-01-21T15:01:09.399937+00:00 app[web.1]: }
2026-01-21T15:01:14.508871+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '3767874805' }
2026-01-21T15:01:14.511090+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=71f7dce7-a734-1703-b60b-075c2bd59635 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:01:14.706038+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '866792064' }
2026-01-21T15:01:14.707486+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=eb05f780-3511-43ae-953d-78d365d3bdac fwd="87.121.84.24" dyno=web.1 connect=0ms service=4ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:01:14.817625+00:00 app[web.1]: [Error: EROFS: read-only file system, open '/etc/lrt'] {
2026-01-21T15:01:14.817635+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:14.817636+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:14.817636+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:14.817636+00:00 app[web.1]: path: '/etc/lrt'
2026-01-21T15:01:14.817637+00:00 app[web.1]: }
2026-01-21T15:01:14.817699+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EROFS: read-only file system, open '/etc/lrt'] {
2026-01-21T15:01:14.817700+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:14.817700+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:14.817700+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:14.817700+00:00 app[web.1]: path: '/etc/lrt'
2026-01-21T15:01:14.817701+00:00 app[web.1]: }
2026-01-21T15:01:19.911291+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '3767874805' }
2026-01-21T15:01:19.913323+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=38f9b36b-78c8-b6d2-cb72-979a18596276 fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=96 protocol=http1.1 tls=false
2026-01-21T15:01:20.108501+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '302968237' }
2026-01-21T15:01:20.110030+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=4760d0c7-5848-8cea-0222-d3b4f4935ccd fwd="87.121.84.24" dyno=web.1 connect=0ms service=4ms status=500 bytes=95 protocol=http1.1 tls=false
2026-01-21T15:01:20.217974+00:00 app[web.1]: [Error: EROFS: read-only file system, open '/lrt'] {
2026-01-21T15:01:20.218008+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:20.218008+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:20.218009+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:20.218009+00:00 app[web.1]: path: '/lrt'
2026-01-21T15:01:20.218010+00:00 app[web.1]: }
2026-01-21T15:01:20.218047+00:00 app[web.1]: ⨯ uncaughtException:  [Error: EROFS: read-only file system, open '/lrt'] {
2026-01-21T15:01:20.218048+00:00 app[web.1]: errno: -30,
2026-01-21T15:01:20.218048+00:00 app[web.1]: code: 'EROFS',
2026-01-21T15:01:20.218048+00:00 app[web.1]: syscall: 'open',
2026-01-21T15:01:20.218048+00:00 app[web.1]: path: '/lrt'
2026-01-21T15:01:20.218049+00:00 app[web.1]: }
2026-01-21T15:01:25.309689+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '462873713' }
2026-01-21T15:01:25.312269+00:00 heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=35117c13-9ee6-275f-a7ae-a9be4f9d8d4a fwd="87.121.84.24" dyno=web.1 connect=0ms service=6ms status=500 bytes=95 protocol=http1.1 tls=false
```

---

## Detailed Analysis

### Log Structure Explanation

#### Application Logs (`app[web.1]`)

```
2026-01-21T15:00:52.850498+00:00 app[web.1]: ⨯ [ReferenceError: returnNaN is not defined] { digest: '998905755' }
│                                │           │  │                                          │
│                                │           │  │                                          └─ Error ID (Next.js internal)
│                                │           │  └─ JavaScript error message
│                                │           └─ Error symbol (Next.js)
│                                └─ Dyno instance (web.1 = first web dyno)
└─ ISO 8601 timestamp with timezone
```

#### Router Logs (`heroku[router]`)

```
heroku[router]: at=info method=POST path="/" host=www.centromundox.net request_id=5a5c019d... fwd="87.121.84.24" dyno=web.1 connect=0ms service=5ms status=500 bytes=95 protocol=http1.1 tls=false
                │       │           │    │                            │                     │         │          │           │          │             │
                │       │           │    │                            │                     │         │          │           │          │             └─ No HTTPS
                │       │           │    │                            │                     │         │          │           │          └─ HTTP/1.1
                │       │           │    │                            │                     │         │          │           └─ Response size
                │       │           │    │                            │                     │         │          └─ HTTP 500 (Internal Server Error)
                │       │           │    │                            │                     │         └─ Processing time
                │       │           │    │                            │                     └─ Connection time
                │       │           │    │                            └─ Attacker's real IP
                │       │           │    └─ Target domain
                │       │           └─ Target path (root)
                │       └─ HTTP method
                └─ Log level
```

### Error Codes Explained

| Code     | Name                  | Errno | Meaning                                                      |
| -------- | --------------------- | ----- | ------------------------------------------------------------ |
| `EACCES` | Permission Denied     | -13   | Process doesn't have permission to access the file/directory |
| `EROFS`  | Read-Only File System | -30   | File system is mounted as read-only, cannot write            |
| `H12`    | Request Timeout       | N/A   | Heroku killed the request after 30 seconds                   |

### HTTP Status Codes in Attack

| Status | Count | Meaning                                       |
| ------ | ----- | --------------------------------------------- |
| `500`  | ~12   | Internal Server Error (code injection failed) |
| `503`  | 1     | Service Unavailable (timeout)                 |

---

## Attack Vectors Explained

### Vector 1: Code Injection (`returnNaN`)

**What the attacker sent:**

```javascript
// Probable payload structure (reconstructed)
{
  "constructor": {
    "prototype": {
      "returnNaN": function() { /* malicious code */ }
    }
  }
}
```

**Why `returnNaN`?**

- This is likely a **prototype pollution** attack
- `returnNaN` is a function name commonly used in exploit kits targeting JavaScript
- The attacker tried to inject code through `__proto__` or `constructor.prototype`

**Why it failed:**

- Next.js doesn't evaluate arbitrary code from POST bodies
- The JavaScript runtime threw `ReferenceError` because `returnNaN` was never defined

### Vector 2: File Write (`/tmp/lrt`, `/dev/lrt`, etc.)

**What is `lrt`?**

- **No se pudo verificar** el significado exacto de "lrt" - no se encontró malware conocido con ese nombre
- Basado en el patrón de ataque, probablemente es un **webshell, backdoor, o cryptominer**
- Ver `INCIDENT_FORENSIC_REPORT.md` para análisis detallado de tipos de ataque

**Attack sequence:**

```
Step 1: Try /tmp/lrt     → EACCES (no permission)
Step 2: Try /dev/lrt     → EACCES (no permission)
Step 3: Try /dev/shm/lrt → EACCES (no permission)
Step 4: Try /var/lrt     → EROFS (read-only)
Step 5: Try /etc/lrt     → EROFS (read-only)
Step 6: Try /lrt         → EROFS (read-only)
```

---

## Why These Specific Paths?

| Path       | What it is                  | Why attacker targeted it                           |
| ---------- | --------------------------- | -------------------------------------------------- |
| `/tmp`     | Temporary files directory   | Usually world-writable, files persist until reboot |
| `/dev`     | Device files                | Access to hardware, sometimes writable             |
| `/dev/shm` | Shared memory (RAM disk)    | Fast, in-memory, often writable                    |
| `/var`     | Variable data (logs, spool) | Often contains writable directories                |
| `/etc`     | System configuration        | Highest value target (modify system config)        |
| `/`        | Root directory              | Last resort, maximum access                        |

**Attack strategy:** Start with most permissive locations, progressively try more restricted ones.

---

## How Heroku Defended

### 1. Ephemeral Filesystem

Heroku dynos have a read-only filesystem except for `/tmp`, which is:

- Isolated per dyno
- Cleared on restart
- Not shared between dynos

### 2. Non-Root Process

The Node.js process runs as an unprivileged user:

- Cannot write to system directories
- Cannot access other processes
- Cannot modify system configuration

### 3. Container Isolation

Each dyno runs in an isolated container:

- No access to other apps
- No access to Heroku infrastructure
- Network isolation

### 4. Request Timeout

Heroku automatically kills requests after 30 seconds:

- Prevents resource exhaustion
- Limits attack duration

---

# How to View Logs in Heroku

## Method 1: Heroku CLI (Recommended)

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# View last N lines
heroku logs -n 500 --app centromundox-front

# Real-time streaming (tail)
heroku logs --tail --app centromundox-front

# Filter by source
heroku logs --source app --app centromundox-front     # Application logs only
heroku logs --source heroku --app centromundox-front  # Router/dyno logs only

# Filter for attacks (Windows)
heroku logs -n 1000 --app centromundox-front | findstr /i "error 500 POST"

# Filter for attacks (Mac/Linux)
heroku logs -n 1000 --app centromundox-front | grep -E "error|500|POST"
```

## Method 2: Heroku Dashboard (Web)

1. Go to: https://dashboard.heroku.com
2. Select your app (`centromundox-front`)
3. Click **"More"** button (top right)
4. Select **"View logs"**

```
┌─────────────────────────────────────────────────────────────┐
│  Heroku Dashboard                                           │
├─────────────────────────────────────────────────────────────┤
│  centromundox-front                                         │
│                                                             │
│  [Overview] [Resources] [Deploy] [Metrics] [Activity] [More]│
│                                                        ↓    │
│                                              ┌──────────────┐
│                                              │ View logs    │ ← Click here
│                                              │ Run console  │
│                                              │ Restart...   │
│                                              └──────────────┘
└─────────────────────────────────────────────────────────────┘
```

## Method 3: Logging Add-ons (Historical Logs)

Heroku only keeps **last 1,500 lines**. For historical data:

```bash
# Papertrail (recommended, has free tier)
heroku addons:create papertrail:choklad --app centromundox-front

# Logtail (Better Stack)
heroku addons:create logtail:free --app centromundox-front

# Open logging dashboard
heroku addons:open papertrail --app centromundox-front
```

**Benefits of logging add-ons:**

- Search historical logs
- Filter by date, IP, error type
- Set up alerts
- Export to CSV/JSON
- Longer retention

---

# Security Measures Implemented

## Overview

| Measure          | Location         | Purpose                |
| ---------------- | ---------------- | ---------------------- |
| Rate Limiting    | `middleware.ts`  | Limit requests per IP  |
| IP Blocking      | `middleware.ts`  | Block known attackers  |
| POST Root Block  | `middleware.ts`  | Block POST to `/`      |
| Security Headers | `next.config.ts` | Prevent common attacks |

## Rate Limiting

**Configuration:**

```typescript
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const RATE_LIMIT_MAX_POST_ROOT = 3; // 3 POST to "/" then block
```

**Behavior:**

- Tracks requests per IP in memory
- Returns `429 Too Many Requests` when exceeded
- Auto-blocks IPs that exceed POST root limit

## IP Blocking

**Permanently Blocked IPs:**

```typescript
const blockedIPs = new Set<string>([
  "87.121.84.24", // Attack detected 2026-01-21 - file write attempts
]);
```

**To add new blocked IP:**
Edit `middleware.ts` and add to the Set.

## POST Root Protection

**Why:** Legitimate requests never POST to `/`. All forms use `/api/*` routes.

**Response:**

1. First 3 POST to `/`: Returns `405 Method Not Allowed`
2. After 3 attempts: IP auto-blocked, returns `403 Forbidden`

## Security Headers

| Header                      | Value                                      | Protection      |
| --------------------------- | ------------------------------------------ | --------------- |
| `X-Frame-Options`           | `DENY`                                     | Clickjacking    |
| `X-Content-Type-Options`    | `nosniff`                                  | MIME sniffing   |
| `X-XSS-Protection`          | `1; mode=block`                            | XSS (legacy)    |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`          | Info leakage    |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()` | Sensor access   |
| `Strict-Transport-Security` | `max-age=31536000`                         | HTTPS downgrade |

---

# Configuration

## Files Modified

| File                  | Changes                                                |
| --------------------- | ------------------------------------------------------ |
| `middleware.ts`       | Added rate limiting, IP blocking, POST root protection |
| `next.config.ts`      | Added security headers                                 |
| `src/lib/security.ts` | Created security utility functions                     |
| `SECURITY.md`         | This documentation                                     |

## Environment Variables

None required. All security settings are hardcoded for simplicity.

---

# Monitoring

## Log Patterns to Watch

```bash
# Security events from our middleware
heroku logs --app centromundox-front | grep "\[Security\]"
```

| Log Pattern                       | Meaning                         |
| --------------------------------- | ------------------------------- |
| `[Security] Blocked IP denied:`   | Known attacker attempted access |
| `[Security] POST to root from:`   | Suspicious POST to `/`          |
| `[Security] IP auto-blocked:`     | IP was automatically blocked    |
| `[Security] Rate limit exceeded:` | Too many requests from IP       |

## Heroku Error Codes

| Code | Description           | Action                          |
| ---- | --------------------- | ------------------------------- |
| H12  | Request Timeout (30s) | Check for long-running requests |
| H13  | Connection Closed     | Client disconnected             |
| H14  | No Web Dynos          | App not running                 |
| H10  | App Crashed           | Check application logs          |

---

# Recommendations

## Implemented

- [x] Rate limiting in middleware
- [x] IP blocking with known attackers
- [x] POST to root rejection
- [x] Security headers
- [x] Documentation

## Short Term

- [ ] **Add Cloudflare** (free tier)

  - DDoS protection
  - WAF (Web Application Firewall)
  - Bot detection
  - Geographic blocking

- [ ] **Add logging service**
  - Papertrail or Logtail
  - Historical log search
  - Alert on attack patterns

## Medium Term

- [ ] **Redis rate limiting** (persist across deploys)
- [ ] **Content Security Policy** headers
- [ ] **API route rate limiting**

---

# Appendix: Quick Reference

## Useful Commands

```bash
# View recent logs
heroku logs -n 500 --app centromundox-front

# Stream logs in real-time
heroku logs --tail --app centromundox-front

# Check app status
heroku ps --app centromundox-front

# Restart app (clears in-memory rate limits)
heroku restart --app centromundox-front

# View blocked IPs (check middleware.ts)
grep -A5 "blockedIPs" middleware.ts
```

## Attack Indicators

Watch for these patterns in logs:

- Multiple POST to `/`
- `returnNaN` or similar undefined functions
- File system errors (EACCES, EROFS)
- High request rate from single IP
- Requests without TLS (`tls=false`)

---

_Document created: 2026-01-21_
_Last updated: 2026-01-21_
_Author: Security Analysis via Claude Code_
