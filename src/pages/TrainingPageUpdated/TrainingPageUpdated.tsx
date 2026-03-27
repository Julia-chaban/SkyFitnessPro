import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPageUpdated.module.css";

interface TrainingPageUpdatedProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const TrainingPageUpdated: React.FC<TrainingPageUpdatedProps> = ({
  userName = "Анна",
  userEmail = "anna@mail.com",
  onLogout,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleAddCourse = () => {
    navigate("/courses");
  };

  const handleUpdateProgress = () => {
    navigate(`/training/${id}/progress`);
  };

  // Обновленные данные с прогрессом
  const exercises = [
    { name: "Наклоны вперед", progress: 40 },
    { name: "Нклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
  ];

  return (
    <div className={styles.page}>
      {/* Логотип */}
      <img
        src={`${process.env.PUBLIC_URL}/images/logo.svg`}
        alt="SkyFitnessPro"
        className={styles.logo}
      />

      {/* Профиль пользователя */}
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={userName}
          userEmail={userEmail}
          onProfileClick={handleProfileClick}
          onLogout={onLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      {/* Основной контент */}
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
              <div
                className={`${styles.exerciseColumn} ${styles.exerciseColumnDefault}`}
              >
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны вперед {exercises[0].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[0].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны назад {exercises[1].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[1].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItemLarge}>
                  <p className={styles.exerciseTextLarge}>
                    Поднятие ног, согнутых в коленях {exercises[2].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[2].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Вторая колонка */}
              <div
                className={`${styles.exerciseColumn} ${styles.exerciseColumnDefault}`}
              >
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны вперед {exercises[3].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[3].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны назад {exercises[4].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[4].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItemLarge}>
                  <p className={styles.exerciseTextLarge}>
                    Поднятие ног, согнутых в коленях {exercises[5].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[5].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Третья колонка - с большим последним элементом */}
              <div
                className={`${styles.exerciseColumn} ${styles.exerciseColumnLarge}`}
              >
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны вперед {exercises[6].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[6].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>
                    Наклоны назад {exercises[7].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[7].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.exerciseItemLarge}>
                  <p className={styles.exerciseTextLarge}>
                    Поднятие ног, согнутых в коленях {exercises[8].progress}%
                  </p>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${exercises[8].progress}%`,
                        background: "#00C1FF",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              className={styles.progressButton}
              onClick={handleUpdateProgress}
            >
              Обновить свой прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPageUpdated;
