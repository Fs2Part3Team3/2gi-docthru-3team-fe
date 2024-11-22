import React, {useState} from "react";
import styles from './Header.module.css';
import { useSetUser, useUser } from "@/context/UserProvider.jsx";
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from "next/link";
import { useViewport } from "@/context/ViewportProvider.jsx";
import { GRADE } from "@/apis/translate.js";

const Header = () => {
  const viewport = useViewport();
  const user = useUser();
  const setUser = useSetUser();
  const router = useRouter();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isUserDDOpen, setIsUserDDOpen] = useState(false);

  console.log(user);
  const { nickname, grade } = user || {};

	return (
	<nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/"><Image width={120} height={27} src="/images/img_logo.png" alt="Logo" className={styles.logo} priority /></Link>
      </div>
      <div className={styles.right}>
        {/* TODO: !user */}
        {!user ? (
          <button className={styles.loginButton} onClick={() => router.push("/login")}>
            로그인
          </button>
        ) : (
          <>
            <div className={styles.notiContainer}>
              <Image width={24} height={24} src="/images/ic_bell.png" alt="noti" className={styles.notificationButton} onClick={() => setIsNotiOpen(prev => !prev)} />
              {isNotiOpen && <div className={styles.notiDropDown}>
                <h3>알림</h3>
                {/* notifications.map... */}
              </div>}
            </div>
            <div className={styles.userContainer}>
                <Image width={32} height={32} src="/images/ic_profile.png" className={styles.userButton} alt="Profile" onClick={() => setIsUserDDOpen(prev => !prev)} />
              {isUserDDOpen && <div className={styles.userDropDown}>
                <div className={styles.user}>
                  <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
                  <div className={styles.nicknameAndGrade}>
                    <span className={styles.nickname}>{nickname}</span>
                    <span className={styles.grade}>{GRADE[grade]}</span>
                  </div>
                </div>
                <Link href="/users/me/challenges/ongoing"><div className={styles.userDropDownItem}>나의 챌린지</div></Link>
                <button className={styles.userDropDownItem} onClick={() => {
                  setUser(null);
                }}>로그아웃</button>
              </div>}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
