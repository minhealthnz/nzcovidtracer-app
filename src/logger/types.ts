export type level = "error" | "warn" | "info";

export interface Transport {
  log(level: string, name: string, message: string): void;
}
