import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { AuthCtx } from "./AuthContext";

import Dashboard from "./pages/Dashboard";
import Settings  from "./pages/Settings";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import ProfileSidebar from "./components/ProfileSidebar";

/**
 * Protect a route: if no token, kick to /login.
 */
function Protected({ children }: { children: JSX.Element }) {
  const { token } = React.useContext(AuthCtx);
  return token ? children : <Navigate to="/login" replace />;
}

/**
 * Public‑only route: if logged in, redirect to dashboard.
 */
function Public({ children }: { children: JSX.Element }) {
  const { token } = React.useContext(AuthCtx);
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/*  full‑height flex layout: sidebar (when logged‑in) + main */}
        <div className="min-h-screen flex">
          {/* Sidebar only visible when authenticated */}
          <AuthCtx.Consumer>
            {({ token }) => token && <ProfileSidebar />}
          </AuthCtx.Consumer>

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/login"  element={<Public><Login /></Public>} />
              <Route path="/signup" element={<Public><Signup /></Public>} />

              <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
              <Route path="/settings"  element={<Protected><Settings  /></Protected>} />

              {/* default */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}