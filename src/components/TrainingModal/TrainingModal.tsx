import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { workoutsService } from "../../services/workouts.service";
import styles from "./TrainingModal.module.css";

interface Workout {
  _id: string;
  name: string;
  day?: number;
}

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  token: string;
  onStartTraining: (selectedWorkoutIds: string[]) => void;
}

const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  token,
  onStartTraining,
}) => {
  const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && token) {
      loadWorkouts();
    }
  }, [isOpen, courseId, token]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await workoutsService.getCourseWorkouts(courseId, token);

      const workoutsWithDays = data.map((w: any, index: number) => ({
        ...w,
        day: index + 1,
      }));
      setWorkouts(workoutsWithDays);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки тренировок",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleTraining = (workoutId: string) => {
    setSelectedTrainings((prev) =>
      prev.includes(workoutId)
        ? prev.filter((id) => id !== workoutId)
        : [...prev, workoutId],
    );
  };

  const handleStart = () => {
    if (selectedTrainings.length > 0) {
      onStartTraining(selectedTrainings);
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Выберите тренировку</h2>

        <div className={styles.listContainer}>
          <div className={styles.scrollableList}>
            {loading && <div className={styles.loading}>Загрузка...</div>}
            {error && <div className={styles.error}>{error}</div>}
            {!loading &&
              !error &&
              workouts.map((workout) => (
                <div
                  key={workout._id}
                  className={styles.trainingItem}
                  onClick={() => toggleTraining(workout._id)}
                >
                  <div className={styles.checkboxContainer}>
                    {selectedTrainings.includes(workout._id) ? (
                      <div className={styles.checkboxChecked}>
                        <div className={styles.checkmark} />
                      </div>
                    ) : (
                      <div className={styles.checkbox} />
                    )}
                  </div>
                  <div className={styles.trainingInfo}>
                    <h3 className={styles.trainingTitle}>{workout.name}</h3>
                    <p className={styles.trainingSubtitle}>
                      {courseTitle} / {workout.day || "?"} день
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <button
          className={styles.startButton}
          onClick={handleStart}
          disabled={selectedTrainings.length === 0 || loading}
        >
          Начать
        </button>
      </div>
    </div>
  );
};

export default TrainingModal;