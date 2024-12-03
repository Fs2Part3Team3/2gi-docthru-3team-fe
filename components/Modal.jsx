import Image from "next/image";
import styles from "./Modal.module.css";
import ic_out from "@/public/images/ic_out.png";

function Modal({ title, value, onClose, onSubmit, onChange }) {
    return (
        <div className={styles.modalContainer}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h1 className={styles.modalTitle}>{title} 사유</h1>
                    <Image className={styles.x} src={ic_out} alt="Close" onClick={onClose} />
                </div>
                <div className={styles.modalContent}>
                    <h1 className={styles.contentTitle}>내용</h1>
                    <textarea 
                        className={styles.rejectReason}
                        placeholder={`${title} 사유를 입력해주세요.`}
                        value={value}
                        onChange={onChange} 
                    />
                </div>
                <button className={styles.button} onClick={onSubmit}>전송</button>
            </div>
        </div>
    );
}

export default Modal;
