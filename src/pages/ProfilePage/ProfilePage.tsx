import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import DeleteIcon from "../../components/DeleteIcon/DeleteIcon";
import TrainingModal from "../../components/TrainingModal/TrainingModal";
import { coursesService } from "../../services/courses.service";
import { courseNames, getMainPageImage } from "../../data/courseImages";
import { Course as APICourse } from "../../types/api.types";
import styles from "./ProfilePage.module.css";

interface LocalCourse {
  id: string;
  title: string;
  image: string;
  progress: number;
  buttonText: string;
  isDeleted?: boolean;
  workoutProgress?: {
    completed: number;
    total: number;
  };
}

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onLogout?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [displayName] = useState(userName);
  const [displayEmail] = useState(userEmail);
  const [userLogin] = useState(userEmail.split("@")[0]);
  const [selectedCourse, setSelectedCourse] = useState<LocalCourse | null>(
    null,
  );
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [courses, setCourses] = useState<LocalCourse[]>([]);
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
    if (token) {
      loadUserCourses();
    }
  }, [token]);

  const loadUserCourses = async () => {
    if (!token) return;
    try {
      setLoading(true);

      // Получаем все курсы
      const allCourses: APICourse[] = await coursesService.getAllCourses();

      // Получаем ID курсов пользователя (приобретенные курсы)
      const userCourseIds: string[] =
        await coursesService.getUserCourses(token);

      // Фильтруем только те курсы, которые есть у пользователя
      const userCoursesData = allCourses.filter((course: APICourse) =>
        userCourseIds.includes(course._id),
      );

      // Загружаем прогресс для каждого курса пользователя
      const userCourses = await Promise.all(
        userCoursesData.map(async (course: APICourse) => {
          try {
            // Получаем прогресс по курсу
            const progress = await coursesService.getUserCourseProgress(
              course._id,
              token,
            );

            // Вычисляем общий прогресс
            const totalWorkouts = progress.workoutsProgress.length;
            const completedWorkouts = progress.workoutsProgress.filter(
              (w) => w.workoutCompleted,
            ).length;

            const overallProgress =
              totalWorkouts > 0
                ? Math.round((completedWorkouts / totalWorkouts) * 100)
                : 0;

            const courseName = courseNames[course._id] || course.nameRU;

            return {
              id: course._id,
              title: course.nameRU,
              image: getMainPageImage(courseName),
              progress: overallProgress,
              buttonText: getButtonText(
                overallProgress,
                completedWorkouts === 0,
              ),
              isDeleted: false,
              workoutProgress: {
                completed: completedWorkouts,
                total: totalWorkouts,
              },
            } as LocalCourse;
          } catch (err) {
            console.error(
              `Error loading progress for course ${course._id}:`,
              err,
            );
            return null;
          }
        }),
      );

      // Фильтруем успешно загруженные курсы
      setCourses(userCourses.filter((c): c is LocalCourse => c !== null));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки курсов");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = (progress: number, isNew: boolean) => {
    if (progress === 0 && isNew) return "Начать тренировки";
    if (progress === 100) return "Начать заново";
    return "Продолжить";
  };

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

  const handleCourseClick = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (course && !course.isDeleted) {
      navigate(`/course/${courseId}/authenticated`);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!token) return;

    try {
      // Оптимистичное обновление UI
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, isDeleted: !course.isDeleted }
            : course,
        ),
      );

      // Вызов API для удаления курса
      await coursesService.removeCourseFromUser(courseId, token);
    } catch (err) {
      // Откат при ошибке
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, isDeleted: false } : course,
        ),
      );
      console.error("Ошибка удаления курса:", err);
    }
  };

  const handleStartTraining = (course: LocalCourse) => {
    setSelectedCourse(course);
    setIsTrainingModalOpen(true);
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedCourse(null);
  };

  const handleStartSelectedTrainings = (selectedTrainingIds: string[]) => {
    navigate(
      `/training/${selectedCourse?.id}?workouts=${selectedTrainingIds.join(",")}`,
    );
    setIsTrainingModalOpen(false);
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  if (error)
    return (
      <div className={styles.page}>
        <div className={styles.error}>{error}</div>
      </div>
    );

  return (
    <div className={styles.page}>
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={displayName}
          userEmail={displayEmail}
          token={token}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      <div className={styles.contentBlock}>
        <h1 className={styles.profileTitle}>Профиль</h1>

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

        <div className={styles.coursesSection}>
          <h2 className={styles.coursesTitle}>Мои курсы</h2>

          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div
                key={course.id}
                className={`${styles.courseCard} ${course.isDeleted ? styles.deletedCourse : ""}`}
                onClick={() => handleCourseClick(course.id)}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartTraining(course);
                    }}
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

      {selectedCourse && token && (
        <TrainingModal
          isOpen={isTrainingModalOpen}
          onClose={handleCloseTrainingModal}
          courseId={selectedCourse.id}
          courseTitle={selectedCourse.title}
          token={token}
          onStartTraining={handleStartSelectedTrainings}
        />
      )}
    </div>
  );
};

export default ProfilePage;
