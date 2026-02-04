# Deployment Guide (Docker)

This guide explains how to deploy the Slapshot Club app to a VPS or Coolify using Docker, connecting to an external database.

## Prerequisites

-   A VPS with Docker and Docker Compose installed, OR a platform like Coolify.
-   **External Database**: A running Postgres database (e.g., managed service, separate Docker container, or Coolify database service).

## Configuration

1.  **Environment Variables**:
    Create a `.env` file in the root.

    ```bash
    cp .env.example .env
    ```

    **Required Variables:**
    -   `DATABASE_URL`: Full connection string to your Postgres database.
        -   Example: `postgres://user:password@host:5432/dbname`
        -   If running in Coolify/Docker network, use the internal service name as host.
    -   `PAYLOAD_SECRET`: Must be a long, secure random string.
    -   `NEXT_PUBLIC_SERVER_URL`: The full URL of your site.
    -   All other external services (S3/R2, Brevo, Turnstile).

## Deployment Steps

1.  **Build the Image**:
    ```bash
    docker compose -f docker-compose.prod.yml build
    ```

2.  **Run Database Migrations**:
    Run the migrations against your external database.
    ```bash
    docker compose -f docker-compose.prod.yml run --rm migrator
    ```

3.  **Start the Application**:
    ```bash
    docker compose -f docker-compose.prod.yml up -d
    ```

## Coolify Deployment

If deploying via Coolify:
1.  Add a **Service** pointing to this repository (or Dockerfile).
2.  Set the **Build Pack** to Docker Compose.
3.  Point to `docker-compose.prod.yml`.
4.  Add all environment variables in the Coolify UI, including `DATABASE_URL`.
5.  To migrate, you may need to run a "One-time command" or use a Pre-deployment script: `npx payload migrate` (depending on how Coolify handles the builder context). Alternatively, run the `migrator` service temporarily.
