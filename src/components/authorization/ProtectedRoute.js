import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ requiredRoles, userRole, children }) => {
    if (!userRole || !requiredRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

export default ProtectedRoute;