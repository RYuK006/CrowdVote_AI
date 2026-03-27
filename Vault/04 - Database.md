# 📊 Database & Data Seeding

CrowdVote AI uses **MongoDB**, a flexible "NoSQL" database. Here's a simplified look at our core data structures.

## 1. 📍 Constituency Schema
This is the heart of the app. It stores the 140 Kerala seats.
- **`constituencyId`**: Numerical ID (1-140).
- **`name`**: e.g., "Manjeshwar".
- **`district`**: e.g., "Kasaragod".
- **`candidates`**: List of objects containing `alliance`, `name`, `party`.
- **`historical2021`**: Previous election result (winner, margin, etc.).
- **`currentConsensus`**: Real-time swarm weight for LDF, UDF, NDA, Others.

## 2. 👤 User Schema
- **`role`**: Archivist (Newbie), Expert, or Oracle (Top Tier).
- **`rankScore`**: Determined by prediction accuracy.
- **`badges`**: Array of earned rewards.

## 3. 🗳️ Prediction Schema
- Each row links a **User** to a **Constituency** with their **Predicted Winner** and **Confidence**.

## 4. 🛰️ SystemConfig
- **`currentPhase`**: Pre-Election, Campaign, Final, etc.
- **`predictionLocked`**: Boolean flag to stop voting.

---

## 🌱 Data Seeding (How to Populate)
The system comes with a `seeder.js` script in the `backend` folder.
1. Ensure your `kerala_2026_and_2021_master_data.csv` is in the root.
2. Run `node seeder.js`.
3. The script will automatically parse the CSV, map all 140 constituencies, and insert them into your MongoDB collection.
