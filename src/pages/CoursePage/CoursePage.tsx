import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CoursePage.module.css";

interface CoursePageProps {
  onLoginClick?: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ onLoginClick }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  // Выбор картинки курса в зависимости от id и мобильной версии
  const getCourseImage = () => {
    if (isMobile) {
      // В мобильной версии для всех курсов используем ioga.svg
      return `${process.env.PUBLIC_URL}/images/ioga.svg`;
    }
    // В десктопной версии используем card1.svg, card2.svg и т.д.
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

      {/* Кнопка входа */}
      <button className={styles.loginButton} onClick={handleLoginClick}>
        Войти
      </button>

      {/* Текст под логотипом */}
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      {/* Картинка курса - динамическая */}
      <img
        src={getCourseImage()}
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

      {/* Картинка направлений - динамическая */}
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
          <button className={styles.offerButton} onClick={handleLoginClick}>
            Войдите, чтобы добавить курс
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

export default CoursePage;