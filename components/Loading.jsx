import styles from "./Loading.module.css";

function Loading() {
	return <div className={styles.loading}><div className={styles.outerCircle}></div><div className={styles.innerCircle}></div></div>
}

export default Loading;
