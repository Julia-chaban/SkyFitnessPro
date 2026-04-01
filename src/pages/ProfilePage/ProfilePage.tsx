import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import DeleteIcon from "../../components/DeleteIcon/DeleteIcon";
import TrainingModal from "../../components/TrainingModal/TrainingModal";
import { coursesService } from "../../services/courses.service";
import { getMainPageImage } from "../../data/courseImages";
import { Course as APICourse, WorkoutProgress } from "../../types/api.types";
import styles from "./ProfilePage.module.css";

const USER_COURSES_KEY = "user_selected_courses";
const MAX_COURSES = 3;

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
  onLogoClick?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
  onLogoClick,
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
    loadUserCourses();
  }, [token]);

  const getCourseNameById = (courseId: string): string => {
    const names: Record<string, string> = {
      ab1c3f: "Йога",
      "6i67sm": "Степ-аэробика",
      ypox9r: "Фитнес",
      kfpq8e: "Стретчинг",
      q02a6i: "Бодифлекс",
    };
    return names[courseId] || "";
  };

  const loadUserCourses = async () => {
    try {
      setLoading(true);

      const saved = localStorage.getItem(USER_COURSES_KEY);
      const userCourseIds: string[] = saved ? JSON.parse(saved) : [];

      if (userCourseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const limitedCourseIds = userCourseIds.slice(0, MAX_COURSES);

      const allCourses: APICourse[] = await coursesService.getAllCourses();

      const userCoursesData = allCourses.filter((course: APICourse) =>
        limitedCourseIds.includes(course._id),
      );

      const userCourses = await Promise.all(
        userCoursesData.map(async (course: APICourse) => {
          try {
            let overallProgress = 0;
            let completedWorkouts = 0;
            let totalWorkouts = 0;

            if (token) {
              try {
                const progress = await coursesService.getUserCourseProgress(
                  course._id,
                  token,
                );
                totalWorkouts = progress.workoutsProgress.length;
                completedWorkouts = progress.workoutsProgress.filter(
                  (w: WorkoutProgress) => w.workoutCompleted,
                ).length;
                overallProgress =
                  totalWorkouts > 0
                    ? Math.round((completedWorkouts / totalWorkouts) * 100)
                    : 0;
              } catch {
                // Игнорируем ошибки API
              }
            }

            const courseName = getCourseNameById(course._id);
            const image = getMainPageImage(courseName);

            return {
              id: course._id,
              title: course.nameRU,
              image: image,
              progress: overallProgress,
              buttonText: getButtonText(overallProgress, overallProgress === 0),
              isDeleted: false,
              workoutProgress: {
                completed: completedWorkouts,
                total: totalWorkouts,
              },
            } as LocalCourse;
          } catch {
            return null;
          }
        }),
      );

      setCourses(userCourses.filter((c): c is LocalCourse => c !== null));
    } catch (err) {
      console.error("Error loading courses:", err);
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

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
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
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId
            ? { ...course, isDeleted: !course.isDeleted }
            : course,
        ),
      );

      const saved = localStorage.getItem(USER_COURSES_KEY);
      if (saved) {
        const coursesList = JSON.parse(saved).filter(
          (id: string) => id !== courseId,
        );
        localStorage.setItem(USER_COURSES_KEY, JSON.stringify(coursesList));
      }

      await coursesService.removeCourseFromUser(courseId, token);
    } catch {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course, isDeleted: false } : course,
        ),
      );
    }
  };

  const handleStartTraining = async (course: LocalCourse) => {
    if (!token) return;

    try {
      const progress = await coursesService.getUserCourseProgress(
        course.id,
        token,
      );

      let workoutIdToOpen = "";

      const incompleteWorkout = progress.workoutsProgress.find(
        (w: WorkoutProgress) => !w.workoutCompleted,
      );

      if (incompleteWorkout) {
        workoutIdToOpen = incompleteWorkout.workoutId;
      } else if (progress.workoutsProgress.length > 0) {
        workoutIdToOpen = progress.workoutsProgress[0].workoutId;
      } else {
        setSelectedCourse(course);
        setIsTrainingModalOpen(true);
        return;
      }

      navigate(`/training/${workoutIdToOpen}?courseId=${course.id}`);
    } catch (error) {
      console.error("Error loading course progress:", error);
      setSelectedCourse(course);
      setIsTrainingModalOpen(true);
    }
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedCourse(null);
  };

  const handleStartSelectedTrainings = (selectedTrainingIds: string[]) => {
    if (selectedTrainingIds && selectedTrainingIds.length > 0) {
      const workoutId = selectedTrainingIds[0];
      navigate(`/training/${workoutId}?courseId=${selectedCourse?.id}`);
    }
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
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
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

          {courses.length === 0 ? (
            <div className={styles.emptyCourses}>
              <p className={styles.emptyText}>Пока вы не записались ни на один курс</p>
              <button className={styles.goToCoursesButton} onClick={handleAddCourse}>
                Выбрать курс
              </button>
            </div>
          ) : (
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
          )}
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