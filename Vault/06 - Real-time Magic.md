# ⚡ Real-time Magic (Socket.io)

CrowdVote AI feels "alive" because of **Socket.io**. This technology allows the server to send data to your browser instantly, without you needing to refresh the page.

## 🤝 The Producer-Consumer Pattern
1.  **The Trigger**: A user in Thiruvananthapuram submits a prediction.
2.  **The Server**: Receives the vote, recalculates the **Swarm Consensus**, and "emits" a `consensusUpdate` message to everyone else online.
3.  **The Audience**: Your browser receives this message and updates the percentages in **The Arena** instantly.

---

## 🛠️ Implementation Details
### Backend (`lib/socket.js`)
- Initializes the Socket.io server and attaches it to the main HTTP engine.
- Shared globally so any controller can send updates.

### Frontend (`src/context/SocketContext.jsx`)
- Provides a global "listener".
- Any page (like `Arena.jsx`) wraps itself in this context to hear the server's heartbeat.

```javascript
// Example Listener in Arena.jsx
socket.on('consensusUpdate', (updatedData) => {
  setConstituencies(prev => prev.map(c => 
    c.constituencyId === updatedData.constituencyId ? { ...c, currentConsensus: updatedData.newConsensus } : c
  ));
});
```
