import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrainingModal.module.css";

interface Training {
  id: number;
  title: string;
  subtitle: string;
  day: number;
}

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  onStartTraining: (selectedTrainingIds: number[]) => void;
}

const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  onStartTraining,
}) => {
  const [selectedTrainings, setSelectedTrainings] = useState<number[]>([]);
  const navigate = useNavigate();

  const trainings: Training[] = [
    {
      id: 1,
      title: "Утренняя практика",
      subtitle: "Йога на каждый день",
      day: 1,
    },
    {
      id: 2,
      title: "Красота и здоровье",
      subtitle: "Йога на каждый день",
      day: 2,
    },
    {
      id: 3,
      title: "Асаны стоя",
      subtitle: "Йога на каждый день",
      day: 3,
    },
    {
      id: 4,
      title: "Растягиваем мышцы бедра",
      subtitle: "Йога на каждый день",
      day: 4,
    },
    {
      id: 5,
      title: "Гибкость спины",
      subtitle: "Йога на каждый день",
      day: 5,
    },
  ];

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleTraining = (trainingId: number) => {
    setSelectedTrainings((prev) =>
      prev.includes(trainingId)
        ? prev.filter((id) => id !== trainingId)
        : [...prev, trainingId],
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
            {trainings.map((training) => (
              <div
                key={training.id}
                className={styles.trainingItem}
                onClick={() => toggleTraining(training.id)}
              >
                <div className={styles.checkboxContainer}>
                  {selectedTrainings.includes(training.id) ? (
                    <div className={styles.checkboxChecked}>
                      <div className={styles.checkmark} />
                    </div>
                  ) : (
                    <div className={styles.checkbox} />
                  )}
                </div>
                <div className={styles.trainingInfo}>
                  <h3 className={styles.trainingTitle}>{training.title}</h3>
                  <p className={styles.trainingSubtitle}>
                    {training.subtitle} / {training.day} день
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.startButton}
          onClick={handleStart}
          disabled={selectedTrainings.length === 0}
        >
          Начать
        </button>
      </div>
    </div>
  );
};

export default TrainingModal;
