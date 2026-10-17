import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "./App.css";

import AdminPage from "./pages/adminPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/homePage.jsx";
import TestPage from "./pages/test.jsx";

import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentCancelledPage from "./pages/PaymentCancelledPage.jsx";

// =====================================================
// LOGIN REQUIRED ROUTE
// =====================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token == null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div
          className="
          w-full
          min-h-screen
          bg-slate-500
        "
        >
          <Toaster position="top-right" />

          <Routes>
            {/* =========================================
              MAIN WEBSITE
          ========================================= */}

            <Route path="/*" element={<HomePage />} />

            {/* =========================================
              PUBLIC AUTH PAGES
          ========================================= */}

            <Route path="/register" element={<RegisterPage />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/payment/success" element={<PaymentSuccessPage />} />

            <Route
              path="/payment/cancelled"
              element={<PaymentCancelledPage />}
            />

            {/* =========================================
              ADMIN - LOGIN REQUIRED
          ========================================= */}

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* =========================================
              TEST - LOGIN REQUIRED
          ========================================= */}

            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
