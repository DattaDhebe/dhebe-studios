# Conversion Service

The static frontend stays on its existing host and uses the approved API at
`https://tools.dhebe.com/api/tools` on VPS `200.234.47.229`. The Python service supplies actual
Office file imports, DOCX/PPTX/XLSX exports, searchable OCR PDFs, PDF/A-2b, AES-256
password encryption, repair, and image background removal. Conversions need no
database; the separate voluntary DhebeVoice tester list uses private SQLite storage.

PDF to Word extracts selectable text into a real DOCX; complex layouts are not
reconstructed. PDF to PowerPoint uses page images. Excel extracts tables where
possible and otherwise exports text rows. HTML imports use LibreOffice's HTML
support, not a full browser engine. External images and links are not fetched.

## Local Validation

```sh
docker compose -f services/tools/compose.yaml build
docker compose -f services/tools/compose.yaml up -d
docker compose -f services/tools/compose.yaml run --rm -v ./services/tools/tests:/tests:ro tools python -m unittest discover -s /tests -v
```

The Docker build downloads the small U2NetP model for background removal. Runtime
processing has no internet access. Use one API worker; the process allows two jobs
at once, queues up to two more, and rejects additional jobs with 429. Uploads are limited to 25 MB and PDFs
to 150 pages. Temporary source and result files are deleted before the response
is returned; results wait in memory for up to five minutes and are removed after
download. The frontend uses short polling requests so large conversions do not
hit the existing proxy's request timeout. HTTP logs do not include
file contents or passwords.

## VPS Deployment

1. Copy `services/tools` to a dedicated directory on the VPS.
2. Run `docker compose build && docker compose up -d` in that directory.
3. Check `docker compose exec tools python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8000/health').read())"` and run the integration tests.
4. Add the provided nginx location to the site's existing HTTPS configuration.
   Run `nginx -t` before reloading. The backend port is bound to loopback only.
5. Rebuild the frontend and deploy `out/` as usual. By default it calls
   `/api/tools` on the same origin. For a separate API domain set
   `NEXT_PUBLIC_TOOL_API_URL=https://tools.example.com` before building and set
   `ALLOWED_ORIGINS=https://www.dhebe.com,https://dhebe.com` on the service.

For a separate domain, configure its reverse proxy and TLS before updating the
frontend. Enable the proxy upload limits for any public deployment. The service's
job and file-size limits also apply to public requests.

## Deployed Proxy

The approved deployment uses the existing Caddy 2.11 proxy on the VPS. The
original config is backed up at `/opt/dhebe-tools/Caddyfile.before-tools` and the
reviewed combined config is `Caddyfile.deployment`. Trade routes and global
timeouts stay intact. Reload with SIGUSR1 after validation; do not restart the
trading containers.

If a later trading deployment recreates its Caddy container, reattach that
container to the tools network before validation/reload:

```sh
docker network connect dhebe-tools_conversion ai-trading-dashboard-caddy-1
```

Retain the tools host block when publishing a newer Caddy configuration. The
service's internal Docker network prevents outbound connections while allowing
the existing proxy to reach it.

## DhebeVoice Volunteer Testers: Legacy VPS Storage

The production website now uses the same-origin Premium-hosting endpoint
`https://www.dhebe.com/api/dhebevoice-signup.php`. See
`services/shared-hosting/README.md` and the repository's `STORAGE.md`.
The Caddy compatibility route forwards the old public signup URL to that same
private list, including CORS handling for previously cached website clients.
The Python implementation and existing volume below are retained for rollback;
they are not the destination for new public signups. Do not delete an existing
consent record until its approved migration has been verified.

`POST /early-access/dhebevoice` accepts a JSON email, explicit boolean consent,
and an empty `website` honeypot from the approved website origins. It does not
send mail or grant Play access automatically. New and duplicate requests receive
the same response. There is no public endpoint for reading the list.

The only persisted fields are normalized email, UTC signup time, and consent
version. The database is `/data/testers.sqlite3` in the private Compose volume
`dhebe-tools_tester_signups`; it is not under the web root or in the repository.
The directory is owned by UID 10001 with mode 0700; the file is created with mode
0600. Do not publish or commit exports. Source-document cleanup is unchanged.

The signup endpoint allows 30 requests per minute globally, a 1 KB JSON body,
and at most 10,000 entries. Entries expire after 180 days and are pruned on new
requests and hourly. Duplicate signups do not reset the original signup date.
Back up the volume privately if needed; do not remove it during service updates.

Legacy-list access is through the existing authorized VPS SSH connection only. Example
administration commands from `/opt/dhebe-tools`:

```sh
docker compose exec -T tools python -c "import sqlite3,json; c=sqlite3.connect('/data/testers.sqlite3'); print(json.dumps(c.execute('SELECT email,created_at,consent_version FROM signups ORDER BY created_at').fetchall()))"
```

For a removal request, verify that the person controls the address, then use a
parameterized SQL DELETE in an authorized SSH session. Do not add a public export
or removal-by-address endpoint. Testing invitations are sent manually after the
team adds volunteers to the appropriate Google Play testing track.
