import Image from 'next/image';
import styles from './UserDelModal.module.css';
import ic_confirm from '@/public/images/ic_confirm.png';

function UserDelModal({ title, value, onClose, onSubmit, onChange }) {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <Image className={styles.x} src={ic_confirm} alt="confirmIcon" />
          <h1 className={styles.modalTitle}>{title}</h1>
        </div>
        <div className={styles.button}>
          <button className={styles.reject} onClick={onClose}>
            아니오
          </button>
          <button className={styles.approve} onClick={onSubmit}>
            네
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDelModal;
