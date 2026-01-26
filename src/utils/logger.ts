/* eslint-disable import/order */
/**
 * Logging utilities for Calendar Card Pro
 * Modified for Gauge Card Pro
 * Provides consistent log formatting, level-based filtering, and error handling
 */

import { LOGGER_SETTINGS } from "../card/const";

export type Logger = {
  setLogLevel(level: LogLevel): void;
  getLogLevelName(): void;
  debug(msg: string, ...data: unknown[]): void;
  info(msg: string, ...data: unknown[]): void;
  warn(msg: string, ...data: unknown[]): void;
  error(msgOrErr: unknown, context?: unknown, ...data: unknown[]): void;
};

// Add a flag to ensure the banner only shows once per session
let BANNER_SHOWN = false;

// Different log levels - keeping enum in logger-utils.ts
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Styling for log messages - keeping in logger-utils.ts
const LOG_STYLES = {
  // Title pill (left side - dark grey with emoji)
  title: [
    "background: #424242",
    "color: white",
    "display: inline-block",
    "line-height: 20px",
    "text-align: center",
    "border-radius: 5px 0 0 5px",
    "font-size: 12px",
    "font-weight: bold",
    "padding: 4px 8px 4px 12px",
    "margin: 5px 0",
  ].join(";"),

  // Version pill (right side - pale blue)
  version: [
    "background: #4fc3f7",
    "color: white",
    "display: inline-block",
    "line-height: 20px",
    "text-align: center",
    "border-radius: 0 5px 5px 0",
    "font-size: 12px",
    "font-weight: bold",
    "padding: 4px 12px 4px 8px",
    "margin: 5px 0",
  ].join(";"),

  // Standard prefix (non-pill version for regular logs)
  prefix: ["color: #4fc3f7", "font-weight: bold"].join(";"),

  // Error styling
  error: ["color: #f44336", "font-weight: bold"].join(";"),

  // Warning styling
  warn: ["color: #ff9800", "font-weight: bold"].join(";"),
};

//-----------------------------------------------------------------------------
// INITIALIZATION FUNCTIONS
//-----------------------------------------------------------------------------

/**
 * Initialize the logger with the component version
 * @param version Current component version
 */
export function initializeLogger(version: string): void {
  // Show version banner (always show this regardless of log level)
  printVersionBanner(version);
}

/**
 * Print the welcome banner with version info
 * @param version Component version
 */
export function printVersionBanner(version: string): void {
  // Only show banner once per browser session
  if (BANNER_SHOWN) return;

  console.groupCollapsed(
    `%c${LOGGER_SETTINGS.PREFIX}%cv${version}`,
    LOG_STYLES.title,
    LOG_STYLES.version
  );
  console.log(
    "%c Description: %c Build beautiful Gauge cards using 🌈 gradients and 🛠️ templates.  ",
    "font-weight: bold",
    "font-weight: normal"
  );
  console.log(
    "%c GitHub: %c https://github.com/benjamin-dcs/gauge-card-pro ",
    "font-weight: bold",
    "font-weight: normal"
  );
  console.groupEnd();

  // Mark banner as shown
  BANNER_SHOWN = true;
}

export function createLogger(level?: LogLevel) {
  let currentLogLevel = level ?? LOGGER_SETTINGS.DEFAULT_LOG_LEVEL;

  // Added for Gauge Card Pro
  const SetLogLevel = (level: LogLevel) => {
    currentLogLevel = level;
  };

  const getLogLevelName = () => {
    return LogLevel[currentLogLevel].toLowerCase();
  };

  //-----------------------------------------------------------------------------
  // PRIMARY PUBLIC API FUNCTIONS
  //-----------------------------------------------------------------------------

  /**
   * Enhanced error logging that handles different error types and contexts
   * Consolidates error, logError and handleApiError into a single flexible function
   *
   * @param messageOrError - Error object, message string, or other value
   * @param context - Optional context (string, object, or unknown)
   * @param data - Additional data to include in the log
   */
  const error = (
    messageOrError: string | Error | unknown,
    context?: string | Record<string, unknown> | unknown,
    ...data: unknown[]
  ) => {
    if (currentLogLevel < LogLevel.ERROR) return;

    // Convert unknown context to a safe format
    const safeContext = formatUnknownContext(context);

    // Process based on error type and context type
    if (messageOrError instanceof Error) {
      // Case 1: Error object
      const errorMessage = messageOrError.message || "Unknown error";
      const contextInfo =
        typeof safeContext === "string" ? ` during ${safeContext}` : "";
      const [formattedMsg, style] = formatLogMessage(
        `Error${contextInfo}: ${errorMessage}`,
        LOG_STYLES.error
      );

      console.error(formattedMsg, style);

      // Always log stack trace for Error objects
      if (messageOrError.stack) {
        console.error(messageOrError.stack);
      }

      // Add context object if provided
      if (safeContext && typeof safeContext === "object") {
        console.error("Context:", {
          ...safeContext,
          timestamp: new Date().toISOString(),
        });
      }

      // Include any additional data
      if (data.length > 0) {
        console.error("Additional data:", ...data);
      }
    } else if (typeof messageOrError === "string") {
      // Case 2: String message
      const contextInfo =
        typeof safeContext === "string" ? ` during ${safeContext}` : "";
      const [formattedMsg, style] = formatLogMessage(
        `${messageOrError}${contextInfo}`,
        LOG_STYLES.error
      );

      if (safeContext && typeof safeContext === "object") {
        // If context is an object, include it in the log
        console.error(formattedMsg, style, {
          context: {
            ...safeContext,
            timestamp: new Date().toISOString(),
          },
          ...(data.length > 0 ? { additionalData: data } : {}),
        });
      } else if (data.length > 0) {
        // Just include additional data
        console.error(formattedMsg, style, ...data);
      } else {
        // Simple error message
        console.error(formattedMsg, style);
      }
    } else {
      // Case 3: Unknown error type
      const contextInfo =
        typeof safeContext === "string" ? ` during ${safeContext}` : "";
      const [formattedMsg, style] = formatLogMessage(
        `Unknown error${contextInfo}:`,
        LOG_STYLES.error
      );

      console.error(formattedMsg, style, messageOrError);

      // Add context object if provided
      if (safeContext && typeof safeContext === "object") {
        console.error("Context:", {
          ...safeContext,
          timestamp: new Date().toISOString(),
        });
      }

      // Include any additional data
      if (data.length > 0) {
        console.error("Additional data:", ...data);
      }
    }
  };

  /**
   * Log a warning message
   */
  const warn = (message: string, ...data: unknown[]) => {
    simpleLog(
      LogLevel.WARN,
      `[warn] ${message}`,
      LOG_STYLES.warn,
      console.warn,
      ...data
    );
  };

  /**
   * Log an info message
   */
  const info = (message: string, ...data: unknown[]) => {
    simpleLog(
      LogLevel.INFO,
      `[info] ${message}`,
      LOG_STYLES.prefix,
      console.log,
      ...data
    );
  };

  /**
   * Log a debug message
   */
  const debug = (message: string, ...data: unknown[]) => {
    simpleLog(
      LogLevel.DEBUG,
      `[debug] ${message}`,
      LOG_STYLES.prefix,
      console.log,
      ...data
    );
  };

  //-----------------------------------------------------------------------------
  // INTERNAL HELPER FUNCTIONS
  //-----------------------------------------------------------------------------

  /**
   * Internal helper for basic log levels (warn, info, debug)
   * @param level - Log level for filtering
   * @param message - Message to log
   * @param style - Style to apply to the message
   * @param consoleMethod - Console method to use
   * @param data - Additional data to log
   */
  function simpleLog(
    level: LogLevel,
    message: string,
    style: string,
    consoleMethod: (...args: unknown[]) => void,
    ...data: unknown[]
  ): void {
    if (currentLogLevel < level) return;

    const [formattedMsg, styleArg] = formatLogMessage(message, style);
    if (data.length > 0) {
      consoleMethod(formattedMsg, styleArg, ...data);
    } else {
      consoleMethod(formattedMsg, styleArg);
    }
  }

  /**
   * Format a log message with consistent prefix and styling
   * @param message The message to format
   * @param style The style to apply
   * @returns Tuple of [formattedMessage, style] for console methods
   */
  function formatLogMessage(message: string, style: string): [string, string] {
    return [`%c[${LOGGER_SETTINGS.PREFIX}] ${message}`, style];
  }

  /**
   * Process unknown context into a usable format for logging
   * @param context - Any context value that might be provided
   * @returns A string, object, or undefined that can be safely used in logs
   */
  function formatUnknownContext(
    context: unknown
  ): string | Record<string, unknown> | undefined {
    if (context === undefined || context === null) {
      return undefined;
    }

    if (typeof context === "string") {
      return context;
    }

    if (typeof context === "object") {
      try {
        // Try to safely convert to Record<string, unknown>
        return { ...(context as Record<string, unknown>) };
      } catch {
        // If conversion fails, stringify it
        try {
          return { value: JSON.stringify(context) };
        } catch {
          return { value: String(context) };
        }
      }
    }

    // For primitive values, just convert to string
    return String(context);
  }

  return { SetLogLevel, getLogLevelName, info, debug, warn, error };
}
