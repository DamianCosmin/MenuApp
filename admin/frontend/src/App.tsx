import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import LoginPage from './pages/LoginPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import TablesPage from './pages/TablesPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
