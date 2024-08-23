# create djanjo project
django-admin startproject project_name 

# start the backend on localhost
python manage.py runserver 

# create new app where websocket connections are handled
python manage.py startapp chat

# spin up langflow locally
langflow % python -m langflow run

# Notes:
# https://stackoverflow.com/questions/74668540/websocket-connection-not-working-in-django-channels-websocket-connection-to-w

# Navigate to the directory and build the image
docker build -t your-docker-username/django-backend:latest .
docker build -t your-docker-username/langflow-service:latest .

# Push the updated Langflow image
docker push your-docker-username/langflow-service:latest

# Push the updated Django backend image
docker push your-docker-username/django-backend:latest

# Deploy the stack
docker stack deploy -c docker-compose.yml mystack

