/* 
  Convert number to absolute number.
  If value has any digit included and has length greater than 4, put comma to every thrid digit.
*/
export function formatToLocaleString(value: number | string) {
  const text = typeof value === "string" ? value : Math.abs(value).toString();

  return text.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //Regex for Comma Seperated Number
}
