# Ctrls-BUI

Frontend application built with Vite.

## Prerequisites

* Node.js 18+
* npm
* Docker (for local development/testing)

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Docker Usage (Development/Testing Only)

> **Note:** Docker is currently used **only for development and testing purposes** to simplify local setup.
>
> **Production deployments do not use Docker** and follow the standard frontend deployment process.

### Build Docker Image

```bash
docker build -t ctrls-bui .
```

Verify the image:

```bash
docker images
```

---

### Run Development Server Using Docker

```bash
docker run -d \
  --name ctrls-bui-container \
  -p 5173:5173 \
  ctrls-bui
```

Access the application:

```text
http://localhost:5173
```

---

### Run with Hot Reload (Recommended for Development)

```bash
docker run -d \
  --name ctrls-bui-container \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  ctrls-bui
```

This allows code changes on the host machine to automatically reflect inside the running container.

---

### View Container Logs

```bash
docker logs -f ctrls-bui-container
```

---

### Stop Container

```bash
docker stop ctrls-bui-container
```

---

### Start Existing Container

```bash
docker start ctrls-bui-container
```

---

### Remove Container

```bash
docker rm -f ctrls-bui-container
```

---

### Remove Docker Image

```bash
docker rmi ctrls-bui
```

If the image is in use:

```bash
docker rm -f ctrls-bui-container
docker rmi ctrls-bui
```

---

## Production Build

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Production Deployment

* Docker is **not used** in production.
* Production deployments use the generated static assets from the `dist/` directory.
* Docker configurations should be considered **development/testing utilities only**.
