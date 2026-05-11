# 🍱 Ichi — AI-Powered Food Delivery Platform

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Web3](https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=web3dotjs&logoColor=white)

**A full-stack, enterprise-grade food delivery web application with an integrated AI/ML microservice for real-time ETA prediction.**

</div>

---

## ✨ Overview

Ichi is a personal project built to explore the intersection of **full-stack web development**, **AI/ML integration**, and **Web3 technology** in a real-world application scenario.

The system simulates a production-ready food delivery platform — from browsing restaurants and placing orders to real-time driver tracking and on-chain payment settlement — backed by a machine learning model that predicts delivery time based on distance, weather, and traffic conditions.

---

## 🧠 AI / ML Feature — ETA Prediction

The core AI feature is a standalone **ML microservice** that predicts estimated delivery time (ETA) for every order.

| Detail | Description |
|---|---|
| **Model** | Multi-Layer Perceptron (MLP) — `MLPRegressor` via scikit-learn |
| **Architecture** | 3 hidden layers: 128 → 64 → 32 neurons |
| **Training data** | 25,000 synthetic delivery records |
| **Input features** | Distance (km), hour of day, weather condition, traffic multiplier |
| **Output** | Predicted ETA in minutes |
| **Rush hour logic** | Traffic multiplier ×1.5–2.5 during 07:00–09:00 and 17:00–19:00 |
| **Weather penalty** | +30% per rain level (light → heavy) |
| **API** | `POST /predict` — called by Node.js backend on every order |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT                          │
│          React 18 + MUI v5 + Socket.io              │
│          Web3 / MetaMask Integration                │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / WebSocket
┌──────────────────────▼──────────────────────────────┐
│                    BACKEND                          │
│         Node.js + Express + Socket.io               │
│         MongoDB (Mongoose) + JWT Auth               │
│         Hardhat / Solidity Smart Contracts          │
└──────────┬───────────────────────────┬──────────────┘
           │ REST                      │ REST
┌──────────▼──────────┐   ┌───────────▼──────────────┐
│    ML SERVICE       │   │        MongoDB Atlas      │
│  Python + Flask     │   │   25+ Collections Schema  │
│  scikit-learn MLP   │   │                          │
│  POST /predict      │   └──────────────────────────┘
└─────────────────────┘
```

---

## 🌟 Key Features

- **AI ETA Prediction** — ML model predicts delivery time on every order in real time
- **Real-time Order Tracking** — Driver location simulation via Socket.io
- **Web3 Payment** — On-chain payment flow using MetaMask + Solidity Smart Contract
- **Master JSON Schema** — 25+ MongoDB collections as a single source of truth
- **Role-based System** — Customer, Driver, Merchant, Admin, Support roles
- **JWT Authentication** — Secure auth with token-based middleware
- **Dockerized** — Full multi-service setup with Docker Compose

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Material UI v5, Emotion |
| **Backend** | Node.js, Express, Socket.io, Mongoose, JWT |
| **ML Service** | Python 3, Flask, scikit-learn, NumPy, pandas, joblib |
| **Database** | MongoDB Atlas |
| **Web3** | ethers.js, Hardhat, Solidity |
| **DevOps** | Docker, Docker Compose, Netlify (frontend) |

---

## 📂 Project Structure

```
Ichi/
├── frontend/          # React web application
│   └── src/
│       ├── components/
│       │   ├── customer/   # CustomerDashboard, order flow
│       │   ├── driver/     # DriverDashboard, live tracking
│       │   └── admin/      # Admin panel
│       ├── services/       # Axios API calls
│       └── theme/          # MUI theme config
├── backend/           # Node.js REST API + Socket server
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # JWT auth
│   └── contracts/          # IchiDelivery.sol (Smart Contract)
├── ml-service/        # Flask ETA prediction microservice
│   ├── app.py              # Flask API (POST /predict)
│   ├── train_eta_real.py   # MLP model training script
│   └── requirements.txt
├── docker/            # Dockerfiles + docker-compose.yml
├── schema.json        # Master data schema (25+ collections)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB Atlas account (or local MongoDB)
- Docker & Docker Compose (optional)
- MetaMask browser extension (for Web3 features)

### 1. Clone the repository
```bash
git clone https://github.com/cindymilly/Ichi.git
cd Ichi
```

### 2. Setup environment variables
```bash
cp backend/.env.example backend/.env
# Fill in your MongoDB URI and JWT secret
```

### 3. Start ML Service
```bash
cd ml-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python train_eta_real.py   # Train the model first
python app.py              # Runs on http://localhost:5001
```

### 4. Start Backend
```bash
cd backend
npm install
npm run dev                # Runs on http://localhost:5000
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm start                  # Runs on http://localhost:3000
```

### Or — Run everything with Docker
```bash
cd docker
docker-compose up --build
```

---

## 🔐 Web3 Integration

1. Install **MetaMask** browser extension
2. Connect to Local Hardhat Network or configured Testnet
3. Use test accounts with tokens to try the crypto payment flow
4. Smart contract: `backend/contracts/IchiDelivery.sol`

---

## 📊 ML Model Performance

The MLP model was trained on 25,000 synthetic delivery records with the following parameters:

```
Base delivery speed : 3 min/km
Food prep time      : 5–15 min (random)
Rush hour factor    : ×1.5 – ×2.5
Rain factor         : +30% per level
Model architecture  : MLP [128 → 64 → 32]
```

To retrain the model from scratch:
```bash
cd ml-service
python train_eta_real.py
```

---

## 👤 Author

**Pham Minh Quan**
Fresher AI Engineer · Ho Chi Minh City, Vietnam

[![GitHub](https://img.shields.io/badge/GitHub-cindymilly-181717?style=flat&logo=github)](https://github.com/cindymilly)

---

## 📄 License

This project is built for **portfolio and learning purposes**.
