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
