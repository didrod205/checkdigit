# checkdigit — Product & Strategy

Why checkdigit exists, who it's for, how it's positioned, and how it could sustain itself.

## 1. Why this idea

Credit cards, IBANs, ISBNs and product barcodes all embed a **check digit** —
derived from the other digits so a typo is caught immediately. The algorithms
(Luhn, IBAN mod-97-10, ISBN/EAN weighted sums) are exact, standardized, and
exactly the kind of fiddly arithmetic that's annoying to implement per format and
that an LLM will get *almost* right (i.e. wrong). Developers reach for a separate
micro-dependency for each; everyone else pastes their number into some website.

checkdigit unifies validation **and** generation for all of them, deterministically
and locally. It's a quiet "why didn't I have one of these?" utility.

It fits every constraint: **AI can't reliably replace it** (precise checksum math
where the answer must be exact), **no server**, **no API key**, **runs in the
browser or any JS runtime**, immediate value, broad technical + commerce audience.

## 2. Competitor analysis

| Tool | What it does | Gaps checkdigit fills |
| ---- | ------------ | --------------------- |
| Single-purpose npm libs (`luhn`, `iban`, `isbn3`, `barcoder`…) | One format each | You install/learn several; inconsistent APIs; no unified generate |
| Online card/IBAN validators | Validate after you type your number | **You type a card number into their server**; ads; one format |
| Test-card lists (Stripe docs, etc.) | A few fixed test numbers | Static; not generated; cards only |
| Hand-rolled snippets | DIY | Easy to get the doubling/weighting wrong; no tests |

**Nobody** offers a tiny, zero-dependency library **and** a friendly **local** app
that validates *and* generates across Luhn cards, IBANs, ISBNs and barcodes.

## 3. Differentiation

1. **All major checksummed IDs in one** — consistent API, one dependency.
2. **Validate *and* generate** — including format-valid **test data** (cards,
   barcodes) QA teams actually need.
3. **Local-first** — card numbers never leave the device.
4. **Exact & tested** — known-valid/known-invalid fixtures per algorithm.
5. **Zero dependencies**, runs anywhere JS does.

## 4. Folder structure

```
checkdigit/
├─ src/        luhn.ts · creditcard.ts · iban.ts · isbn.ts · barcode.ts · index.ts
├─ test/       known-value tests per algorithm
├─ web/        Vite validate + generate studio → docs/ (GitHub Pages)
├─ .github/    ci · release · pages workflows, templates, FUNDING
└─ README · LICENSE · CONTRIBUTING · CODE_OF_CONDUCT · CHANGELOG · PRODUCT
```

## 9. GitHub Topics

```
luhn, credit-card, iban, isbn, barcode, ean13, upc, check-digit, checksum,
validation, test-data, zero-dependency
```

## 10. Product Hunt launch copy

**Tagline:** Validate & generate cards, IBANs, ISBNs & barcodes — locally, exact check-digit math.

**Description:**
> Every credit card, bank account, book and product code has a check digit you
> can verify with math. checkdigit validates them all — and generates valid test
> numbers for QA — with the correct algorithms (Luhn, IBAN mod-97, ISBN/EAN), in
> your browser. Your card number never touches a server.
>
> There's also a zero-dependency npm library so you stop installing a separate
> micro-package for each format.
>
> Free & open-source (MIT). ✅

**First comment (maker):** "I had `luhn`, `iban`, and `isbn` as three separate
dependencies in one project, and I'd pasted a card into a sketchy 'validator' once
too often. So I made one tiny, local tool for all of them."

## 11. npm package name

- **Primary:** `checkdigit` (exact-match for the concept; searchable; available).
- Discoverability via keyword topics & SEO below.

## 12. SEO keyword strategy

Intent-rich queries:

- "luhn validator", "credit card validator", "iban validator", "isbn validator"
- "ean13 check digit", "upc check digit", "barcode validator"
- "generate test credit card", "valid test card number"
- "isbn 10 to 13", "check digit calculator"
- "luhn algorithm javascript", "iban check digit"

Tactics: descriptive `<title>`/meta on the app (done), README phrasing,
per-identifier docs ("How the Luhn algorithm works"), GitHub topics, and the
GitHub Pages app as an indexable landing page.

## 13. Monetization (without breaking the free, local promise)

Core stays free, open-source, local forever.

1. **Sponsorship** — Lemon Squeezy (wired up), with a clear "where it goes" note.
2. **Pro / integrations** — a richer test-data generator (full fake card details,
   bulk export), a forms-validation component pack, or a CLI for CI data fixtures.
3. **Funded features** — companies sponsor specific identifiers (national IDs,
   ISIN, VIN) or per-country IBAN/tax-id validation suites.

Guardrails: never transmit user numbers, never add telemetry, never imply
generated numbers are real accounts, never paywall the existing validators.
