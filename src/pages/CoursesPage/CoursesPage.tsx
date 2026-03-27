import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/CourseCard/CourseCard";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import UserProfile from "../../components/UserProfile/UserProfile";
import { courses } from "../../data/courses";
import styles from "./CoursesPage.module.css";

interface CoursesPageProps {
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({
  isAuthenticated = false,
  userName = "",
  userEmail = "",
  onLoginClick,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddCourse = () => {
    navigate("/add-course");
  };

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {isAuthenticated ? (
        <div className={styles.userProfileWrapper}>
          <UserProfile
            userName={userName}
            userEmail={userEmail}
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
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default CoursesPage;
