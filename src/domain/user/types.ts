export interface UserState {
  byId: { [id: string]: User };
  anonymousUserId?: string;
  setAlias: {
    pending: boolean;
    error?: Error;
  };
  setNHI: {
    pending: boolean;
    error?: Error;
    fulfilled: boolean;
  };
}

export interface User {
  id: string;
  nhi?: string;
  isAnonymous?: boolean;
  alias?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
