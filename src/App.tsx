import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import CoursesPage from "./pages/CoursesPage/CoursesPage";
import CoursePage from "./pages/CoursePage/CoursePage";
import CoursePageAuthenticated from "./pages/CoursePageAuthenticated/CoursePageAuthenticated";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import TrainingPage from "./pages/TrainingPage/TrainingPage";
import TrainingPageWithModal from "./pages/TrainingPageWithModal/TrainingPageWithModal";
import TrainingPageSuccess from "./pages/TrainingPageSuccess/TrainingPageSuccess";
import TrainingPageUpdated from "./pages/TrainingPageUpdated/TrainingPageUpdated";
import { authService } from "./services/auth.service";

interface User {
  email: string;
  name: string;
  token: string;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      if (!response.token) {
        throw new Error("Не получен токен");
      }

      const userName = email.split("@")[0];
      const newUser = {
        email: email,
        name: userName,
        token: response.token,
      };

      setCurrentUser(newUser);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      await authService.register(email, password);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <CoursesPage
              isAuthenticated={isAuthenticated}
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLoginClick={() => navigate("/auth")}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/auth"
          element={
            <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
          }
        />

        <Route
          path="/course/:id"
          element={<CoursePage onLoginClick={() => navigate("/auth")} />}
        />

        <Route
          path="/course/:id/authenticated"
          element={
            <CoursePageAuthenticated
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onProfileClick={() => navigate("/profile")}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProfilePage
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/training/:id"
          element={
            <TrainingPage
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/training/:id/progress"
          element={
            <TrainingPageWithModal
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/training/:id/success"
          element={
            <TrainingPageSuccess
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/training/:id/updated"
          element={
            <TrainingPageUpdated
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              token={currentUser?.token}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
