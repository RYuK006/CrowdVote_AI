# 📦 Installation & Setup

This guide will help you get **CrowdVote AI** up and running on your local machine.

## 0. Prerequisites
You will need to install these three programs first:
1.  **Node.js** (v18 or higher) — [Download here](https://nodejs.org/)
2.  **MongoDB Atlas** (Free Cloud Database) — [Sign up here](https://www.mongodb.com/cloud/atlas)
3.  **Git** — [Download here](https://git-scm.com/)

---

## 🚀 Step 1: Clone the Project
Open your terminal (Command Prompt or PowerShell) and run:
```bash
git clone https://github.com/RYuK006/CrowdVote_AI.git
cd CrowdVote_AI
```

## 🧠 Step 2: Setup the Backend
1. Go into the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=any_random_secure_string
   ```
4. **Seed the Database**: This imports the 140 Kerala constituencies from the CSV file.
   ```bash
   node seeder.js
   ```
5. **Start the Brain**: `npm run dev`

## 🖥️ Step 3: Setup the Frontend
1. Open a **new** terminal window.
2. Go into the root folder and install dependencies: `npm install`
3. Create a `.env` file in the root folder for Firebase (get these from your Firebase Console):
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   ```
4. **Start the App**: `npm run dev`

---

## ✅ Verification
- Open your browser to `http://localhost:5174`.
- You should see the **CrowdVote AI** landing page.
- Try to register a new account to test the database connection.
