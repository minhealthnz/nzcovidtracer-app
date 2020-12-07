import _ from "lodash";

export function debounce(fn: (...args: any) => any) {
  return _.debounce(fn, 500, {
    leading: true,
    trailing: false,
  });
}
