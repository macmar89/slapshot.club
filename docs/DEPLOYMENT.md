# Deployment Guide (Docker)

This guide explains how to deploy the Slapshot Club app to a VPS using Docker.

## Prerequisites

-   A VPS (Virtual Private Server) with [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.
-   Access to the project source code on the VPS (via Git or SCP).

## Configuration

1.  **Environment Variables**:
    Create a `.env` file in the root of your project on the VPS. You can use the provided `.env.example` as a template, but ensure you fill in the production secrets.

    ```bash
    cp .env.example .env
    nano .env
    ```

    **Important Variables for Docker:**
    -   `DATABASE_URL`: In the `docker-compose.prod.yml`, this is automatically configured to point to the `postgres` container. You can leave it as is or override it if using an external managed database.
    -   `PAYLOAD_SECRET`: Must be a long, secure random string.
    -   `NEXT_PUBLIC_SERVER_URL`: The full URL of your site (e.g., `https://slapshot.club`).
    -   `POSTGRES_PASSWORD`: Set a strong password for the database.

## Deployment Steps

1.  **Build the Image**:
    Navigate to the project directory and build the Docker images.

    ```bash
    docker compose -f docker-compose.prod.yml build
    ```

2.  **Run Database Migrations**:
    Before starting the app, run the migrations to set up the database schema.

    ```bash
    docker compose -f docker-compose.prod.yml run --rm migrator
    ```

    *Note: This runs the `mirgator` service defined in the compose file, which executes `npx payload migrate`.*

3.  **Start the Application**:
    Start the application and database in the background.

    ```bash
    docker compose -f docker-compose.prod.yml up -d
    ```

    Your app should now be running on port `3000`. You can configure a reverse proxy (like Nginx or Traefik) to expose it on port 80/443 with SSL.

## Maintenance

### Updating the App
To update the application after code changes:

1.  Pull the latest code: `git pull`
2.  Rebuild: `docker compose -f docker-compose.prod.yml build`
3.  Migrate: `docker compose -f docker-compose.prod.yml run --rm migrator`
4.  Restart: `docker compose -f docker-compose.prod.yml up -d`

### Viewing Logs
```bash
docker compose -f docker-compose.prod.yml logs -f app
```

### Backing up Database
The database data is stored in a Docker volume named `db_data`.
```bash
# Dump the postgres database
docker compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres slapshot > backup.sql
```
