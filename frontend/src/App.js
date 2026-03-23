import { BrowserRouter, Routes, Route } from "react-router-dom";
import HumanX from "./pages/HumanX";
import Comments from "./pages/comments";
import MySessions from "./pages/MySessions";
import Profile from "./pages/Profile";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import PersonalWorkspace from "./pages/PersonalWorkspace";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/humanx" element={<HumanX />} />
        <Route path="/humanx/comments" element={<Comments />} />
      <Route path="/sessions" element={<MySessions />} />
        <Route path="/profile/:id" element={<Profile />} />
        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* PERSONAL WORKSPACE */}
        <Route
          path="/personal"
          element={
            <ProtectedRoute>
              <PersonalWorkspace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

