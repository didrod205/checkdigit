/**
 * checkdigit — validate and generate checksummed identifiers (credit cards,
 * IBANs, ISBNs, barcodes) with their exact check-digit math. Deterministic,
 * dependency-free, 100% local.
 */

import * as luhn from "./luhn.js";
import * as creditCard from "./creditcard.js";
import * as iban from "./iban.js";
import * as isbn from "./isbn.js";
import * as barcode from "./barcode.js";

export { luhn, creditCard, iban, isbn, barcode };
export type { CardBrand } from "./creditcard.js";
export type { BarcodeType } from "./barcode.js";

export type IdType = "credit-card" | "iban" | "isbn" | "barcode" | "unknown";

export interface ValidationResult {
  type: IdType;
  valid: boolean;
  /** Extra info: card brand, IBAN country, ISBN variant, barcode type. */
  detail?: string;
}

/** Best-effort guess of what kind of identifier `input` is. */
export function detect(input: string): IdType {
  const compact = input.replace(/[\s-]/g, "").toUpperCase();
  if (/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(compact)) return "iban";
  const d = input.replace(/\D/g, "");
  if (/X$/i.test(compact) && compact.length === 10) return "isbn";
  if (d.length === 13 && /^97[89]/.test(d)) return "isbn";
  if (d.length === 10) return "isbn";
  if (d.length >= 12 && d.length <= 19 && creditCard.brand(d)) return "credit-card";
  if (d.length === 8 || d.length === 12 || d.length === 13) return "barcode";
  return "unknown";
}

/** Detect the identifier type and validate it in one call. */
export function validate(input: string): ValidationResult {
  const type = detect(input);
  switch (type) {
    case "iban":
      return { type, valid: iban.isValid(input), detail: iban.country(input) ?? undefined };
    case "credit-card":
      return { type, valid: creditCard.isValid(input), detail: creditCard.brand(input) ?? undefined };
    case "isbn": {
      const valid = isbn.isValid(input);
      const variant = isbn.isValidISBN13(input) ? "ISBN-13" : isbn.isValidISBN10(input) ? "ISBN-10" : undefined;
      return { type, valid, detail: variant };
    }
    case "barcode":
      return { type, valid: barcode.isValid(input) };
    default:
      return { type: "unknown", valid: false };
  }
}
