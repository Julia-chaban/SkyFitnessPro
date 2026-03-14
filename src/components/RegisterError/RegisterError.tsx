import React, { useState } from "react";
import styles from "./RegisterError.module.css";

interface RegisterErrorProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
  errorMessage: string;
  onRegister: (email: string, password: string, name: string) => void;
}

const RegisterError: React.FC<RegisterErrorProps> = ({
  onSwitchToLogin,
  onClose,
  errorMessage,
  onRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    if (password === confirmPassword && email && name) {
      onRegister(email, password, name);
    }
  };

  return (
    <div className={styles.registerErrorContainer}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      <div className={styles.formContainer}>
        <input
          type="text"
          placeholder="Имя"
          className={styles.inputField}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Эл.почта"
          className={styles.inputField}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className={styles.inputField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Повторить пароль"
          className={styles.inputField}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className={styles.errorMessage}>{errorMessage}</div>

        <button className={styles.registerButton} onClick={handleRegister}>
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

export default RegisterError;
