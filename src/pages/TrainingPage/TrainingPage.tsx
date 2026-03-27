import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPage.module.css";

interface TrainingPageProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({
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

  const handleOpenProgress = () => {
    navigate(`/training/${id}/progress`); // Переход на страницу с модальным окном
  };

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
