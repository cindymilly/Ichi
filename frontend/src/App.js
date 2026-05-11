import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ichiTheme from './theme/ichiTheme';
import { AuthContext } from './AuthContext';

import LoginPage from './components/LoginPage';
import CustomerDashboard from './components/customer/CustomerDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Navbar from './components/layout/Navbar';

// Cửa bảo vệ Component
const PrivateRoute = ({ children, roleRequired }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null; // Có thể làm màn hình loading nhẹ ở đây
  if (!user) return <Navigate to="/login" />;
  
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  const getHomeRoute = () => {
    if (!user) return '/login';
    if (user.role === 'CUSTOMER') return '/customer';
    if (user.role === 'DRIVER') return '/driver';
    if (user.role === 'ADMIN') return '/admin';
    return '/login';
  };

  return (
    <ThemeProvider theme={ichiTheme}>
      <CssBaseline />
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer" element={<PrivateRoute roleRequired="CUSTOMER"><CustomerDashboard /></PrivateRoute>} />
          <Route path="/driver" element={<PrivateRoute roleRequired="DRIVER"><DriverDashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute roleRequired="ADMIN"><AdminDashboard /></PrivateRoute>} />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to={getHomeRoute()} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
