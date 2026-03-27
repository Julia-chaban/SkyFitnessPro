import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseImage } from "../../data/courseImages";
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const getCourseImageUrl = () => {
    if (!id) {
      
      return isMobile
        ? `${process.env.PUBLIC_URL}/images/ioga.svg`
        : `${process.env.PUBLIC_URL}/images/card1.jpg`;
    }
    const imageName = getCourseImage(id, isMobile);
    return `${process.env.PUBLIC_URL}/images/${imageName}`;
  };

  const getDirectionsImage = () => {
    if (isMobile) {
      return `${process.env.PUBLIC_URL}/images/block6.svg`;
    }
    return `${process.env.PUBLIC_URL}/images/block3.svg`;
  };

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      <button className={styles.loginButton} onClick={handleLoginClick}>
        Войти
      </button>

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <img
        src={getCourseImageUrl()}
        alt="Course"
        className={styles.courseImage}
      />

      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>
        Подойдет для вас, если:
      </h2>

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

      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>
        Направления
      </h2>

      <img
        src={getDirectionsImage()}
        alt="Directions"
        className={styles.directionsImage}
      />

      <div className={styles.offerBlock}>
        <div className={styles.whiteBlock} />

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
