import _ from "lodash";

export function ensureString(value: any) {
  if (value == null) {
    return undefined;
  }
  return _.isString(value) ? value : undefined;
}
