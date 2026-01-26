import { vi } from "vitest";
import type { Logger } from "../utils/logger";

export function createMockLogger(overrides: Partial<Logger> = {}): Logger {
  return {
    setLogLevel: vi.fn(),
    getLogLevelName: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    ...overrides,
  };
}
