import React from "react";
import styles from "./ProfileModal.module.css";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  token?: string; // Добавлен token (опционально)
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  token,
  onProfileClick,
  onLogout,
  onAddCourse,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <div className={styles.userInfoContainer}>
          <div className={styles.userName}>{userName}</div>
          <div className={styles.userEmail}>{userEmail}</div>
        </div>

        <div className={styles.buttonsContainer}>
          <button className={styles.profileButton} onClick={onProfileClick}>
            Мой профиль
          </button>
          <button className={styles.logoutButton} onClick={handleLogoutClick}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;