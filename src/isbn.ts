/** ISBN-10 / ISBN-13 validation, check digits, and conversion. */

const clean = (input: string): string => input.replace(/[\s-]/g, "").toUpperCase();

/** ISBN-10 check character (`"0"`–`"9"` or `"X"`) for the first 9 digits. */
export function checkDigit10(first9: string): string {
  const d = clean(first9).slice(0, 9).split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (d[i] as number) * (10 - i);
  const c = (11 - (sum % 11)) % 11;
  return c === 10 ? "X" : String(c);
}

/** ISBN-13 check digit (`0`–`9`) for the first 12 digits. */
export function checkDigit13(first12: string): number {
  const d = clean(first12).slice(0, 12).split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (d[i] as number) * (i % 2 === 0 ? 1 : 3);
  return (10 - (sum % 10)) % 10;
}

export function isValidISBN10(input: string): boolean {
  const s = clean(input);
  if (!/^\d{9}[\dX]$/.test(s)) return false;
  return checkDigit10(s) === s[9];
}

export function isValidISBN13(input: string): boolean {
  const s = clean(input);
  if (!/^\d{13}$/.test(s) || !/^97[89]/.test(s)) return false;
  return checkDigit13(s) === Number(s[12]);
}

/** Validate either ISBN-10 or ISBN-13. */
export function isValid(input: string): boolean {
  return isValidISBN10(input) || isValidISBN13(input);
}

/** Convert ISBN-10 → ISBN-13 (978 prefix). */
export function to13(isbn10: string): string {
  const s = clean(isbn10);
  if (!/^\d{9}[\dX]$/.test(s)) throw new TypeError("checkdigit: not an ISBN-10");
  const core = "978" + s.slice(0, 9);
  return core + checkDigit13(core);
}

/** Convert a 978-prefixed ISBN-13 → ISBN-10. */
export function to10(isbn13: string): string {
  const s = clean(isbn13);
  if (!/^978\d{10}$/.test(s)) throw new TypeError("checkdigit: only 978-prefixed ISBN-13 convert to ISBN-10");
  const core = s.slice(3, 12);
  return core + checkDigit10(core);
}
