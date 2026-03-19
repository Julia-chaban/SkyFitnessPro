import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import { workoutsService } from "../../services/workouts.service";
import { coursesService } from "../../services/courses.service";
import styles from "./TrainingPage.module.css";

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
  progress?: number;
}

interface TrainingPageProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onLogout?: () => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>("");

  useEffect(() => {
    // Получаем courseId из query параметров
    const params = new URLSearchParams(location.search);
    const courseIdParam = params.get("courseId");
    if (courseIdParam) {
      setCourseId(courseIdParam);
    }
  }, [location]);

  useEffect(() => {
    if (token && id) {
      loadWorkoutData();
    }
  }, [token, id, courseId]);

  const loadWorkoutData = async () => {
    if (!token || !id) return;

    try {
      setLoading(true);

      // Получаем данные тренировки
      const workout = await workoutsService.getWorkoutById(id, token);
      setWorkoutName(workout.name);

      let progressData: number[] = [];

      // Если есть courseId, получаем прогресс по этой тренировке
      if (courseId) {
        try {
          const progress = await coursesService.getWorkoutProgress(
            courseId,
            id,
            token,
          );
          progressData = progress.progressData || [];
        } catch (err) {
          console.log("No progress found for this workout, starting from 0");
        }
      }

      // Добавляем прогресс к каждому упражнению
      const exercisesWithProgress = workout.exercises.map(
        (ex: Exercise, index: number) => ({
          ...ex,
          progress: progressData[index] || 0,
        }),
      );

      setExercises(exercisesWithProgress);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки тренировки",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddCourse = () => {
    navigate("/courses");
  };

  const handleOpenProgress = () => {
    // Передаем courseId в query параметрах
    navigate(
      `/training/${id}/progress${courseId ? `?courseId=${courseId}` : ""}`,
    );
  };

  const calculateProgress = (exercise: Exercise) => {
    return exercise.quantity > 0
      ? Math.min(
          Math.round(((exercise.progress || 0) / exercise.quantity) * 100),
          100,
        )
      : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "#00C1FF"; // Синий для завершенных
    if (progress > 0) return "#BCEC30"; // Зеленый для частичного прогресса
    return "#BCEC30"; // Зеленый для начала
  };

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка тренировки...</div>
      </div>
    );

  if (error)
    return (
      <div className={styles.page}>
        <div className={styles.error}>Ошибка: {error}</div>
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
          userName={userName}
          userEmail={userEmail}
          token={token}
          onProfileClick={handleProfileClick}
          onLogout={onLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      <div className={styles.contentBlock}>
        <h1 className={styles.title}>{workoutName || "Тренировка"}</h1>

        {/* Видео */}
        <div className={styles.videoContainer}>
          <img
            src={`${process.env.PUBLIC_URL}/images/vid1.svg`}
            alt="Video"
            className={styles.videoImage}
          />
        </div>

        {/* Блок с упражнениями */}
        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>

            <div className={styles.exercisesGrid}>
              {/* Разбиваем упражнения на 3 колонки */}
              {[0, 1, 2].map((colIndex) => (
                <div key={colIndex} className={styles.exerciseColumn}>
                  {exercises
                    .slice(colIndex * 3, colIndex * 3 + 3)
                    .map((exercise) => {
                      const progress = calculateProgress(exercise);
                      return (
                        <div key={exercise._id} className={styles.exerciseItem}>
                          <p className={styles.exerciseText}>
                            {exercise.name} {progress}%
                          </p>
                          <div className={styles.progressBarBg}>
                            <div
                              className={styles.progressBarFill}
                              style={{
                                width: `${progress}%`,
                                backgroundColor: getProgressColor(progress),
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            <button
              className={styles.progressButton}
              onClick={handleOpenProgress}
            >
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
