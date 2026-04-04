import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import LoginError from "../../components/LoginError/LoginError";
import RegisterError from "../../components/RegisterError/RegisterError";
import { courses } from "../../data/courses";
import styles from "./AuthPage.module.css";

interface AuthPageProps {
  onLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  onRegister: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await onLogin(email, password);
      if (result.success) {
        navigate("/");
      } else {
        setErrorMessage(
          result.message || "Пароль введен неверно, попробуйте еще раз.",
        );
        setShowError(true);
      }
    } catch (err) {
      setErrorMessage("Произошла ошибка при входе. Попробуйте позже.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (
    email: string,
    password: string,
    name: string,
  ) => {
    setIsLoading(true);
    try {
      const result = await onRegister(email, password, name);
      if (result.success) {
        setShowSuccessMessage(true);
        setIsLogin(true);
        setShowError(false);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        setErrorMessage(
          result.message || "Данная почта уже используется. Попробуйте войти.",
        );
        setShowError(true);
      }
    } catch (err) {
      setErrorMessage("Произошла ошибка при регистрации. Попробуйте позже.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      <button className={styles.loginButton} onClick={() => {}}>
        Войти
      </button>

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <h1 className={styles.title}>
        Начните заниматься спортом
        <br />и улучшите качество жизни
      </h1>

      <img
        src={`${process.env.PUBLIC_URL}/images/Group.svg`}
        alt="Измени своё тело за полгода"
        className={styles.greenBlock}
      />

      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <img
              src={`${process.env.PUBLIC_URL}/images/${course.image}`}
              alt={course.title}
              className={styles.courseImage}
            />
            <div className={styles.courseContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>
              <div className={styles.iconsRow}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/25day.svg`}
                  alt="25 дней"
                  className={styles.daysIcon}
                />
                <img
                  src={`${process.env.PUBLIC_URL}/images/20min.svg`}
                  alt="20-50 мин/день"
                  className={styles.timeIcon}
                />
              </div>
              <img
                src={`${process.env.PUBLIC_URL}/images/mult.svg`}
                alt="Сложность"
                className={styles.difficultyIcon}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.scrollButton}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span className={styles.arrow}>↑</span>
        <span>Наверх</span>
      </button>

      <div className={styles.authOverlay}>
        <div className={styles.authContainer}>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleButton} ${isLogin ? styles.activeToggle : ""}`}
              onClick={() => {
                setIsLogin(true);
                setShowError(false);
                setShowSuccessMessage(false);
              }}
            >
              Вход
            </button>
            <button
              className={`${styles.toggleButton} ${!isLogin ? styles.activeToggle : ""}`}
              onClick={() => {
                setIsLogin(false);
                setShowError(false);
                setShowSuccessMessage(false);
              }}
            >
              Регистрация
            </button>
          </div>

          {showSuccessMessage && (
            <div className={styles.successMessage}>
              Регистрация успешна! Теперь вы можете войти.
            </div>
          )}

          {isLogin ? (
            showError ? (
              <LoginError
                onSwitchToRegister={() => {
                  setIsLogin(false);
                  setShowError(false);
                }}
                onClose={() => navigate("/")}
                errorMessage={errorMessage}
                onLogin={handleLoginSubmit}
                isLoading={isLoading}
              />
            ) : (
              <Login
                onSwitchToRegister={() => {
                  setIsLogin(false);
                  setShowError(false);
                }}
                onClose={() => navigate("/")}
                onLogin={handleLoginSubmit}
                isLoading={isLoading}
              />
            )
          ) : showError ? (
            <RegisterError
              onSwitchToLogin={() => {
                setIsLogin(true);
                setShowError(false);
              }}
              onClose={() => navigate("/")}
              errorMessage={errorMessage}
              onRegister={handleRegisterSubmit}
              isLoading={isLoading}
            />
          ) : (
            <Register
              onSwitchToLogin={() => {
                setIsLogin(true);
                setShowError(false);
              }}
              onClose={() => navigate("/")}
              onRegister={handleRegisterSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
