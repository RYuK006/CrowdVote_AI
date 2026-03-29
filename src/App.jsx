import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Arena from './pages/Arena';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import Rewards from './pages/Rewards';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Phases from './pages/Phases';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Voting from './pages/Voting';
import { Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/reset-password" element={<Navigate to="/signin" replace />} />
            <Route path="/dashboard" element={<Navigate to="/voting" replace />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
            <Route path="/phases" element={<Phases />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Layout>
      </SocketProvider>
    </Router>
  );
}

export default App;
