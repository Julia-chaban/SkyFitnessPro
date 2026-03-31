import React, { useState, useEffect } from "react";
import styles from "./ProgressModal.module.css";

interface ProgressItem {
  exerciseId: string;
  question: string;
  value: number;
  maxValue?: number;
}

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutId: string;
  courseId: string;
  exercises: Array<{ _id: string; name: string; quantity: number }>;
  initialProgress?: number[];
  onSave: (progressData: number[]) => Promise<void>;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  workoutId,
  courseId,
  exercises,
  initialProgress = [],
  onSave,
}) => {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const items = exercises.map((ex, index) => ({
        exerciseId: ex._id,
        question: ex.name,
        value: initialProgress[index] || 0,
        maxValue: ex.quantity,
      }));
      setProgressItems(items);
      setError(null);
    }
  }, [isOpen, exercises, initialProgress]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setProgressItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, value: numValue } : item,
      ),
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const invalidItems = progressItems.filter(
        (item) => item.maxValue !== undefined && item.value > item.maxValue,
      );

      if (invalidItems.length > 0) {
        setError(`Значение не может превышать ${invalidItems[0].maxValue}`);
        setIsSaving(false);
        return;
      }

      const progressData = progressItems.map((item) => item.value);
      await onSave(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при сохранении");
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Мой прогресс</h2>

        <div className={styles.scrollableContent}>
          {progressItems.map((item, index) => (
            <div key={index} className={styles.progressItem}>
              <p className={styles.questionText}>{item.question}</p>
              <input
                type="number"
                className={styles.inputField}
                value={item.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                min="0"
                max={item.maxValue}
                placeholder={`0-${item.maxValue}`}
              />
            </div>
          ))}
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
};

export default ProgressModal;
