import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from '../auth/AuthContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RoleRoute } from '../auth/RoleRoute';
import { RoleRedirect } from '../pages/auth/RoleRedirect';

// Public
import { Home } from '../pages/Home';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { VerifyEmail } from '../pages/auth/VerifyEmail';
import { VerifyPhone } from '../pages/auth/VerifyPhone';
import { OAuth2Callback } from '../pages/auth/OAuth2Callback';
// Customer layout
import { CustomerLayout } from '../layouts/CustomerLayout';

// Customer pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { ApplicationsHistory } from '../pages/customer/ApplicationsHistory';
import { Profile } from '../pages/customer/Profile';
import { Help } from '../pages/customer/Help';

import { Kyc } from '../pages/customer/application/Kyc';
import { Eligibility } from '../pages/customer/application/Eligibility';
import { EmiSelection } from '../pages/customer/application/EmiSelection';
import { BankAccount } from '../pages/customer/application/BankAccount';
import { Declaration } from '../pages/customer/application/Declaration';
import { Selfie } from '../pages/customer/application/Selfie';

import {
  CustomerApplicationDetails,
} from '../pages/customer/ApplicationDetails';

// Admin
import { AdminDashboard } from '../pages/admin/AdminDashboard';

import {
  ApplicationDetails as AdminApplicationDetails,
} from '../pages/admin/ApplicationDetails';

// Super Admin
import {
  SuperAdminDashboard,
} from '../pages/super-admin/SuperAdminDashboard';

// Error pages
import {
  NotFound,
  Unauthorized,
} from '../pages/ErrorPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          {/* Landing page */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/oauth2/callback"
            element={<OAuth2Callback />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/verify-phone"
            element={<VerifyPhone />}
          />


          {/* =====================================================
              ROLE REDIRECT
              
              /app is the authenticated entry point.
              It sends the user to the correct dashboard
              according to their role.
          ===================================================== */}

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CUSTOMER ROUTES
          ===================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <CustomerDashboard />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* All customer applications */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <ApplicationsHistory />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Individual customer application */}
          <Route
            path="/applications/:applicationId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <CustomerApplicationDetails />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Customer profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Profile />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Customer help */}
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Help />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              CUSTOMER LOAN APPLICATION WORKFLOW
          ===================================================== */}

          <Route
            path="/application/kyc"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Kyc />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/eligibility"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Eligibility />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/emi"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <EmiSelection />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/bank-account"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <BankAccount />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/declaration"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Declaration />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/selfie"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['CUSTOMER']}>
                  <CustomerLayout>
                    <Selfie />
                  </CustomerLayout>
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ADMIN ROUTES
              
              ADMIN ONLY.
              SUPER_ADMIN does NOT get access to these routes.
          ===================================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applications/:applicationId"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminApplicationDetails />
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              SUPER ADMIN ROUTES
              
              SUPER_ADMIN ONLY.
              Currently only manages administrators.
          ===================================================== */}

          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['SUPER_ADMIN']}>
                  <SuperAdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ERROR ROUTES
          ===================================================== */}

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          <Route
            path="/404"
            element={<NotFound />}
          />


          {/* =====================================================
              FALLBACK
          ===================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/404"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};