# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0]

### Added

- **Command-line interface** (`checkdigit` bin), zero-dependency: `validate <id>` (auto-detects card/IBAN/ISBN/barcode and exits non-zero when invalid) and `generate <card|isbn|barcode|luhn>` for format-valid test data. Reads stdin too.

## [0.1.0]

### Added

- Initial release.
- `luhn` — validate / check-digit / complete / generate (mod-10).
- `creditCard` — `brand`, `isValid`, `format`, `generateTest` (per brand).
- `iban` — `isValid` (mod-97-10), `checkDigit`, `format`, `country`.
- `isbn` — ISBN-10/13 validation, check digits, and `to10`/`to13` conversion.
- `barcode` — EAN-13 / EAN-8 / UPC-A validation, check digit, generation.
- `detect` + `validate` — auto-detect the identifier type and validate it.
- Free, local-only web app (validate + generate test data) on GitHub Pages.
- Zero runtime dependencies; ESM + CJS + TypeScript types.

[Unreleased]: https://github.com/didrod205/checkdigit/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/didrod205/checkdigit/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/didrod205/checkdigit/releases/tag/v0.1.0
