# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /langflow

# Install necessary system packages
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /langflow/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the langflow server script and related files
COPY . /langflow/

# Expose the port the app runs on
EXPOSE 8501

# Run the langflow server
CMD ["python", "langflow_server.py"]

# uncomment below to run in production
# CMD ["gunicorn", "--bind", "0.0.0.0:8501", "langflow_server:app"]
