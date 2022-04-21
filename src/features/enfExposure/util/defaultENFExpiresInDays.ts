export const defaultENFExpiresInDays = (
  alertExpiresIndays: number | undefined,
) => {
  return alertExpiresIndays ?? 14;
};
