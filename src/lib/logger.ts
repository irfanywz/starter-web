import { idb } from "@/lib/idb";

/**
 * Log aplikasi disimpan di IndexedDB (maksimal 300 entri terakhir).
 * User bisa mengunduh log sebagai file .txt dari halaman Pengaturan.
 */
export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  time: string;
  level: LogLevel;
  message: string;
  detail?: string;
}

const LOG_KEY = "app-logs";
const MAX_ENTRIES = 300;

// Antrean tulis supaya beberapa log yang datang bersamaan tidak saling menimpa
let pending: Promise<void> = Promise.resolve();

function write(entry: LogEntry) {
  pending = pending
    .then(async () => {
      const logs = (await idb.get<LogEntry[]>(LOG_KEY)) ?? [];
      logs.push(entry);
      await idb.set(LOG_KEY, logs.slice(-MAX_ENTRIES));
    })
    .catch((err) => console.error("Gagal menulis log:", err));
}

function record(level: LogLevel, message: string, detail?: string) {
  write({ time: new Date().toISOString(), level, message, detail });
}

export const logger = {
  info: (message: string, detail?: string) => record("info", message, detail),
  warn: (message: string, detail?: string) => record("warn", message, detail),
  error: (message: string, detail?: string) => record("error", message, detail),
};

/** Menunggu semua log yang sedang antre selesai ditulis. */
export function flushLogs(): Promise<void> {
  return pending;
}

export async function getLogs(): Promise<LogEntry[]> {
  await pending;
  return (await idb.get<LogEntry[]>(LOG_KEY)) ?? [];
}

export async function clearLogs(): Promise<void> {
  await pending;
  await idb.del(LOG_KEY);
}

export function formatLogs(logs: LogEntry[]): string {
  return logs
    .map(
      (l) => `[${l.time}] ${l.level.toUpperCase()} ${l.message}${l.detail ? `\n${l.detail}` : ""}`,
    )
    .join("\n");
}

/** Mencatat error yang tidak ditangkap oleh komponen mana pun. */
export function installGlobalErrorHandlers() {
  window.addEventListener("error", (event) => {
    logger.error("Uncaught error", event.error?.stack ?? event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    logger.error("Unhandled rejection", String(event.reason?.stack ?? event.reason));
  });
}
