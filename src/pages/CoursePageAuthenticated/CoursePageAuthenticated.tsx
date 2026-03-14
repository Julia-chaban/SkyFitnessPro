import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./CoursePageAuthenticated.module.css";

interface CoursePageAuthenticatedProps {
  userName?: string;
  userEmail?: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void;
}

const CoursePageAuthenticated: React.FC<CoursePageAuthenticatedProps> = ({
  userName = "Anna",
  userEmail = "anna@mail.com",
  onProfileClick,
  onLogout,
  onAddCourse,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleAddCourse = () => {
    // Переход на страницу профиля (мои курсы)
    navigate("/profile");
  };

  return (
    <div className={styles.page}>
      {/* Логотип */}
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {/* Профиль пользователя - ВАЖНО! Этот блок был потерян */}
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={userName}
          userEmail={userEmail}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      {/* Текст под логотипом */}
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      {/* Картинка курса */}
      <img
        src={`${process.env.PUBLIC_URL}/images/card1.svg`}
        alt="Course"
        className={styles.courseImage}
      />

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
        src={`${process.env.PUBLIC_URL}/images/block3.svg`}
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
