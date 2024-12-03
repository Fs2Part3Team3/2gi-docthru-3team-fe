import styles from "./X.module.css";

function X({ width, height, onClick }) {
	return (
		<svg className={styles.x} width={width} height={height} onClick={onClick}>
			<g>
				<line x1="10%" y1="10%" x2="90%" y2="90%"/>
				<line x1="90%" y1="10%" x2="10%" y2="90%"/>
			</g>
		</svg>
	);
}

export default X;
