# HSU Alumni Web App

Rebuild of the HSU Alumni landing page as a web app while preserving the original information footprint (navbar sections, identity area, and footer structure).

## Stack

- Front-end: React (JavaScript, Vite)
- Back-end: Python (Django)
- Database: SQLite for Django models and MongoDB for enabled repositories
- Infrastructure: Docker + Docker Compose

## Run locally

Run from the repository root with Docker Desktop. The local Compose override builds the frontend with `frontend/Dockerfile.local`, which handles Windows line endings in the entrypoint script.

Before starting, configure `backend/.env.local`. To connect to MongoDB on another server, set `MONGODB_ENABLED=1` and set `MONGODB_URI` to that server's reachable IP/hostname and port. `host.docker.internal` refers to your own computer, not the remote server.

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

The script stops a previously running local Caddy container, then builds and starts only the backend and frontend and runs Django migrations.

Open http://localhost:3456. Check the API at http://localhost:8000/api/health/. To verify the MongoDB connection from the backend container:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml exec backend python manage.py shell -c "from db.mongodb import get_mongo_client; print(get_mongo_client().admin.command('ping'))"
```

To view logs or stop the local stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f backend frontend
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

## Run on server

The domain `alumni.hoasen.edu.vn` and HTTPS are already configured. On the server, configure `backend/.env.local` for the MongoDB instance reachable from the backend container, then run from the repository root with the main Compose file:

```bash
docker compose up -d --build
docker compose exec backend python manage.py migrate
docker compose ps
```

This starts the backend, frontend, and Caddy. Check the site and API:

```bash
curl -I https://alumni.hoasen.edu.vn/
curl -fsS https://alumni.hoasen.edu.vn/api/health/
```

To inspect startup or runtime errors:

```bash
docker compose logs -f backend frontend caddy
```

## Notes

- Frontend is served on port 3456.
- Django uses `backend/db.sqlite3` by default for its models. MongoDB repositories are selected when `MONGODB_ENABLED=1`.
- `backend/scripts/seed_cms_content.py` writes demo content through Django models in SQLite; it does not seed the remote MongoDB database.
