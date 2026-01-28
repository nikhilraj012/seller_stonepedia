'use client';

import React from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Dashboard from '../components/dashboard/Dashboard';

const page = () => {
  return (
    <ProtectedRoute>
      <div>
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
};

export default page;