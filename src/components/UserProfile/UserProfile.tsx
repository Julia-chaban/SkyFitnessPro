import React, { useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import styles from "./UserProfile.module.css";

interface UserProfileProps {
  userName: string;
  userEmail: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void; // Этот пропс может быть, но не передается в ProfileModal
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userEmail,
  onProfileClick,
  onLogout,
  onAddCourse, // Получаем, но не передаем в ProfileModal
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIconClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileClick = () => {
    setIsModalOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Обработчик для добавления курса (если нужно)
  const handleAddCourse = () => {
    setIsModalOpen(false);
    if (onAddCourse) {
      onAddCourse();
    }
  };

  return (
    <>
      <div className={styles.userProfile} onClick={handleIconClick}>
        <div className={styles.profileIcon}>
          <img
            src={`${process.env.PUBLIC_URL}/images/prof.svg`}
            alt="Profile"
          />
        </div>
        <span className={styles.profileData}>{userName}</span>
        <div className={styles.arrowIcon} />
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userName={userName}
        userEmail={userEmail}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        // Убрали onAddCourse отсюда, так как его нет в ProfileModal
      />
    </>
  );
};

export default UserProfile;
