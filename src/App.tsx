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

interface User {
  email: string;
  password: string;
  name: string;
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
    }
  }, [currentUser]);

  const handleLogin = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleRegister = (email: string, password: string, name: string) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false;
    }
    const newUser = { email, password, name };
    setUsers([...users, newUser]);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="App">
      <Routes>
        {/* Главная страница - одна для всех */}
        <Route
          path="/"
          element={
            <CoursesPage
              isAuthenticated={isAuthenticated}
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onLoginClick={() => navigate("/auth")}
              onLogout={handleLogout}
            />
          }
        />

        {/* Страница авторизации */}
        <Route
          path="/auth"
          element={
            <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
          }
        />

        {/* Страница курса для неавторизованного пользователя */}
        <Route
          path="/course/:id"
          element={<CoursePage onLoginClick={() => navigate("/auth")} />}
        />

        {/* Страница курса для авторизованного пользователя */}
        <Route
          path="/course/:id/authenticated"
          element={
            <CoursePageAuthenticated
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onProfileClick={() => navigate("/profile")}
              onLogout={handleLogout}
              onAddCourse={() => {}}
            />
          }
        />

        {/* Страница личного профиля */}
        <Route
          path="/profile"
          element={
            <ProfilePage
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onLogout={handleLogout}
            />
          }
        />

        {/* Страница тренировки (видеоурок) */}
        <Route
          path="/training/:id"
          element={
            <TrainingPage
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onLogout={handleLogout}
            />
          }
        />

        {/* Страница тренировки с модальным окном прогресса */}
        <Route
          path="/training/:id/progress"
          element={
            <TrainingPageWithModal
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onLogout={handleLogout}
            />
          }
        />

        {/* Страница успеха (после сохранения прогресса) */}
        <Route
          path="/training/:id/success"
          element={
            <TrainingPageSuccess
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
              onLogout={handleLogout}
            />
          }
        />

        {/* Страница с обновленным прогрессом */}
        <Route
          path="/training/:id/updated"
          element={
            <TrainingPageUpdated
              userName={currentUser?.name || ""}
              userEmail={currentUser?.email || ""}
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
