FROM python:3.9-slim

WORKDIR /app

# Cài đặt các thư viện cần thiết
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn ML Service
COPY . .

# Expose port cho Flask API
EXPOSE 5001

# Lệnh mặc định sẽ được ghi đè trong docker-compose.yml
CMD ["python", "app.py"]
