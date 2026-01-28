'use client';

import React from 'react';
import ProtectedRoute from '../components/common/ProtectedRoute';

const page = () => {
  return (
    <ProtectedRoute>
      <div>Dashboard Page</div>
    </ProtectedRoute>
  );
};

export default page;