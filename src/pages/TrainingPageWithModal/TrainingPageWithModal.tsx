import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import ProgressModal from "../../components/ProgressModal/ProgressModal";
import { workoutsService } from "../../services/workouts.service";
import { coursesService } from "../../services/courses.service";
import styles from "./TrainingPageWithModal.module.css";

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

interface TrainingPageWithModalProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const TrainingPageWithModal: React.FC<TrainingPageWithModalProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
  onLogoClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [existingProgress, setExistingProgress] = useState<number[]>([]);

  useEffect(() => {
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

      const workout = await workoutsService.getWorkoutById(id, token);
      setWorkoutName(workout.name);
      setExercises(workout.exercises);

      if (courseId) {
        try {
          const progress = await coursesService.getWorkoutProgress(
            courseId,
            id,
            token,
          );
          setExistingProgress(progress.progressData || []);
        } catch (err) {
          setExistingProgress(new Array(workout.exercises.length).fill(0));
        }
      } else {
        setExistingProgress(new Array(workout.exercises.length).fill(0));
      }
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

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate(`/training/${id}?courseId=${courseId}`);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleSaveProgress = async (progressData: number[]) => {
    if (!token || !id || !courseId) {
      throw new Error(
        "Отсутствуют необходимые данные для сохранения прогресса",
      );
    }

    try {
      await workoutsService.saveWorkoutProgress(
        courseId,
        id,
        progressData,
        token,
      );

      setIsModalOpen(false);
      navigate(`/training/${id}/success?courseId=${courseId}`);
    } catch (err) {
      console.error("Error saving progress:", err);
      throw err;
    }
  };

  const calculateProgress = (exercise: Exercise, value?: number) => {
    const currentValue = value !== undefined ? value : 0;
    return exercise.quantity > 0
      ? Math.min(Math.round((currentValue / exercise.quantity) * 100), 100)
      : 0;
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
      <div className={styles.pageOverlay} onClick={handleOverlayClick} />

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
          onLogout={onLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      <div className={styles.contentBlock}>
        <h1 className={styles.title}>{workoutName || "Тренировка"}</h1>

        <div className={styles.videoContainer}>
          <img
            src={`${process.env.PUBLIC_URL}/images/vid1.svg`}
            alt="Video"
            className={styles.videoImage}
          />
        </div>

        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>

            <div className={styles.exercisesGrid}>
              {[0, 1, 2].map((colIndex) => (
                <div key={colIndex} className={styles.exerciseColumn}>
                  {exercises
                    .slice(colIndex * 3, colIndex * 3 + 3)
                    .map((exercise, idx) => {
                      const exerciseIndex = colIndex * 3 + idx;
                      const existingValue =
                        existingProgress[exerciseIndex] || 0;
                      const progress = calculateProgress(
                        exercise,
                        existingValue,
                      );

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
                                backgroundColor:
                                  progress === 100 ? "#00C1FF" : "#BCEC30",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            <button className={styles.progressButton} onClick={() => {}}>
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </div>

      <ProgressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        workoutId={id || ""}
        courseId={courseId}
        exercises={exercises}
        initialProgress={existingProgress}
        onSave={handleSaveProgress}
      />
    </div>
  );
};

export default TrainingPageWithModal;
