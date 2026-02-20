import { version } from "../../package.json";

export const VERSION = version;

export const LOGGER_SETTINGS = {
  /**
   * Current log level
   * 0 = ERROR, 1 = WARN, 2 = INFO, 3 = DEBUG
   */
  DEFAULT_LOG_LEVEL: 1,

  /** Standard prefix for log messages */
  PREFIX: "🌈 Gauge Card Pro",
};
