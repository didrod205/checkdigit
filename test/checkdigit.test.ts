import { describe, expect, it } from "vitest";
import { barcode, creditCard, detect, iban, isbn, luhn, validate } from "../src/index.js";

describe("luhn", () => {
  it("validates and rejects", () => {
    expect(luhn.isValid("79927398713")).toBe(true);
    expect(luhn.isValid("79927398710")).toBe(false);
  });
  it("computes the check digit", () => {
    expect(luhn.checkDigit("7992739871")).toBe(3);
    expect(luhn.complete("7992739871")).toBe("79927398713");
  });
  it("generates valid numbers", () => {
    for (let i = 0; i < 20; i++) {
      const n = luhn.generate(16);
      expect(n).toHaveLength(16);
      expect(luhn.isValid(n)).toBe(true);
    }
  });
});

describe("creditCard", () => {
  it("detects brands", () => {
    expect(creditCard.brand("4111 1111 1111 1111")).toBe("Visa");
    expect(creditCard.brand("5555555555554444")).toBe("Mastercard");
    expect(creditCard.brand("378282246310005")).toBe("American Express");
    expect(creditCard.brand("6011111111111117")).toBe("Discover");
  });
  it("validates known test cards", () => {
    expect(creditCard.isValid("4111111111111111")).toBe(true);
    expect(creditCard.isValid("378282246310005")).toBe(true);
    expect(creditCard.isValid("4111111111111112")).toBe(false); // bad Luhn
    expect(creditCard.isValid("411111111111")).toBe(false); // wrong length for Visa
  });
  it("formats", () => {
    expect(creditCard.format("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(creditCard.format("378282246310005")).toBe("3782 822463 10005");
  });
  it("generates valid test numbers per brand", () => {
    for (const b of ["Visa", "Mastercard", "American Express", "Discover"]) {
      const n = creditCard.generateTest(b);
      expect(creditCard.isValid(n)).toBe(true);
      expect(creditCard.brand(n)).toBe(b);
    }
  });
});

describe("iban", () => {
  it("validates real IBANs", () => {
    expect(iban.isValid("GB82 WEST 1234 5698 7654 32")).toBe(true);
    expect(iban.isValid("DE89370400440532013000")).toBe(true);
    expect(iban.isValid("FR1420041010050500013M02606")).toBe(true);
  });
  it("rejects bad IBANs", () => {
    expect(iban.isValid("GB82 WEST 1234 5698 7654 33")).toBe(false);
    expect(iban.isValid("XX00")).toBe(false);
  });
  it("computes the check digits", () => {
    expect(iban.checkDigit("DE", "370400440532013000")).toBe("89");
    expect(iban.format("DE89370400440532013000")).toBe("DE89 3704 0044 0532 0130 00");
  });
});

describe("isbn", () => {
  it("validates ISBN-10 and ISBN-13", () => {
    expect(isbn.isValid("0306406152")).toBe(true);
    expect(isbn.isValid("0-306-40615-2")).toBe(true);
    expect(isbn.isValid("9780306406157")).toBe(true);
    expect(isbn.isValid("080442957X")).toBe(true); // X check digit
    expect(isbn.isValid("0306406153")).toBe(false);
  });
  it("converts between forms", () => {
    expect(isbn.to13("0306406152")).toBe("9780306406157");
    expect(isbn.to10("9780306406157")).toBe("0306406152");
  });
});

describe("barcode", () => {
  it("validates EAN-13, UPC-A, EAN-8", () => {
    expect(barcode.isValid("4006381333931")).toBe(true);
    expect(barcode.isValid("036000291452")).toBe(true); // UPC-A
    expect(barcode.isValid("73513537")).toBe(true); // EAN-8
    expect(barcode.isValid("4006381333932")).toBe(false);
  });
  it("computes check digits", () => {
    expect(barcode.checkDigit("400638133393", "ean13")).toBe(1);
    expect(barcode.checkDigit("03600029145", "upca")).toBe(2);
  });
  it("generates valid barcodes", () => {
    for (const t of ["ean13", "ean8", "upca"] as const) {
      expect(barcode.isValid(barcode.generate(t))).toBe(true);
    }
  });
});

describe("detect & validate", () => {
  it("auto-detects type and validates", () => {
    expect(validate("4111111111111111")).toMatchObject({ type: "credit-card", valid: true, detail: "Visa" });
    expect(validate("DE89370400440532013000")).toMatchObject({ type: "iban", valid: true, detail: "DE" });
    expect(validate("9780306406157")).toMatchObject({ type: "isbn", valid: true, detail: "ISBN-13" });
    expect(validate("036000291452")).toMatchObject({ type: "barcode", valid: true });
  });
  it("detect returns a type label", () => {
    expect(detect("GB82WEST12345698765432")).toBe("iban");
    expect(detect("0306406152")).toBe("isbn");
  });
});
