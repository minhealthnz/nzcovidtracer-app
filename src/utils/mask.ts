export function maskToken(value: string | undefined) {
  if (!value) {
    return "";
  }
  return "*****" + value.substring(value.length - 6);
}

export function maskUrl(value: string | undefined) {
  if (!value) {
    return "";
  }
  const schemaLength = 8;
  const numCharToMask = 6;

  return (
    value.substring(0, schemaLength) +
    "******" +
    value.substring(schemaLength + numCharToMask)
  );
}
