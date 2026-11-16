# HSU Alumni Web App

Rebuild of the HSU Alumni landing page as a web app while preserving the original information footprint (navbar sections, identity area, and footer structure).

## Stack

- Front-end: React (JavaScript, Vite)
- Back-end: Python (Django)
- Database: MongoDB
- Infrastructure: Docker + Docker Compose

## Run locally

```bash
docker compose up --build
```

Seed public CMS demo content:

```bash
python backend/scripts/seed_cms_content.py
```

Landing page:

- http://localhost:3456

API health:

- http://localhost:8000/api/health/

Landing API data:

- http://localhost:8000/api/landing-page/

## Notes

- Frontend is served on port 3456.
- Backend seeds default landing content into MongoDB (`landing_pages` collection, slug `home`) if no data exists.
- CMS public pages, news, events, webinars, stories, and gallery can be seeded locally with `python backend/scripts/seed_cms_content.py`.
- You can update landing content directly in MongoDB to drive the React UI without code changes.

## Domain deployment

The Compose stack includes Caddy, which forwards `alumni.hoasen.edu.vn` to the frontend on port 3456 and obtains an HTTPS certificate automatically.

1. In the authoritative DNS zone for `hoasen.edu.vn`, set the **A** record with host `alumini` to `119.82.134.65`. The currently delegated nameservers are `ns1.dotvndns.vn`, `ns2.dotvndns.vn`, and `nsbak.dotvndns.com`. Do not add an AAAA record unless this server has a working public IPv6 address.
2. Allow inbound TCP ports **80** and **443** to this server. Port 80 is needed for certificate validation and redirects to HTTPS.
3. Run `docker compose up -d --no-build` from this directory.
4. Confirm DNS with `dig +short alumni.hoasen.edu.vn A @1.1.1.1`, then check `curl -I https://alumni.hoasen.edu.vn/` and `curl https://alumni.hoasen.edu.vn/api/health/`.

If HTTPS is not ready after DNS resolves, inspect `docker compose logs caddy` and restart Caddy with `docker compose restart caddy` to retry certificate issuance promptly.
