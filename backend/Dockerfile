# root/backend/Dockerfile
# production-ready example using Gunicorn + Uvicorn workers
FROM python:3.13.7-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# install build deps if any (adjust if you don't need build-essential)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# drop privileges
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# change "main:app" if your module or variable name differ
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "main:app", "--bind", "0.0.0.0:8000", "--workers", "2"]

