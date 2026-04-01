import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPageUpdated.module.css";

interface TrainingPageUpdatedProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const TrainingPageUpdated: React.FC<TrainingPageUpdatedProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
  onLogoClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [courseId, setCourseId] = React.useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseIdParam = params.get("courseId");
    if (courseIdParam) {
      setCourseId(courseIdParam);
    }
  }, [location]);

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

  const handleUpdateProgress = () => {
    navigate(`/training/${id}/progress?courseId=${courseId}`);
  };

  const exercises = [
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
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
        <h1 className={styles.title}>Йога</h1>

        <div className={styles.videoContainer}>
          <img
            src={`${process.env.PUBLIC_URL}/images/vid1.svg`}
            alt="Video"
            className={styles.videoImage}
          />
        </div>

        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки 2</h2>

            <div className={styles.exercisesGrid}>
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
