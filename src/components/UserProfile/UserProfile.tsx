import React, { useState } from "react";
import ProfileModal from "../ProfileModal/ProfileModal";
import styles from "./UserProfile.module.css";

interface UserProfileProps {
  userName: string;
  userEmail: string;
  token?: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userEmail,
  token,
  onProfileClick,
  onLogout,
  onAddCourse,
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

  return (
    <>
      <div className={styles.userProfile} onClick={handleIconClick}>
        <div className={styles.profileIcon}>
          <img
            src={`${process.env.PUBLIC_URL}/images/prof.svg`}
            alt="Profile"
          />
        </div>
        <div className={styles.userInfo}>
          <span className={styles.profileName}>{userName}</span>
          <div className={styles.arrowIcon} />
        </div>
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userName={userName}
        userEmail={userEmail}
        token={token}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        onAddCourse={onAddCourse}
      />
    </>
  );
};

export default UserProfile;