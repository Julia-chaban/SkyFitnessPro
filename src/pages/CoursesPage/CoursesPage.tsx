import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import UserProfile from "../../components/UserProfile/UserProfile";
import { coursesService } from "../../services/courses.service";
import { Course } from "../../types/api.types";
import { courseNames, getMainPageImage } from "../../data/courseImages";
import styles from "./CoursesPage.module.css";

interface CoursesPageProps {
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  token?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  isAuthenticated = false,
  userName = "",
  userEmail = "",
  token,
  onLoginClick,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 375);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 375);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки курсов");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddCourse = () => {
    navigate("/add-course");
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {isAuthenticated && token ? (
        <div className={styles.userProfileWrapper}>
          <UserProfile
            userName={userName}
            userEmail={userEmail}
            token={token}
            onProfileClick={handleProfileClick}
            onLogout={onLogout}
            onAddCourse={handleAddCourse}
          />
        </div>
      ) : (
        <button className={styles.loginButton} onClick={onLoginClick}>
          Войти
        </button>
      )}

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <h1 className={styles.title}>
        Начните заниматься спортом
        <br />и улучшите качество жизни
      </h1>

      <img
        src={`${process.env.PUBLIC_URL}/images/Group.svg`}
        alt="Измени своё тело за полгода"
        className={styles.greenBlock}
      />

      <div className={styles.coursesGrid}>
        {courses.map((course) => {
          const courseName = courseNames[course._id] || course.nameRU;
          const image = getMainPageImage(courseName);

          return (
            <CourseCard
              key={course._id}
              course={{
                id: course._id,
                title: course.nameRU,
                image: image,
                duration: `${course.durationInDays} дней`,
                timePerDay: `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`,
                difficulty: course.difficulty,
              }}
              isAuthenticated={isAuthenticated}
              token={token}
            />
          );
        })}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default CoursesPage;
