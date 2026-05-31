import { barcode, creditCard, validate } from "../src/index";

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const input = $<HTMLInputElement>("input");
const result = $<HTMLDivElement>("result");

const TYPE_LABEL: Record<string, string> = {
  "credit-card": "Credit card",
  iban: "IBAN",
  isbn: "ISBN",
  barcode: "Barcode",
  unknown: "Unknown",
};

function showResult(): void {
  const value = input.value.trim();
  if (!value) {
    result.innerHTML = "";
    return;
  }
  const r = validate(value);
  if (r.type === "unknown") {
    result.innerHTML = `<div class="badge muted">Couldn't recognize this as a card, IBAN, ISBN or barcode.</div>`;
    return;
  }
  const icon = r.valid ? "✓" : "✗";
  const cls = r.valid ? "ok" : "bad";
  const detail = r.detail ? ` · ${r.detail}` : "";
  result.innerHTML =
    `<div class="badge ${cls}">${icon} ${r.valid ? "Valid" : "Invalid"} ${TYPE_LABEL[r.type]}${detail}</div>`;
}

input.addEventListener("input", showResult);

// Generators
const GENERATORS: { label: string; run: () => string }[] = [
  { label: "Visa", run: () => creditCard.format(creditCard.generateTest("Visa")) },
  { label: "Mastercard", run: () => creditCard.format(creditCard.generateTest("Mastercard")) },
  { label: "Amex", run: () => creditCard.format(creditCard.generateTest("American Express")) },
  { label: "Discover", run: () => creditCard.format(creditCard.generateTest("Discover")) },
  { label: "EAN-13", run: () => barcode.generate("ean13") },
  { label: "UPC-A", run: () => barcode.generate("upca") },
];

$("gen").innerHTML = GENERATORS.map((g, i) => `<button data-i="${i}" type="button">${g.label}</button>`).join("");
for (const btn of Array.from($("gen").querySelectorAll<HTMLButtonElement>("button"))) {
  btn.addEventListener("click", () => {
    const g = GENERATORS[Number(btn.dataset.i)]!;
    const value = g.run();
    $("genOut").innerHTML =
      `<code>${value}</code><button class="copy" type="button">Copy</button>` +
      `<span class="muted small">${g.label} test value</span>`;
    const copy = $("genOut").querySelector(".copy") as HTMLButtonElement;
    copy.addEventListener("click", () => {
      navigator.clipboard.writeText(value);
      copy.textContent = "Copied!";
      setTimeout(() => (copy.textContent = "Copy"), 1100);
    });
    // Drop the generated value into the validator to show it checks out.
    input.value = value;
    showResult();
  });
}
