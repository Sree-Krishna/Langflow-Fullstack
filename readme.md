# Django and Langflow Integration

This project demonstrates how to set up a Django project that interacts with a Langflow instance locally. It includes WebSocket connections handled by Django Channels and the deployment of the application using Docker.

## Prerequisites

- Python 3.x
- Django
- Docker
- Langflow

## Setup and Running Locally

### 1. Create a Django Project

First, create a new Django project by running:

```bash
django-admin startproject project_name
```

### 2. Start the Django Backend on Localhost

Navigate to your project directory and start the development server:

```bash
python manage.py runserver
```

### 3. Create a New App for WebSocket Connections

Within your Django project, create a new app to handle WebSocket connections:

```bash
python manage.py startapp chat
```

### 4. Spin Up Langflow Locally
Run the Langflow service locally by executing:

```bash
langflow % python -m langflow run
```

### 5. Notes
If you encounter issues with WebSocket connections, refer to this helpful Stack Overflow discussion.

## Docker Setup and Deployment
### 6. Build the Docker Images
Navigate to the appropriate directories and build the Docker images for the Django backend and Langflow service:

```bash
docker build -t your-docker-username/django-backend:latest .
docker build -t your-docker-username/langflow-service:latest .
```

### 7. Push the Docker Images to a Registry
Push the updated images to your Docker registry:

```bash
docker push your-docker-username/langflow-service:latest
docker push your-docker-username/django-backend:latest
```

### 8. Deploy the Stack Using Docker Compose
Deploy the stack using Docker Compose:

```bash
docker stack deploy -c docker-compose.yml mystack
```