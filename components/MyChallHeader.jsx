import { useViewport } from "@/context/ViewportProvider.jsx";
import styles from "@/styles/MyChalls.module.css";
import Image from "next/image";
import { useRouter } from 'next/router';

function MyChallHeader({ progress }) {
  const router = useRouter();
  const viewport = useViewport();

  return (
    <>
      <div className={styles.myChall}>
        <h1>나의 챌린지</h1>
        <button className={styles.button} type="button" onClick={() => { router.push('/challenges/new') }}>신규 챌린지 신청 <Image width={viewport.size} height={viewport.size} src="/images/ic_plus.png" alt="New challenge" /></button>
      </div>
      <div className={styles.myChallHeader}>
        <div className={styles.myChallHeaderItem}>
          <button className={`${styles.button} ${progress === "ongoing" && styles.active}`} type="button" onClick={() => router.push("/users/me/challenges/ongoing")}>참여중인 챌린지</button>
        </div>
        <div className={styles.myChallHeaderItem}>
          <button className={`${styles.button} ${progress === "completed" && styles.active}`} type="button" onClick={() => router.push("/users/me/challenges/completed")}>완료한 챌린지</button>
        </div>
        <div className={styles.myChallHeaderItem}>
          <button className={`${styles.button} ${progress === "applied" && styles.active}`} type="button" onClick={() => router.push("/users/me/challenges/applied")}>신청한 챌린지</button>
        </div>
      </div>
    </>
  );
}

export default MyChallHeader;
