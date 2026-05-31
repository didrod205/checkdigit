# Contributing to checkdigit

Thanks for taking the time to contribute! 🎉 checkdigit implements exact
checksum algorithms, so **correctness** is the priority.

## Getting started

```bash
git clone https://github.com/didrod205/checkdigit.git
cd checkdigit
npm install
```

| Command | What it does |
| ------- | ------------ |
| `npm test` | Run the test suite (Vitest). |
| `npm run test:watch` | Re-run tests on change. |
| `npm run typecheck` | Type-check without emitting. |
| `npm run build` | Build the library (`dist/`). |
| `npm run build:web` | Build the web app (`docs/`). |
| `npm run dev` | Run the web app locally (`vite`). |

## Good contributions

- **More identifiers**: VIN, routing/ABA numbers, NPI, SSN-format, IMEI helpers,
  ISIN, national IDs — each with its own module + the spec reference.
- **More IBAN country length checks**, more card brands.

## Rules of the road

1. Every algorithm needs tests with **known-valid and known-invalid** examples
   (cite the source/standard).
2. Validation only — never imply a generated number is a real, usable account;
   keep "test data" framing.
3. `npm run typecheck` and `npm test` must pass.
4. Keep the package **zero-dependency** and the API small.

## Reporting bugs

Open an issue with the identifier type, the input, the expected vs. actual
result, and a reference for the correct check.

By contributing you agree your contributions are licensed under the project's
[MIT License](./LICENSE).
