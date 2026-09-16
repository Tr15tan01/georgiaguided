import { existsSync } from "node:fs";

/** Load .env.local then .env (Node 20.12+/22 built-in), without overriding real env vars. */
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    try {
      process.loadEnvFile(file);
    } catch (err) {
      console.warn(`Could not read ${file}:`, (err as Error).message);
    }
  }
}
