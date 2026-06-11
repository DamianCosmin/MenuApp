import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import OrdersPage from './pages/OrdersPage.tsx';
import TablesPage from './pages/TablesPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx';
import PaymentsPage from './pages/PaymentsPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import PublicRoute from './wrappers/PublicRoute.tsx';
import PrivateRoute from './wrappers/PrivateRoute.tsx';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
                <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
                <Route path="/tables" element={<PrivateRoute><TablesPage /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
                <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/sign-up" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
