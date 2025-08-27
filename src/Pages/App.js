// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Components/Firebase";
import Dashboard from "../Pages/Dashboard";
import Category from "../Pages/Category";
import EditPost from "../Pages/EditPost";
import CreatePost from "../Pages/CreatePost";
import LoginD from "../Pages/LoginD";
import Login from "../Pages/Login";
import PrivatePage from "../Pages/PrivatePage";
import FullSizePage from "../Pages/FullSizePage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Route protection functions
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (currentUser) return <Navigate to="/Privatepage" replace />;
    return children;
  };

  const DashboardProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/loginD" replace />;
    return children;
  };

  const LoginDPublicRoute = ({ children }) => {
    if (currentUser) return <Navigate to="/dashboard" replace />;
    return children;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        {/* Loading spinner remains same */}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/loginD"
          element={
            <LoginDPublicRoute>
              <LoginD />
            </LoginDPublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/Privatepage"
          element={
            <ProtectedRoute>
              <PrivatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardProtectedRoute>
              <Dashboard />
            </DashboardProtectedRoute>
          }
        />

        {/* Other protected routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/category"
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editpost/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route
          path="/"
          element={
            <Navigate to={currentUser ? "/Privatepage" : "/login"} replace />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={currentUser ? "/Privatepage" : "/login"} replace />
          }
        />

        <Route path="/full-size-page/:postId" element={<FullSizePage />} />
      </Routes>
    </Router>
  );
}

export default App;