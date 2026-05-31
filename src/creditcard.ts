/** Credit-card brand detection, validation, and test-number generation. */

import { complete, isValid as luhnValid } from "./luhn.js";

export interface CardBrand {
  name: string;
  /** Accepted total lengths. */
  lengths: number[];
  /** IIN/BIN prefix matcher. */
  test: RegExp;
  /** A prefix to seed test-number generation. */
  prefix: string;
}

export const BRANDS: CardBrand[] = [
  { name: "American Express", lengths: [15], test: /^3[47]/, prefix: "37" },
  { name: "Diners Club", lengths: [14, 16], test: /^3(?:0[0-5]|[689])/, prefix: "36" },
  { name: "JCB", lengths: [16, 17, 18, 19], test: /^35(?:2[89]|[3-8])/, prefix: "3530" },
  { name: "Visa", lengths: [13, 16, 19], test: /^4/, prefix: "4" },
  { name: "Mastercard", lengths: [16], test: /^(?:5[1-5]|2(?:2[2-9]|[3-6]|7[01]|720))/, prefix: "55" },
  { name: "Discover", lengths: [16, 19], test: /^(?:6011|65|64[4-9])/, prefix: "6011" },
  { name: "UnionPay", lengths: [16, 17, 18, 19], test: /^62/, prefix: "62" },
];

const clean = (input: string): string => input.replace(/[\s-]/g, "");

/** Identify the card brand, or `null` if unknown. */
export function brand(input: string): string | null {
  const n = clean(input);
  for (const b of BRANDS) if (b.test.test(n)) return b.name;
  return null;
}

/** Validate a card number (correct length for its brand + Luhn). */
export function isValid(input: string): boolean {
  const n = clean(input);
  if (!/^\d+$/.test(n)) return false;
  const b = BRANDS.find((x) => x.test.test(n));
  const lengthOk = b ? b.lengths.includes(n.length) : n.length >= 12 && n.length <= 19;
  return lengthOk && luhnValid(n);
}

/** Format with spaces (Amex: 4-6-5, otherwise groups of 4). */
export function format(input: string): string {
  const n = clean(input);
  if (/^3[47]/.test(n)) return n.replace(/^(\d{4})(\d{6})(\d{5}).*/, "$1 $2 $3").trim();
  return n.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/**
 * Generate a **format-valid test card number** for a brand (Luhn-valid, correct
 * length). For testing only — these are not real, usable accounts.
 */
export function generateTest(brandName = "Visa"): string {
  const b = BRANDS.find((x) => x.name.toLowerCase() === brandName.toLowerCase()) ?? BRANDS[3]!;
  const length = b.lengths[0] as number;
  let body = b.prefix;
  while (body.length < length - 1) body += Math.floor(Math.random() * 10);
  return complete(body.slice(0, length - 1));
}
