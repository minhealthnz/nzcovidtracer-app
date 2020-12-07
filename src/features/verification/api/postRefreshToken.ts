import { AxiosResponse } from "axios";

import { UnauthenticatedENFClient } from "./client";

/**
 * Get a new token
 * @param refToken refresh token (from PUT /register)
 */

export function postRefreshToken(
  refToken: string,
): Promise<AxiosResponse<{ token: string }>> {
  return UnauthenticatedENFClient.post(
    "/refresh",
    {},
    { headers: { Authorization: `Bearer ${refToken}` } },
  );
}
