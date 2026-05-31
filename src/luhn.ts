/** Luhn (mod-10) algorithm — the check used by credit cards, IMEIs and more. */

const digits = (input: string): number[] =>
  input.replace(/\D/g, "").split("").map(Number);

/** Is `input` Luhn-valid (digits + trailing check digit)? */
export function isValid(input: string): boolean {
  const d = digits(input);
  if (d.length < 2) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d[i] as number;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** The Luhn check digit (0–9) for a number that does *not* yet include one. */
export function checkDigit(partial: string): number {
  const d = digits(partial);
  let sum = 0;
  let alt = true; // the (future) check digit sits at an un-doubled position
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d[i] as number;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

/** Append the correct Luhn check digit to `partial`. */
export function complete(partial: string): string {
  return partial.replace(/\D/g, "") + checkDigit(partial);
}

/** Generate a random Luhn-valid number of `length` digits. */
export function generate(length = 16): string {
  if (length < 2) throw new RangeError("checkdigit: Luhn length must be at least 2");
  let body = "";
  for (let i = 0; i < length - 1; i++) body += Math.floor(Math.random() * 10);
  return complete(body);
}
