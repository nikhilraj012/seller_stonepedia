"use client";

import ProtectedRoute from "../components/common/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
