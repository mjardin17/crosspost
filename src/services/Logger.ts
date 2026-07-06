/**
 * Centralized Client-Side Logging Service
 * Handles console output and ships logs to the SQLite system_logs table via /api/system/logs
 */

export class Logger {
  public static async sendLog(
    level: "INFO" | "WARN" | "ERROR" | "DEBUG",
    module: string,
    message: string,
    details?: string
  ) {
    // Always fallback to standard console logging
    const consoleMsg = `[${level}] [${module}] ${message}`;
    if (level === "ERROR") {
      console.error(consoleMsg, details || "");
    } else if (level === "WARN") {
      console.warn(consoleMsg, details || "");
    } else if (level === "DEBUG") {
      console.debug(consoleMsg, details || "");
    } else {
      console.log(consoleMsg, details || "");
    }

    try {
      const response = await fetch("/api/system/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level,
          module,
          message,
          details: details || "",
        }),
      });
      
      if (!response.ok) {
        // Fallback or silent fail to prevent infinite loop of log failures
        const errorText = await response.text();
        console.warn(`[Logger] Failed to persist log on server: ${errorText}`);
      }
    } catch (err) {
      console.warn("[Logger] Network error while trying to persist log on server:", err);
    }
  }

  public static async info(module: string, message: string, details?: string) {
    await this.sendLog("INFO", module, message, details);
  }

  public static async warn(module: string, message: string, details?: string) {
    await this.sendLog("WARN", module, message, details);
  }

  public static async error(module: string, message: string, details?: string) {
    await this.sendLog("ERROR", module, message, details);
  }

  public static async debug(module: string, message: string, details?: string) {
    await this.sendLog("DEBUG", module, message, details);
  }
}
