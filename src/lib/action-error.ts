import "server-only";

/**
 * Server actions that throw return an opaque 500 to the browser (React error #441),
 * which makes production problems impossible to diagnose. Every action wraps its work
 * in this helper instead: the error is logged server-side and a readable message is
 * returned to the (already authenticated) admin UI.
 */
export async function guard<T>(label: string, fn: () => Promise<T>, fallback: (message: string) => T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[action:${label}]`, err);
    if (message === "Unauthorized") return fallback("Your session has expired. Reload the page and sign in again.");
    if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ServerSelection|topology|querySrv/i.test(message)) {
      return fallback("Can't reach the database. Check MONGODB_URI and that this server's IP is allowed in MongoDB Atlas → Network Access.");
    }
    if (/Missing required environment variable: (\w+)/.test(message)) {
      return fallback(`${message}. Add it in your hosting provider's environment variables and redeploy.`);
    }
    return fallback(`${label} failed: ${message}`);
  }
}
