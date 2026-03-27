# Authentication Setup Guide: CrowdVote AI

This document outlines the steps to implement a frictionless, secure authentication system supporting both **Email** and **Phone Number (SMS OTP)** using Firebase Authentication.

---

## Phase 1: Configure the Firebase Console
1. **Create a Project**: Go to the [Firebase Console](https://console.firebase.google.com/), click **Add Project**, and follow the prompts.
2. **Enable Authentication Methods**:
   - In the left menu, go to **Build > Authentication**.
   - Click the **Sign-in method** tab.
   - Enable **Email/Password**.
   - Enable **Phone** (Toggle the switch and click Save).
3. **Register Your App**:
   - Go to **Project Overview** and click the **Web icon (</>)**.
   - Register your app. Copy the `firebaseConfig` object provided; you will need it for Phase 2.

---

## Phase 2: Frontend Implementation
Install the Firebase SDK:
```bash
npm install firebase
```

Initialize Firebase in your project (e.g., `src/lib/firebase.js`):
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

---

## Phase 3: Backend Integration (Node.js)

### 1. Install Admin SDK
```bash
npm install firebase-admin
```

### 2. Configure Service Account
1. Go to **Project Settings > Service Accounts** in the Firebase Console.
2. Click **Generate New Private Key**.
3. Save the JSON file as `serviceAccountKey.json` in the `backend/` root directory.
4. **Crucial**: Add `serviceAccountKey.json` to your `.gitignore` to prevent leaking keys.

### 3. Initialize Admin SDK (`backend/src/config/firebase-admin.js`)
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
```

### 4. Verify Tokens in Middleware
Use the Admin SDK to verify the `Authorization: Bearer <ID_TOKEN>` header sent from the frontend.

---

## Phase 4: Finalizing Lifecycle
- **Auth State**: Use `onAuthStateChanged` in the frontend to track user sessions.
- **Sync**: The backend middleware will automatically sync Firebase users to your MongoDB `User` collection upon their first API request.
- **Security**: Always use `firebase-admin` on the server to verify tokens; never trust UIDs sent directly from the client.
