export interface TokenStore {
  setToken(token: string): void;
  getToken(): string;
  shouldRefreshToken(): boolean;
  getRefreshToken(): string;
}
