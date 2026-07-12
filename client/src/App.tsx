import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import Placeholder from './pages/Placeholder';
import NotFound from './pages/NotFound';
import DashboardLayout from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import OrganizationSetup from './pages/admin/OrganizationSetup';
import EmployeeDirectory from './pages/admin/EmployeeDirectory';

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* authenticated — any role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<Placeholder title="Assets" />} />
          <Route path="/allocation" element={<Placeholder title="Allocation & Transfer" />} />
          <Route path="/booking" element={<Placeholder title="Resource Booking" />} />
          <Route path="/maintenance" element={<Placeholder title="Maintenance" />} />
          <Route path="/notifications" element={<Placeholder title="Notifications" />} />

          {/* authenticated — role-restricted */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/organization-setup" element={<OrganizationSetup />} />
            <Route path="/employees" element={<EmployeeDirectory />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'ASSET_MANAGER']} />}>
            <Route path="/audit" element={<Placeholder title="Audit" />} />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
