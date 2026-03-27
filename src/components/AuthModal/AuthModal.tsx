import React, { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import LoginError from "../LoginError/LoginError";
import RegisterError from "../RegisterError/RegisterError";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => boolean;
  onRegister: (email: string, password: string, name: string) => boolean;
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

  if (!isOpen) return null;

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setShowError(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setShowError(false);
  };

  const handleLoginSubmit = (email: string, password: string) => {
    const success = onLogin(email, password);
    if (success) {
      onClose();
    } else {
      setErrorMessage("Пароль введен неверно, попробуйте еще раз.");
      setShowError(true);
    }
  };

  const handleRegisterSubmit = (
    email: string,
    password: string,
    name: string,
  ) => {
    const success = onRegister(email, password, name);
    if (success) {
      setErrorMessage("Регистрация успешна! Теперь вы можете войти.");
      setIsLogin(true);
      setShowError(true);
    } else {
      setErrorMessage("Данная почта уже используется. Попробуйте войти.");
      setShowError(true);
    }
  };

  // Login with error
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

  // Register with error
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

  // Login without error
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

  // Register without error
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
