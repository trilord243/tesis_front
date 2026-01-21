/**
 * Security utilities for rate limiting and IP blocking
 */

// In-memory store for rate limiting (resets on deploy/restart)
// For production, consider using Redis or similar
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Blocked IPs - add known malicious IPs here
const blockedIPs = new Set<string>([
  "87.121.84.24", // Detected attack on 2026-01-21
]);

// Suspicious patterns in request body that indicate attacks
const SUSPICIOUS_PATTERNS = [
  /returnNaN/i,
  /eval\s*\(/i,
  /Function\s*\(/i,
  /__proto__/i,
  /constructor\s*\[/i,
  /\$\{.*\}/,
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
];

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // max requests per window
const RATE_LIMIT_MAX_POST_ROOT = 5; // max POST to root per window (should be 0 normally)

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  statusCode?: number;
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Check common headers for real IP (when behind proxy/load balancer)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, first one is the client
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  // Heroku specific
  const herokuIP = request.headers.get("x-forwarded-for");
  if (herokuIP) {
    return herokuIP.split(",")[0]?.trim() ?? "unknown";
  }

  return "unknown";
}

/**
 * Check if IP is blocked
 */
export function isIPBlocked(ip: string): boolean {
  return blockedIPs.has(ip);
}

/**
 * Add IP to block list (runtime only, resets on restart)
 */
export function blockIP(ip: string): void {
  blockedIPs.add(ip);
  console.log(`[Security] Blocked IP: ${ip}`);
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  ip: string,
  key: string = "global",
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS
): SecurityCheckResult {
  const now = Date.now();
  const storeKey = `${ip}:${key}`;
  const record = rateLimitStore.get(storeKey);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(storeKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }

  record.count++;

  if (record.count > maxRequests) {
    console.log(
      `[Security] Rate limit exceeded for ${ip} on ${key}: ${record.count}/${maxRequests}`
    );
    return {
      allowed: false,
      reason: "Too many requests",
      statusCode: 429,
    };
  }

  return { allowed: true };
}

/**
 * Check request body for suspicious patterns
 */
export function checkSuspiciousContent(body: string): SecurityCheckResult {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(body)) {
      console.log(`[Security] Suspicious pattern detected: ${pattern}`);
      return {
        allowed: false,
        reason: "Suspicious content detected",
        statusCode: 400,
      };
    }
  }
  return { allowed: true };
}

/**
 * Comprehensive security check for incoming requests
 */
export async function performSecurityCheck(
  request: Request,
  options: {
    checkRateLimit?: boolean;
    checkBody?: boolean;
    rateLimitKey?: string;
    maxRequests?: number;
  } = {}
): Promise<SecurityCheckResult> {
  const {
    checkRateLimit: doRateLimit = true,
    checkBody = false,
    rateLimitKey = "global",
    maxRequests = RATE_LIMIT_MAX_REQUESTS,
  } = options;

  const ip = getClientIP(request);

  // 1. Check if IP is blocked
  if (isIPBlocked(ip)) {
    console.log(`[Security] Blocked IP attempted access: ${ip}`);
    return {
      allowed: false,
      reason: "Access denied",
      statusCode: 403,
    };
  }

  // 2. Rate limiting
  if (doRateLimit) {
    const rateLimitResult = checkRateLimit(ip, rateLimitKey, maxRequests);
    if (!rateLimitResult.allowed) {
      return rateLimitResult;
    }
  }

  // 3. Check body for suspicious content (only if requested and body exists)
  if (checkBody && request.method === "POST") {
    try {
      const clonedRequest = request.clone();
      const body = await clonedRequest.text();
      if (body) {
        const bodyCheck = checkSuspiciousContent(body);
        if (!bodyCheck.allowed) {
          // Auto-block IP after suspicious content detected
          blockIP(ip);
          return bodyCheck;
        }
      }
    } catch {
      // Body read failed, continue
    }
  }

  return { allowed: true };
}

/**
 * Check specifically for root POST attacks (like the ones detected)
 */
export function checkRootPostAttack(
  request: Request,
  pathname: string
): SecurityCheckResult {
  // POST to root "/" is almost always an attack - legitimate forms go to /api/*
  if (request.method === "POST" && pathname === "/") {
    const ip = getClientIP(request);
    console.log(`[Security] Suspicious POST to root from IP: ${ip}`);

    // Rate limit very strictly for POST to root
    const rateLimitResult = checkRateLimit(
      ip,
      "post-root",
      RATE_LIMIT_MAX_POST_ROOT
    );
    if (!rateLimitResult.allowed) {
      // Auto-block after repeated POST to root
      blockIP(ip);
      return {
        allowed: false,
        reason: "Forbidden",
        statusCode: 403,
      };
    }

    return {
      allowed: false,
      reason: "Method not allowed",
      statusCode: 405,
    };
  }

  return { allowed: true };
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`[Security] Cleaned ${cleaned} expired rate limit records`);
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
