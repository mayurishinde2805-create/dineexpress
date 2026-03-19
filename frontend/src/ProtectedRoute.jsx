import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = localStorage.getItem('role');

    // 1. Not Logged In
    if (!user) {
        if (role === 'admin') return <Navigate to="/admin/welcome" replace />;
        if (role === 'kitchen') return <Navigate to="/kitchen/login" replace />;
        return <Navigate to="/login" replace />;
    }

    // 2. Logged In but Wrong Role
    if (role && userRole !== role) {
        // Special case: Admin can typically access everything, but let's be strict for dashboards
        // If I am a Customer (userRole=customer) trying to access Admin (role=admin)
        if (role === 'admin') {
            // Redirect to Admin Login so they can switch accounts or verify
            // Alternatively, /admin/welcome
            return <Navigate to="/admin/welcome" replace />;
        }

        // If I am a Customer trying to access Kitchen
        if (role === 'kitchen') {
            return <Navigate to="/kitchen/login" replace />;
        }

        // If I am Admin accessing Kitchen? Usually allowed, but if strict:
        if (role === 'kitchen' && userRole === 'admin') {
            // Allow Admin to view Kitchen? Yes, usually.
            return children;
        }

        // Default unauthorized redirect
        return <Navigate to="/login" replace />;
    }

    return children;
}
