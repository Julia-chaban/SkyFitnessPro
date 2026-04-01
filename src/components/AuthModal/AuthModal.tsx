import React, { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import LoginError from "../LoginError/LoginError";
import RegisterError from "../RegisterError/RegisterError";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setShowError(false);
    setErrorMessage("");
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setShowError(false);
    setErrorMessage("");
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await onLogin(email, password);
      if (result.success) {
        onClose();
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
        setErrorMessage(
          result.message || "Регистрация успешна! Теперь вы можете войти.",
        );
        setIsLogin(true);
        setShowError(true);
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

  if (isLogin && showError) {
    return (
      <div className={styles.overlay}>
        <LoginError
          onSwitchToRegister={handleSwitchToRegister}
          onClose={onClose}
          errorMessage={errorMessage}
          onLogin={handleLoginSubmit}
        />
      </div>
    );
  }

  if (!isLogin && showError) {
    return (
      <div className={styles.overlay}>
        <RegisterError
          onSwitchToLogin={handleSwitchToLogin}
          onClose={onClose}
          errorMessage={errorMessage}
          onRegister={handleRegisterSubmit}
        />
      </div>
    );
  }

  if (isLogin) {
    return (
      <div className={styles.overlay}>
        <Login
          onSwitchToRegister={handleSwitchToRegister}
          onClose={onClose}
          onLogin={handleLoginSubmit}
        />
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <Register
        onSwitchToLogin={handleSwitchToLogin}
        onClose={onClose}
        onRegister={handleRegisterSubmit}
      />
    </div>
  );
};

export default AuthModal;
