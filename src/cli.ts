#!/usr/bin/env node
/**
 * checkdigit CLI — validate & generate checksummed IDs. Zero-dependency, local.
 *
 *   checkdigit validate 4111111111111111      # auto-detect + validate
 *   echo "DE89 3704 0044 0532 0130 00" | checkdigit validate
 *   checkdigit generate card --brand Visa
 *   checkdigit generate isbn
 *   checkdigit generate barcode --type ean13
 */

import { readFileSync } from "node:fs";
import { validate, creditCard, isbn, barcode, luhn, type BarcodeType } from "./index.js";
import pkg from "../package.json";

const HELP = `checkdigit — validate & generate checksummed identifiers.

Usage:
  checkdigit validate <id>          Detect the type and validate (exit 1 if bad)
  checkdigit generate <kind>        Make a format-valid TEST identifier
  <id> | checkdigit validate        Read the id from stdin

Generate kinds:
  card     --brand <Visa|Mastercard|Amex|Discover>   (default Visa)
  isbn                                                (a valid ISBN-13)
  barcode  --type <ean13|ean8|upca>                  (default ean13)
  luhn     --length <n>                               (default 16)

Options:
  -h, --help      Show this help
  -v, --version   Show version

Generated identifiers are format-valid TEST data (correct check digit) — not
real, usable accounts. Everything runs locally; nothing is uploaded.`;

function flag(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : undefined;
}

function readStdin(): string {
  try {
    return readFileSync(0, "utf8").trim();
  } catch {
    return "";
  }
}

function main(): number {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("-h") || argv.includes("--help")) {
    process.stdout.write(HELP + "\n");
    return argv.length === 0 ? 2 : 0;
  }
  if (argv[0] === "-v" || argv[0] === "--version") {
    process.stdout.write(`checkdigit ${pkg.version}\n`);
    return 0;
  }

  const cmd = argv[0]!;
  const rest = argv.slice(1);

  try {
    if (cmd === "validate") {
      const id = rest.find((a) => !a.startsWith("-")) ?? readStdin();
      if (!id) {
        process.stderr.write("checkdigit: provide an identifier (arg or stdin).\n");
        return 2;
      }
      const r = validate(id);
      const mark = r.valid ? "✓ valid" : "✗ invalid";
      const detail = r.detail ? ` (${r.detail})` : "";
      process.stdout.write(`${mark}  ${r.type}${detail}\n`);
      return r.valid ? 0 : 1;
    }

    if (cmd === "generate") {
      const kind = rest.find((a) => !a.startsWith("-"));
      switch (kind) {
        case "card": {
          const b = flag(rest, "--brand") ?? "Visa";
          process.stdout.write(creditCard.format(creditCard.generateTest(b)) + "\n");
          return 0;
        }
        case "isbn":
          // isbn has no generate(); build a valid ISBN-13 from a 978-prefixed body.
          process.stdout.write(generateIsbn13() + "\n");
          return 0;
        case "barcode": {
          const type = (flag(rest, "--type") ?? "ean13") as BarcodeType;
          process.stdout.write(barcode.generate(type) + "\n");
          return 0;
        }
        case "luhn": {
          const len = Number(flag(rest, "--length") ?? "16");
          process.stdout.write(luhn.generate(len) + "\n");
          return 0;
        }
        default:
          process.stderr.write("checkdigit: generate <card|isbn|barcode|luhn>. See --help.\n");
          return 2;
      }
    }

    process.stderr.write(`checkdigit: unknown command "${cmd}". See --help.\n`);
    return 2;
  } catch (e) {
    process.stderr.write(`checkdigit: ${(e as Error).message}\n`);
    return 1;
  }
}

/** Build a valid ISBN-13 from a deterministic-ish 12-digit body. */
function generateISBN13Body(): string {
  // 978 + 9 digits derived from the current high-resolution time, no Math.random
  // dependency on determinism required here (test data).
  const seed = Date.now().toString().slice(-9).padStart(9, "0");
  return "978" + seed;
}

function generateIsbn13(): string {
  const body = generateISBN13Body();
  const check = isbn.checkDigit13(body);
  return body + String(check);
}

process.exit(main());
