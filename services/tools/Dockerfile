FROM python:3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer libreoffice-calc libreoffice-impress ghostscript qpdf \
    ocrmypdf tesseract-ocr-eng fonts-dejavu fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN useradd --create-home --uid 10001 converter && mkdir /data && chown converter:converter /data && chmod 700 /data
USER converter
ENV HOME=/home/converter PYTHONUNBUFFERED=1
RUN python -c "from rembg import new_session; new_session('u2netp')"
COPY app.py early_access.py ./
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--limit-concurrency", "8", "--timeout-keep-alive", "5"]
