/** GTIN barcode check digits: EAN-13, EAN-8 and UPC-A. */

export type BarcodeType = "ean13" | "ean8" | "upca";

const LENGTHS: Record<BarcodeType, number> = { ean13: 13, ean8: 8, upca: 12 };

const digits = (input: string): number[] => input.replace(/\D/g, "").split("").map(Number);

/** Compute the GTIN check digit for the body (everything but the last digit). */
export function checkDigit(body: string, type: BarcodeType): number {
  const d = digits(body).slice(0, LENGTHS[type] - 1);
  // EAN-13 weights odd positions (1-indexed) by 1; EAN-8/UPC-A start the ×3 weight first.
  const startWeight3 = type !== "ean13";
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    const w = i % 2 === 0 ? (startWeight3 ? 3 : 1) : startWeight3 ? 1 : 3;
    sum += (d[i] as number) * w;
  }
  return (10 - (sum % 10)) % 10;
}

function detectType(n: string): BarcodeType | null {
  if (n.length === 13) return "ean13";
  if (n.length === 12) return "upca";
  if (n.length === 8) return "ean8";
  return null;
}

/** Validate an EAN-13 / EAN-8 / UPC-A barcode. */
export function isValid(input: string): boolean {
  const n = input.replace(/\D/g, "");
  const type = detectType(n);
  if (!type) return false;
  return checkDigit(n, type) === Number(n[n.length - 1]);
}

/** Generate a random valid barcode of the given type. */
export function generate(type: BarcodeType = "ean13"): string {
  let body = "";
  for (let i = 0; i < LENGTHS[type] - 1; i++) body += Math.floor(Math.random() * 10);
  return body + checkDigit(body, type);
}
