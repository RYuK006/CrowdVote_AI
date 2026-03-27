# 🗳️ CrowdVote AI: The Electoral OS

A high-fidelity, real-time election prediction and tracking platform for the **Kerala 2026 Assembly Elections**. Harnessing the "Wisdom of the Swarm" to predict electoral outcomes using historical data and real-time user consensus.

---

## 📂 Project Documentation (Obsidian Vault)
For detailed instructions on how to rebuild, maintain, and understand this project, please explore the internal documentation vault:
- **[View Documentation Vault](./Vault/00%20-%20Start%20Here.md)**

The vault includes:
- **System Architecture**: Mermaid diagrams of the full-stack flow.
- **Installation Guide**: Step-by-step setup for MongoDB, Node.js, and Firebase.
- **Database Schema**: Explanation of the 140 constituency datasets.
- **Real-time Engine**: How Socket.io powers the live "Arena".

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Firebase project for Auth (Email + Phone OTP)

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with MONGODB_URI and JWT_SECRET
node seeder.js # Seed 140 constituencies
npm run dev
```

### 3. Frontend Setup
```bash
npm install
# Configure .env with Firebase credentials
npm run dev
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion
- **Backend**: Node.js, Express, Socket.io
- **Database**: MongoDB (Mongoose)
- **Auth**: Firebase (Google + Phone OTP)

## 🏆 Key Features
- **The Arena**: Live swarm-driven prediction dashboard.
- **Micro-Targeting**: Deep-dive into every seat in Kerala.
- **Influence System**: User ranking based on historical accuracy.
- **Real-time Sync**: Global state updates via WebSockets.

---
*Created by [Antigravity](https://google.com) for RYuK006*
