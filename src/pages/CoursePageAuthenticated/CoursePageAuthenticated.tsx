import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./CoursePageAuthenticated.module.css";

interface CoursePageAuthenticatedProps {
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void;
  isAuthenticated?: boolean; // Добавлен проп
}

const CoursePageAuthenticated: React.FC<CoursePageAuthenticatedProps> = ({
  userName = "Anna",
  userEmail = "anna@mail.com",
  onProfileClick,
  onLogout,
  onAddCourse,
  isAuthenticated = true, // По умолчанию true для этой страницы
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleAddCourse = () => {
    navigate("/profile");
  };

  const handleLoginClick = () => {
    navigate("/auth");
  };

  // Выбор картинки курса в зависимости от мобильной версии
  const getCourseImage = () => {
    if (isMobile) {
      return `${process.env.PUBLIC_URL}/images/ioga.svg`;
    }
    return `${process.env.PUBLIC_URL}/images/card${id}.svg`;
  };

  // Выбор картинки направлений
  const getDirectionsImage = () => {
    if (isMobile) {
      return `${process.env.PUBLIC_URL}/images/block6.svg`;
    }
    return `${process.env.PUBLIC_URL}/images/block3.svg`;
  };

  return (
    <div className={styles.page}>
      {/* Логотип */}
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {/* Условный рендеринг: профиль или кнопка входа */}
      {isAuthenticated ? (
        <div className={styles.userProfileWrapper}>
          <UserProfile
            userName={userName}
            userEmail={userEmail}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
            onAddCourse={handleAddCourse}
          />
        </div>
      ) : (
        <button className={styles.loginButton} onClick={handleLoginClick}>
          Войти
        </button>
      )}

      {/* Текст под логотипом - скрываем на мобильном через CSS */}
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      {/* Картинка курса */}
      <img src={getCourseImage()} alt="Course" className={styles.courseImage} />

      {/* Заголовок "Подойдет для вас, если:" */}
      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>
        Подойдет для вас, если:
      </h2>

      {/* Ряд из трех блоков */}
      <div className={styles.blocksRow}>
        <img
          src={`${process.env.PUBLIC_URL}/images/block.svg`}
          alt="Block 1"
          className={`${styles.block} ${styles.block1}`}
        />
        <img
          src={`${process.env.PUBLIC_URL}/images/block1.svg`}
          alt="Block 2"
          className={`${styles.block} ${styles.block2}`}
        />
        <img
          src={`${process.env.PUBLIC_URL}/images/block2.svg`}
          alt="Block 3"
          className={`${styles.block} ${styles.block3}`}
        />
      </div>

      {/* Заголовок "Направления" */}
      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>
        Направления
      </h2>

      {/* Картинка направлений */}
      <img
        src={getDirectionsImage()}
        alt="Directions"
        className={styles.directionsImage}
      />

      {/* Блок с предложением */}
      <div className={styles.offerBlock}>
        {/* Белый фон */}
        <div className={styles.whiteBlock} />

        {/* Текстовый контент */}
        <div className={styles.textContent}>
          <h3 className={styles.offerTitle}>
            Начните путь <br />к новому телу
          </h3>
          <p className={styles.offerDescription}>
            проработка всех групп мышц
            <br />
            тренировка суставов
            <br />
            улучшение циркуляции крови
            <br />
            упражнения заряжают бодростью
            <br />
            помогают противостоять стрессам
          </p>
          <button className={styles.offerButton} onClick={handleAddCourse}>
            Добавить курс
          </button>
        </div>

        {/* Картинки справа */}
        <img
          src={`${process.env.PUBLIC_URL}/images/block4.svg`}
          alt="Decorative 1"
          className={styles.block4}
        />
        <img
          src={`${process.env.PUBLIC_URL}/images/block5.svg`}
          alt="Decorative 2"
          className={styles.block5}
        />
      </div>
    </div>
  );
};

export default CoursePageAuthenticated;
