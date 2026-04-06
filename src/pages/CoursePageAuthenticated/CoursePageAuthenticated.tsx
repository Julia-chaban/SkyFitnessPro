import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import { coursesService } from "../../services/courses.service";
import {
  getCourseImage,
  getMainPageImage,
  courseNames,
} from "../../data/courseImages";
import { Course } from "../../types/api.types";
import styles from "./CoursePageAuthenticated.module.css";

const USER_COURSES_KEY = "user_selected_courses";

interface CoursePageAuthenticatedProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const CoursePageAuthenticated: React.FC<CoursePageAuthenticatedProps> = ({
  userName = "",
  userEmail = "",
  token,
  onProfileClick,
  onLogout,
  onLogoClick,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);
  const [isAdding, setIsAdding] = useState(false);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
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
      checkIfCourseAdded();
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

  const checkIfCourseAdded = () => {
    const saved = localStorage.getItem(USER_COURSES_KEY);
    const courses = saved ? JSON.parse(saved) : [];
    setIsCourseAdded(courses.includes(id));
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleAddCourse = async () => {
    if (!id || isAdding) return;

    try {
      setIsAdding(true);

      const saved = localStorage.getItem(USER_COURSES_KEY);
      const courses = saved ? JSON.parse(saved) : [];

      if (!courses.includes(id)) {
        courses.push(id);
        localStorage.setItem(USER_COURSES_KEY, JSON.stringify(courses));
        setIsCourseAdded(true);
      }

      if (token) {
        try {
          await coursesService.addCourseToUser(id, token);
        } catch (apiError) {}
      }

      navigate("/profile");
    } catch (err) {
      console.error("Error adding course:", err);
    } finally {
      setIsAdding(false);
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

  const getButtonText = () => {
    if (isCourseAdded) return "Курс уже добавлен";
    if (isAdding) return "Добавление...";
    return "Добавить курс";
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

      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={userName}
          userEmail={userEmail}
          token={token}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
      </div>

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <img
        src={getCourseImageUrl()}
        alt={course?.nameRU || "Course"}
        className={styles.courseImage}
      />

      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>
        Подойдет для вас, если:
      </h2>

      <ul className={styles.fittingList}>
        {course?.fitting?.map((item, index) => (
          <li key={index} className={styles.fittingItem}>
            {item}
          </li>
        ))}
      </ul>

      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>
        Направления
      </h2>

      <ul className={styles.directionsList}>
        {course?.directions?.map((item, index) => (
          <li key={index} className={styles.directionItem}>
            {item}
          </li>
        ))}
      </ul>

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
          <button
            className={styles.offerButton}
            onClick={handleAddCourse}
            disabled={isAdding || isCourseAdded}
          >
            {getButtonText()}
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

export default CoursePageAuthenticated;
