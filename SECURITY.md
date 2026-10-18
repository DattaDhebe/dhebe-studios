# Security Policy

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/DattaDhebe/dhebe-studios/security/advisories/new)
when available, or email [support@dhebe.com](mailto:support@dhebe.com) with the
subject `Dhebe Studios security report`.

Include the affected tool/route, a concise description, expected impact, and
reproduction steps using generated non-personal fixtures. Do not include actual
tester records, private documents, access tokens, passwords, database exports,
or trading data. Do not post vulnerability details in a public issue before
coordinating with the maintainer.

## Scope and testing

This repository owns the website, conversion service, and optional tester
signup. Trading applications are maintained separately. Test only systems and
accounts you are authorized to use; do not probe unrelated services, enumerate
tester emails, or run destructive/resource-exhaustion tests on production.

Current maintenance follows `main`. Report issues against the current code and
include the relevant commit when possible. No fixed response time or bounty is
promised. Please allow investigation and remediation before public disclosure.

## Data handling expectations

Browser tools should not upload document content unless the interface explicitly
identifies server processing. Conversion uploads must remain temporary. Tester
signup requires consent and private storage with retention limits. See
[STORAGE.md](STORAGE.md) and the service documentation before changing these
boundaries. CI and issue attachments must use synthetic data only.
