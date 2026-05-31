<div align="center">

# ✅ checkdigit

### Validate & generate checksummed IDs — cards, IBANs, ISBNs, barcodes. Locally.

[![npm version](https://img.shields.io/npm/v/@didrod2539/checkdigit.svg?color=success)](https://www.npmjs.com/package/@didrod2539/checkdigit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@didrod2539/checkdigit?label=gzip)](https://bundlephobia.com/package/@didrod2539/checkdigit)
[![CI](https://github.com/didrod205/checkdigit/actions/workflows/ci.yml/badge.svg)](https://github.com/didrod205/checkdigit/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/@didrod2539/checkdigit.svg)](https://www.npmjs.com/package/@didrod2539/checkdigit)
[![license](https://img.shields.io/npm/l/@didrod2539/checkdigit.svg)](./LICENSE)

**[🌐 Try the free web app →](https://didrod205.github.io/checkdigit/)** &nbsp;·&nbsp; paste an ID to validate, or generate test data. Nothing leaves the page.

</div>

---

Credit cards, bank accounts (IBAN), books (ISBN) and products (EAN/UPC barcodes)
all carry a **check digit** — a number computed from the rest so typos can be
caught instantly. The math (Luhn, mod-97, weighted sums) is exact and well-defined…
and exactly the kind of thing that's tedious to implement per-format and easy for
an AI to get subtly wrong.

**checkdigit** validates and generates all of them with the correct algorithms,
**zero dependencies**, and **100% locally** — your card number never touches a
server.

> 📸 _Screenshot / demo GIF:_ `./web/screenshot.png` — record the [live app](https://didrod205.github.io/checkdigit/) validating a card and generating a test EAN-13.

## Why it exists

- **AI can't reliably do this.** Check-digit algorithms (Luhn doubling, IBAN
  mod-97-10, ISBN/EAN weighted sums) are precise and unforgiving — an LLM will
  cheerfully produce an "almost right" number that fails validation. You want a
  tested, deterministic implementation.
- **Privacy.** Validating a card on a random website means typing your number
  into their server. checkdigit runs on your device.
- **One tool, every format.** Stop pulling a separate micro-library (or
  copy-pasted snippet) for each of Luhn / IBAN / ISBN / EAN.

## Who it's for

**Developers** (form validation without N tiny deps), **QA & testers** (generate
valid test cards/IBANs/barcodes), **e-commerce & ops** (verify SKUs, orders,
barcodes), **finance**, **publishers/librarians** (ISBN), and anyone who needs to
check or convert an identifier.

## Install

**No install —** just open the **[web app](https://didrod205.github.io/checkdigit/)**.

For the library:

```bash
npm install @didrod2539/checkdigit
```

Zero dependencies. ESM + CJS + TypeScript types. Runs in the browser, Node, Deno and Bun.

## Usage

```ts
import { validate, detect, luhn, creditCard, iban, isbn, barcode } from "@didrod2539/checkdigit";

// Auto-detect & validate anything
validate("4111 1111 1111 1111"); // { type: "credit-card", valid: true, detail: "Visa" }
validate("DE89 3704 0044 0532 0130 00"); // { type: "iban", valid: true, detail: "DE" }
validate("978-0-306-40615-7");   // { type: "isbn", valid: true, detail: "ISBN-13" }

// Or use a specific module
creditCard.brand("378282246310005");      // "American Express"
creditCard.generateTest("Visa");           // a Luhn-valid test number
iban.isValid("GB82 WEST 1234 5698 7654 32"); // true
isbn.to13("0306406152");                    // "9780306406157"
barcode.isValid("036000291452");            // true (UPC-A)
luhn.complete("7992739871");                // "79927398713"
```

## What's covered

| Module | Identifiers |
| ------ | ----------- |
| `luhn` | Mod-10 (cards, IMEI…): validate, check digit, complete, generate |
| `creditCard` | Brand detection, validation, formatting, **test-number generation** |
| `iban` | ISO 13616 mod-97-10: validate, check digits, format, country |
| `isbn` | ISBN-10 & ISBN-13: validate, check digits, **convert 10 ⇄ 13** |
| `barcode` | EAN-13, EAN-8, UPC-A: validate, check digit, generate |
| `detect` / `validate` | Auto-detect the type and validate in one call |

## FAQ

**Is my card number sent anywhere?**
No. Everything runs on your device — no server, no telemetry, works offline.

**Are the generated card numbers real?**
No. They're **format-valid test numbers** (correct brand prefix, length and Luhn
check) for testing forms and payment flows — they are not real, usable accounts.

**Does validating a card mean it will work for a payment?**
No — it only confirms the number is *structurally* valid (right format + check
digit). Whether an account exists/has funds is a separate, server-side matter.

**Which IBAN countries are supported?**
Any IBAN — validation uses the universal mod-97-10 check plus the general
structure. (Per-country length tables can be added; PRs welcome.)

**Can I add VIN / routing numbers / ISIN?**
Yes please — see CONTRIBUTING; each is a small module with its own check.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Code of Conduct](./CODE_OF_CONDUCT.md).

```bash
git clone https://github.com/didrod205/checkdigit.git
cd checkdigit
npm install
npm test          # run the suite
npm run dev       # run the web app locally
```

## 💖 Sponsor

checkdigit is free, MIT-licensed, and built in spare time. If it saved you a
dependency (or a debugging session), please consider supporting it:

- ⭐ **Star this repo** — free, and it genuinely helps others find it.
- 🍋 **[Sponsor via Lemon Squeezy](https://elab-studio.lemonsqueezy.com/checkout/buy/5d059b89-51d0-456b-b33a-ed56994f7010)** — one-time or recurring support.

**Where your support goes:** more identifiers (VIN, routing/ABA, ISIN, NPI,
national IDs), per-country IBAN structure validation, more card brands, a CLI,
keeping the free web app online, and fast issue responses.

## License

[MIT](./LICENSE) © checkdigit contributors
