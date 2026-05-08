# Ichi Food Delivery System 🚀

Ichi là một hệ thống đặt và giao đồ ăn cấp độ doanh nghiệp (Enterprise Super App), được thiết kế với kiến trúc dữ liệu toàn diện (Comprehensive Data Schema), tích hợp **Web3 Smart Contracts**, và **Mô hình AI dự đoán ETA (Estimated Time of Arrival)**.

Dự án cung cấp một giao diện người dùng (UI/UX) ở mức độ hoàn thiện cao, hỗ trợ tracking theo thời gian thực và mô phỏng chính xác luồng giao hàng từ nhà hàng đến tay khách hàng.

## 🌟 Tính năng nổi bật

- **Kiến trúc Dữ liệu Đa chiều (Master Schema)**: Hỗ trợ hệ sinh thái lớn bao gồm Customer, Driver, Merchant (Nhà hàng), Admin và Support.
- **Tích hợp Web3 & Crypto**: Hỗ trợ thanh toán qua Ví Web3 (MetaMask, Ethers.js) cùng với lưu vết Giao dịch qua Smart Contract.
- **Dự đoán ETA bằng Machine Learning**: Dịch vụ ML độc lập (Flask + Scikit-Learn) chạy mô hình Machine Learning dự đoán thời gian giao hàng thực tế dựa trên dữ liệu lịch sử (`delivery_data.csv`).
- **Real-time Order Tracking**: Theo dõi đơn hàng theo thời gian thực với Socket.io, bao gồm mô phỏng di chuyển tài xế và gọi điện.
- **Giao diện Immersive UI/UX**: Tích hợp các hiệu ứng Dynamic Visuals cao cấp (cinematic holiday-themed backgrounds, gradient flows) với Material UI và React.

## 🏗️ Kiến trúc Hệ thống (Tech Stack)

Dự án được chia thành 3 modules chính:

### 1. Frontend (`/frontend`)
Ứng dụng Web dành cho người dùng được xây dựng bằng React.
- **Frameworks/Libraries**: React 18, React Router v6.
- **UI/Styling**: Material-UI (MUI v5), Emotion.
- **Tích hợp Web3**: `ethers` cho kết nối MetaMask và Smart Contracts.
- **Real-time**: `socket.io-client`.
- **API calls**: `axios`.

### 2. Backend (`/backend`)
Server xử lý logic trung tâm của ứng dụng.
- **Runtime**: Node.js với Express framework.
- **Database**: MongoDB thông qua Mongoose (tham chiếu cấu trúc tại `schema.json`).
- **Real-time Engine**: `socket.io` cho chat và tracking tài xế.
- **Web3**: `ethers` và `hardhat` hỗ trợ Smart Contract tương tác.
- **Security & Auth**: `jsonwebtoken` (JWT), `cors`, `dotenv`.

### 3. Machine Learning Service (`/ml-service`)
Microservice chịu trách nhiệm dự đoán thời gian hoàn thành chuyến đi.
- **Ngôn ngữ**: Python 3.
- **Web Framework**: Flask (`flask`, `flask-cors`).
- **ML Frameworks**: `scikit-learn`, `pandas`, `numpy`, `joblib`.
- **Model**: Mô hình phân tích dữ liệu giao hàng (`eta_deep_learning_model.pkl`).

## 📂 Cấu trúc Thư mục

```text
Ichi2/
├── backend/                  # REST API & Socket server (Node.js)
├── frontend/                 # React UI application
├── ml-service/               # Flask API cho mô hình AI dự đoán ETA
├── docker/                   # Cấu hình Docker (Dockerfile, docker-compose)
├── dataset/                  # Dữ liệu train mô hình
├── delivery_data.csv         # Tập dữ liệu lịch sử cho ML model
├── eta_deep_learning_model.pkl # Pre-trained Machine Learning Model
└── schema.json               # Ichi Master Schema định nghĩa Cấu trúc Dữ liệu Cốt lõi
```

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Cài đặt ML Service (Dự đoán ETA)
```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate  # (hoặc .venv\Scripts\activate trên Windows)
pip install -r requirements.txt
python app.py  # Hoặc script khởi chạy Flask tương ứng
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
npm start
```

## 🔐 Web3 Integration
Để sử dụng tính năng thanh toán bằng Web3:
1. Đảm bảo trình duyệt đã cài đặt tiện ích **MetaMask**.
2. Kết nối MetaMask với mạng lưới phù hợp (Local Hardhat Network hoặc Testnet được cấu hình trong dự án).
3. Sử dụng các tài khoản test có sẵn token để thử nghiệm luồng thanh toán.

## 📝 Thông tin Cấu trúc Dữ liệu (`schema.json`)
Dự án sử dụng file `schema.json` như một **Single Source of Truth** cho toàn bộ dữ liệu. Nó định nghĩa các Collections quan trọng:
- `Users`, `CustomerProfiles`, `DriverProfiles`, `Restaurants`
- `Menus`, `Orders`, `Payments`, `Reviews`, `Promotions`
- `ChatMessages`, `Notifications`, `AuditLogs`

Hệ thống được thiết kế để dễ dàng scale lên tầm vóc Enterprise.
# Ichi
