import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPageWithModal.module.css";

interface TrainingPageWithModalProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const TrainingPageWithModal: React.FC<TrainingPageWithModalProps> = ({
  userName = "Анна",
  userEmail = "anna@mail.com",
  onLogout,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [progressItems, setProgressItems] = useState([
    {
      id: 1,
      question: "Сколько раз вы сделали наклоны вперед?",
      value: 20,
    },
    {
      id: 2,
      question: "Сколько раз вы сделали наклоны назад?",
      value: 0,
    },
    {
      id: 3,
      question: "Сколько раз вы сделали поднятие ног, согнутых в коленях?",
      value: 0,
    },
  ]);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddCourse = () => {
    navigate("/courses");
  };

  const handleInputChange = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setProgressItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: numValue } : item,
      ),
    );
  };

  const handleSave = () => {
    console.log("Saved progress:", progressItems);
    navigate(`/training/${id}/success`);
  };

  const handleCloseModal = () => {
    navigate(`/training/${id}`);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className={styles.page}>
      {/* Затемнение всей страницы */}
      <div className={styles.pageOverlay} onClick={handleOverlayClick} />

      {/* Логотип (поверх затемнения) */}
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {/* Профиль пользователя (поверх затемнения) */}
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={userName}
          userEmail={userEmail}
          onProfileClick={handleProfileClick}
          onLogout={onLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      {/* Основной контент (поверх затемнения) */}
      <div className={styles.contentBlock}>
        <h1 className={styles.title}>Йога</h1>

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
            <h2 className={styles.exercisesTitle}>Упражнения тренировки 2</h2>

            <div className={styles.exercisesGrid}>
              {/* Первая колонка */}
              <div className={styles.exerciseColumn}>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны вперед 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны назад 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Поднятие ног, согнутых в коленях 0%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Вторая колонка */}
              <div className={styles.exerciseColumn}>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны вперед 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны назад 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Поднятие ног, согнутых в коленях 0%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Третья колонка */}
              <div className={styles.exerciseColumn}>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны вперед 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>Наклоны назад 0%</p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Поднятие ног, согнутых в коленях 0%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.progressButton} onClick={() => {}}>
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Мой прогресс</h2>

        <div className={styles.scrollableContent}>
          {progressItems.map((item) => (
            <div key={item.id} className={styles.progressItem}>
              <p className={styles.questionText}>{item.question}</p>
              <input
                type="number"
                className={styles.inputField}
                value={item.value}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                min="0"
              />
            </div>
          ))}
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default TrainingPageWithModal;
