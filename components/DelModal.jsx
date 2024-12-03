import styles from "./DelModal.module.css";
import X from "./X.jsx";

function DelModal({ error, setError, reasonDel, setReasonDel }) {
	return (
		<div className={[styles.popup_container, (error ? "" : styles.none)].join(" ")}>
			<div className={styles.popup}>
				<div className={styles.head}>
					<h3>삭제 사유</h3>
					<X width={24} height={24} onClick={() => {
						error?.onCancel?.();
						setError(null);
					}} />
				</div>
				<h4>내용</h4>
				<textarea className={styles.popup_text} placeholder="삭제 사유를 입력해주세요." value={reasonDel} onChange={(e) => setReasonDel(e.target.value)}></textarea>
				<button className={styles.popup_button_ok} onClick={() => {
					error?.onClose?.();
					setError(null);
				}}>확인</button>
			</div>
		</div>
	);
}

export default DelModal;
