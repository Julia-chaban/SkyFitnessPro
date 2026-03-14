import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import DeleteIcon from "../../components/DeleteIcon/DeleteIcon";
import TrainingModal from "../../components/TrainingModal/TrainingModal";
import styles from "./ProfilePage.module.css";

interface Course {
  id: number;
  title: string;
  image: string;
  progress: number;
  buttonText: string;
  isDeleted?: boolean;
}

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userName = "",
  userEmail = "",
  onLogout,
}) => {
  const navigate = useNavigate();
  const [displayName] = useState(userName);
  const [displayEmail] = useState(userEmail);
  const [userLogin] = useState(userEmail.split("@")[0]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Йога",
      image: "ioga.svg",
      progress: 40,
      buttonText: "Продолжить",
      isDeleted: false,
    },
    {
      id: 2,
      title: "Стретчинг",
      image: "strech.svg",
      progress: 75,
      buttonText: "Начать тренировки",
      isDeleted: false,
    },
    {
      id: 3,
      title: "Фитнес",
      image: "fit.svg",
      progress: 100,
      buttonText: "Начать заново",
      isDeleted: false,
    },
  ]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleAddCourse = () => {
    navigate("/courses");
  };

  const handleCourseClick = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course && !course.isDeleted) {
      navigate(`/course/${courseId}/authenticated`);
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId
          ? { ...course, isDeleted: !course.isDeleted }
          : course,
      ),
    );
  };

  const handleStartTraining = (course: Course) => {
    setSelectedCourse(course);
    setIsTrainingModalOpen(true);
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedCourse(null);
  };

  const handleStartSelectedTrainings = (selectedTrainingIds: number[]) => {
    console.log("Selected trainings:", selectedTrainingIds);
    // Переходим на страницу тренировки с ID курса
    navigate(`/training/${selectedCourse?.id}`);
    setIsTrainingModalOpen(false);
  };

  return (
    <div className={styles.page}>
      {/* Логотип */}
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {/* Профиль пользователя (иконка, имя, стрелочка) */}
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={displayName}
          userEmail={displayEmail}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      {/* Основной контент */}
      <div className={styles.contentBlock}>
        <h1 className={styles.profileTitle}>Профиль</h1>

        {/* Карточка профиля */}
        <div className={styles.profileCard}>
          <div className={styles.profileInner}>
            <div className={styles.profileIcon}>
              <img
                src={`${process.env.PUBLIC_URL}/images/Mask.svg`}
                alt="Profile"
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{displayName}</h2>
              <p className={styles.profileLogin}>Логин: {userLogin}</p>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Мои курсы */}
        <div className={styles.coursesSection}>
          <h2 className={styles.coursesTitle}>Мои курсы</h2>

          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div
                key={course.id}
                className={`${styles.courseCard} ${course.isDeleted ? styles.deletedCourse : ""}`}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${course.image}`}
                    alt={course.title}
                    className={styles.courseImage}
                  />
                  <DeleteIcon
                    isDeleted={course.isDeleted}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.id);
                    }}
                  />
                </div>

                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>

                  <div className={styles.iconsRow}>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/25day.svg`}
                      alt="25 дней"
                      className={styles.daysIcon}
                    />
                    <img
                      src={`${process.env.PUBLIC_URL}/images/20min.svg`}
                      alt="20-50 мин/день"
                      className={styles.timeIcon}
                    />
                  </div>

                  <img
                    src={`${process.env.PUBLIC_URL}/images/mult.svg`}
                    alt="Сложность"
                    className={styles.difficultyIcon}
                  />

                  <div className={styles.progressSection}>
                    <p className={styles.progressText}>
                      Прогресс {course.progress}%
                    </p>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className={`${styles.courseButton} ${course.isDeleted ? styles.disabledButton : ""}`}
                    onClick={() => handleStartTraining(course)}
                    disabled={course.isDeleted}
                  >
                    {course.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно выбора тренировки */}
      {selectedCourse && (
        <TrainingModal
          isOpen={isTrainingModalOpen}
          onClose={handleCloseTrainingModal}
          courseTitle={selectedCourse.title}
          onStartTraining={handleStartSelectedTrainings}
        />
      )}
    </div>
  );
};

export default ProfilePage;
