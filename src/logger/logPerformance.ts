import { createLogger } from "./createLogger";

const map: {
  [key: string]: {
    start: Date;
    current?: Date;
  };
} = {};

/**
 * Log performance
 * @param key performance logs with the same keys are grouped together
 * @param step Optional, the step to log. Creates a log in the format like "step took ? ms".
 * Leave empty for initial count
 */
export function logPerformance(key: string, step?: string) {
  const { logInfo } = createLogger(`performance (${key})`);
  if (map[key] == null) {
    map[key] = {
      start: new Date(),
    };
  }
  if (step != null) {
    const data = map[key];
    const elapsed =
      new Date().getTime() - (data.current ?? data.start).getTime();
    const total = new Date().getTime() - data.start.getTime();
    logInfo(`"${step}" [took=${elapsed}ms] [total=${total}ms]`);
    data.current = new Date();
  }
}
