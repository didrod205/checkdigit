/** IBAN validation & check-digit computation (ISO 13616, mod-97-10). */

const clean = (input: string): string => input.replace(/[\s]/g, "").toUpperCase();

/** Convert letters → numbers (A=10 … Z=35) and take mod 97. */
function mod97(rearranged: string): number {
  let numeric = "";
  for (const ch of rearranged) {
    const c = ch.charCodeAt(0);
    if (c >= 48 && c <= 57) numeric += ch;
    else if (c >= 65 && c <= 90) numeric += (c - 55).toString();
    else return -1; // invalid character
  }
  return Number(BigInt(numeric) % 97n);
}

/** Is this a structurally valid IBAN (mod-97 == 1)? */
export function isValid(input: string): boolean {
  const s = clean(input);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  return mod97(s.slice(4) + s.slice(0, 4)) === 1;
}

/** Compute the 2-digit IBAN check for a country + BBAN. */
export function checkDigit(country: string, bban: string): string {
  const c = country.toUpperCase();
  const b = bban.replace(/\s/g, "").toUpperCase();
  const remainder = mod97(`${b}${c}00`);
  return String(98 - remainder).padStart(2, "0");
}

/** Format an IBAN in groups of four. */
export function format(input: string): string {
  return clean(input).replace(/(.{4})/g, "$1 ").trim();
}

/** The 2-letter country code, or `null`. */
export function country(input: string): string | null {
  const m = /^([A-Z]{2})/.exec(clean(input));
  return m ? (m[1] as string) : null;
}
