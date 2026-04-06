import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseImage,
  getMainPageImage,
  courseNames,
} from "../../data/courseImages";
import { coursesService } from "../../services/courses.service";
import { Course } from "../../types/api.types";
import styles from "./CoursePage.module.css";

interface CoursePageProps {
  onLoginClick?: () => void;
  onLogoClick?: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({
  onLoginClick,
  onLogoClick,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await coursesService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const getCourseImageUrl = () => {
    if (!id) {
      return isMobile
        ? `${process.env.PUBLIC_URL}/images/ioga.svg`
        : `${process.env.PUBLIC_URL}/images/card1.jpg`;
    }

    const courseName = courseNames[id];
    if (courseName) {
      const imageName = getMainPageImage(courseName);
      return `${process.env.PUBLIC_URL}/images/${imageName}`;
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

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />

      <button className={styles.loginButton} onClick={handleLoginClick}>
        Войти
      </button>

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <img
        src={getCourseImageUrl()}
        alt={course?.nameRU || "Course"}
        className={styles.courseImage}
      />

      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>
        Подойдет для вас, если:
      </h2>

      <div className={styles.fittingBlocks}>
        {course?.fitting?.map((item, index) => (
          <div key={index} className={styles.fittingBlock}>
            <p className={styles.fittingText}>{item}</p>
          </div>
        ))}
      </div>

      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>
        Направления
      </h2>

      <div className={styles.directionsBlocks}>
        {course?.directions?.map((item, index) => (
          <div key={index} className={styles.directionBlock}>
            <p className={styles.directionText}>{item}</p>
          </div>
        ))}
      </div>

      <div className={styles.offerBlock}>
        <div className={styles.whiteBlock} />

        <div className={styles.textContent}>
          <h3 className={styles.offerTitle}>
            Начните путь <br />к новому телу
          </h3>
          <p className={styles.offerDescription}>
            {course?.description ||
              "Улучшите качество жизни с нашими тренировками"}
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
