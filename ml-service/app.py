"""
Ichi Delivery - ML Service API
Flask server expose model ETA Deep Learning để backend Node.js gọi vào.
Port: 5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Cho phép Node.js backend gọi vào

# ─── Load model khi khởi động server ───────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "eta_deep_learning_model.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ [ML-Service] Model đã load thành công từ: {MODEL_PATH}")
except FileNotFoundError:
    print(f"❌ [ML-Service] Không tìm thấy model tại: {MODEL_PATH}")
    print("   → Hãy chạy 'python train_eta_real.py' trước!")
    model = None


# ─── Helper: Xác định weather condition từ string ──────────────────────────
def parse_weather(weather_str):
    """Chuyển đổi tên thời tiết → số (0=Nắng, 1=Mưa nhỏ, 2=Mưa to)"""
    mapping = {
        "sunny": 0, "clear": 0, "nắng": 0,
        "light_rain": 1, "drizzle": 1, "mưa nhỏ": 1,
        "heavy_rain": 2, "storm": 2, "mưa to": 2,
    }
    if isinstance(weather_str, str):
        return mapping.get(weather_str.lower(), 0)
    if isinstance(weather_str, (int, float)):
        return int(weather_str)
    return 0


# ─── Helper: Xác định traffic_multiplier từ giờ hiện tại ───────────────────
def estimate_traffic_multiplier(hour_of_day):
    """Ước tính hệ số kẹt xe dựa trên giờ trong ngày"""
    if 7 <= hour_of_day <= 9 or 17 <= hour_of_day <= 19:
        # Giờ cao điểm: trung bình hệ số 2.0
        return 2.0
    else:
        return 1.0


# ─── Route chính: Dự đoán ETA ──────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict_eta():
    """
    POST /predict
    Body JSON:
    {
        "distance_km": 5.2,       (bắt buộc)
        "weather": "sunny",        (tùy chọn, mặc định "sunny")
        "hour_of_day": 14          (tùy chọn, mặc định giờ hiện tại)
    }
    Response:
    {
        "success": true,
        "eta_minutes": 23,
        "message": "Dự kiến giao hàng trong 23 phút"
    }
    """
    if model is None:
        return jsonify({
            "success": False,
            "error": "Model chưa được load. Hãy train model trước."
        }), 503

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "Thiếu body JSON"}), 400

    # Lấy tham số từ request
    distance_km = data.get("distance_km")
    if distance_km is None:
        return jsonify({"success": False, "error": "Thiếu trường 'distance_km'"}), 400

    hour_of_day = data.get("hour_of_day", datetime.now().hour)
    weather_raw = data.get("weather", "sunny")
    weather_condition = parse_weather(weather_raw)
    traffic_multiplier = data.get("traffic_multiplier", estimate_traffic_multiplier(hour_of_day))

    # Chuẩn bị input cho model (thứ tự giống lúc train)
    features = np.array([[
        float(distance_km),
        int(hour_of_day),
        int(weather_condition),
        float(traffic_multiplier)
    ]])

    # Dự đoán
    eta_raw = model.predict(features)[0]
    eta_minutes = max(5, int(round(eta_raw)))  # Tối thiểu 5 phút

    return jsonify({
        "success": True,
        "eta_minutes": eta_minutes,
        "message": f"Dự kiến giao hàng trong {eta_minutes} phút",
        "debug": {
            "distance_km": distance_km,
            "hour_of_day": hour_of_day,
            "weather_condition": weather_condition,
            "traffic_multiplier": traffic_multiplier
        }
    })


# ─── Health check ───────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Ichi ML Service",
        "model_loaded": model is not None
    })


# ─── Khởi động server ───────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  🤖 ICHI ML SERVICE - ETA Prediction API")
    print("  Running on: http://localhost:5001")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=False)
