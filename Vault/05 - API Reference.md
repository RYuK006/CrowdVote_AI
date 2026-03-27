# 🌐 Web API Reference

The frontend and backend communicate through "endpoints". Here are the most important ones for building the system:

## 1. 🗳️ Predictions (`/api/predictions`)
- **`GET /constituencies`**: Fetches all 140 seats and current swarm consensus.
- **`POST /submit`**: Used when a user locks in their vote for a candidate.

## 2. 🛡️ Authentication (`/api/auth`)
- **`POST /register`**: Handles new user signups.
- **`POST /login`**: Fetches a security token (JWT) to allow further actions.

## 3. 👤 User Data (`/api/users`)
- **`GET /me/stats`**: Returns your rank, influence, and earned badges.
- **`GET /leaderboard`**: Shows the top 50 "Oracles" in the system.

## 4. 🚀 Admin (`/api/admin`)
- **`GET /config`**: Used to check the current election phase (e.g., Campaign).
- **`PUT /config`**: (Admin Only) Used to switch phases and lock/unlock predictions.

---

### *Refactoring Tip*
If you are rebuilding the API, always use the `apiRequest` helper in `src/lib/api.js`. This automatically attaches the user's security token to every request so they don't have to keep logging in.
