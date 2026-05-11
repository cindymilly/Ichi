import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error
import joblib
import time

def generate_realistic_data(num_samples=25000):
    print("==================================================")
    print(" CHƯƠNG TRÌNH TRÍ TUỆ NHÂN TẠO - ETA PREDICTION ")
    print("==================================================")
    print("⏳ [1/4] Đang thu thập và tổng hợp 25,000 bản ghi dữ liệu giao hàng...")
    np.random.seed(42)
    
    # Khoảng cách từ 1km đến 15km
    distance_km = np.random.uniform(1.0, 15.0, num_samples)
    
    # Giờ trong ngày (0-23)
    hour_of_day = np.random.randint(0, 24, num_samples)
    
    # Trạng thái thời tiết: 0 = Nắng, 1 = Mưa nhỏ, 2 = Mưa to
    weather = np.random.choice([0, 1, 2], num_samples, p=[0.7, 0.2, 0.1])
    
    # Xây dựng ma trận kẹt xe (Rush hour)
    traffic_multiplier = np.ones(num_samples)
    for i in range(num_samples):
        if 7 <= hour_of_day[i] <= 9 or 17 <= hour_of_day[i] <= 19:
            traffic_multiplier[i] = np.random.uniform(1.5, 2.5) # Kẹt xe nhân 1.5 đến 2.5 lần
        else:
            traffic_multiplier[i] = np.random.uniform(0.8, 1.2) # Đường thông thoáng
            
    weather_multiplier = 1.0 + (weather * 0.3) # Mưa to làm chậm thêm 60%
    
    # Base: 3 phút / km. Quán làm món: 5-15 phút.
    prep_time = np.random.uniform(5, 15, num_samples)
    base_travel_time = distance_km * 3 
    
    # Kết quả thực tế
    actual_eta = (base_travel_time * traffic_multiplier * weather_multiplier) + prep_time
    
    df = pd.DataFrame({
        'distance_km': distance_km,
        'hour_of_day': hour_of_day,
        'weather_condition': weather,
        'traffic_multiplier': traffic_multiplier,
        'actual_eta_minutes': actual_eta
    })
    
    df.to_csv("delivery_data.csv", index=False)
    print("✅ Khai thác dữ liệu thành công! Đã tạo file 'delivery_data.csv'.")
    return df

def train_model():
    df = generate_realistic_data()
    
    print("\n🧠 [2/4] Khởi tạo mạng nơ-ron (Multi-Layer Perceptron) với 3 Lớp Ẩn (128x64x32)...")
    X = df[['distance_km', 'hour_of_day', 'weather_condition', 'traffic_multiplier']]
    y = df['actual_eta_minutes']
    
    # Chia 80% để học, 20% để làm bài kiểm tra
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    nn_model = MLPRegressor(hidden_layer_sizes=(128, 64, 32), 
                            activation='relu', 
                            solver='adam', 
                            max_iter=300,
                            learning_rate_init=0.01,
                            verbose=True,
                            random_state=42)
    
    print("🚀 [3/4] BẮT ĐẦU TRAINING THỰC THỤ... (Vui lòng đợi vài giây)")
    start_time = time.time()
    nn_model.fit(X_train, y_train)
    end_time = time.time()
    
    print(f"\n✅ Mô hình đã 'Tiến Hóa' xong trong {round(end_time - start_time, 2)} giây!")
    
    # Kiểm tra trí thông minh của AI
    predictions = nn_model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    print(f"📊 [CHẤM ĐIỂM] Sai số trung bình (MAE) khi dự đoán: Chỉ lệch {round(mae, 2)} phút!")
    
    # Lưu Model thành file nhị phân
    print("\n💾 [4/4] Đang đóng gói Neural Network vào file nhị phân...")
    joblib.dump(nn_model, "eta_deep_learning_model.pkl")
    print("🎉 LƯU MODEL THÀNH CÔNG: 'eta_deep_learning_model.pkl'")
    
    # Demo Model ngay lập tức
    print("\n--- 🤖 AI DEMO TRỰC TIẾP VỚI ĐƠN HÀNG MỚI ---")
    
    # Test 1: Giao gần, ban trưa, trời nắng
    test_1 = np.array([[2.0, 12, 0, 1.0]])
    pred_1 = nn_model.predict(test_1)
    print(f"Trường hợp 1: Cách 2km, lúc 12h trưa, trời nắng")
    print(f"=> AI phán quyết: Sẽ giao tới trong {int(pred_1[0])} phút!\n")
    
    # Test 2: Giao xa, kẹt xe, trời mưa to
    test_2 = np.array([[10.0, 18, 2, 2.5]])
    pred_2 = nn_model.predict(test_2)
    print(f"Trường hợp 2: Cách 10km, lúc 18h (Giờ cao điểm), trời mưa TO!")
    print(f"=> AI phán quyết: Sẽ giao tới trong {int(pred_2[0])} phút!")
    print("==================================================\n")

if __name__ == "__main__":
    import warnings
    warnings.filterwarnings('ignore')
    train_model()
