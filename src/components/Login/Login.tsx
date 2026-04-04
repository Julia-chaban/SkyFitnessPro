import React, { useState } from "react";
import styles from "./Login.module.css";

interface LoginProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onClose,
  onLogin,
  isLoading = false,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      <div className={styles.formContainer}>
        <input
          type="email"
          placeholder="Эл.почта"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Пароль"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Вход..." : "Войти"}
        </button>

        <button
          className={styles.registerButton}
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default Login;
