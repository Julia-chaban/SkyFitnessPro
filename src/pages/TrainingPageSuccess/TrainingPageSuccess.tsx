import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import { workoutsService } from "../../services/workouts.service";
import { coursesService } from "../../services/courses.service";
import styles from "./TrainingPageSuccess.module.css";

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
  progress?: number;
}

interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

interface TrainingPageSuccessProps {
  userName?: string;
  userEmail?: string;
  token?: string;
  onLogout?: () => void;
  onLogoClick?: () => void;
}

const TrainingPageSuccess: React.FC<TrainingPageSuccessProps> = ({
  userName = "",
  userEmail = "",
  token,
  onLogout,
  onLogoClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [courseId, setCourseId] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoError, setVideoError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseIdParam = params.get("courseId");
    if (courseIdParam) {
      setCourseId(courseIdParam);
    }
  }, [location]);

  useEffect(() => {
    if (token && id && courseId) {
      loadWorkoutData();
    }
  }, [token, id, courseId]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        navigate(`/training/${id}/updated?courseId=${courseId}`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, id, courseId, navigate]);

  const loadWorkoutData = async () => {
    if (!token || !id || !courseId) return;

    try {
      setLoading(true);

      const workout: Workout = await workoutsService.getWorkoutById(id, token);
      setWorkoutName(workout.name);
      setVideoUrl(workout.video || "");
      setVideoError(false);

      const progress = await coursesService.getWorkoutProgress(
        courseId,
        id,
        token,
      );
      const progressData = progress.progressData || [];

      const exercisesWithProgress = workout.exercises.map(
        (ex: Exercise, index: number) => ({
          ...ex,
          progress: progressData[index] || 0,
        }),
      );

      setExercises(exercisesWithProgress);
    } catch (err) {
      console.error("Error loading workout data:", err);
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

  const handleVideoError = () => {
    setVideoError(true);
  };

  const calculateProgress = (exercise: Exercise) => {
    return exercise.quantity > 0
      ? Math.min(
          Math.round(((exercise.progress || 0) / exercise.quantity) * 100),
          100,
        )
      : 0;
  };

  const showVideo = videoUrl && !videoError;

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageOverlay} />

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
          {showVideo ? (
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles.videoIframe}
              onError={handleVideoError}
            />
          ) : (
            <div className={styles.videoPlaceholder}>
              <p>Видео временно недоступно</p>
              {videoUrl && (
                <a
                  href={videoUrl.replace("/embed/", "/watch?v=")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.videoLink}
                >
                  Открыть на YouTube
                </a>
              )}
            </div>
          )}
        </div>

        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>

            <div className={styles.exercisesGrid}>
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
          </div>
        </div>
      </div>

      <div className={styles.successModal}>
        <h2 className={styles.successTitle}>
          Ваш прогресс
          <br />
          засчитан!
        </h2>
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>
            <img
              src={`${process.env.PUBLIC_URL}/images/br1.svg`}
              alt="Success"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPageSuccess;
