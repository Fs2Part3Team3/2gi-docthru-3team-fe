import React, { useState, useEffect, useRef } from "react";
import styles from './Header.module.css';
import { useSetUser, useUser } from "@/context/UserProvider.jsx";
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from "next/link";
import { useViewport } from "@/context/ViewportProvider.jsx";
import { GRADE } from "@/apis/translate.js";
import Notis from "@/components/notis.jsx";
import { useQuery } from "@tanstack/react-query";
import { getNotis } from "@/apis/notisService.js";

const Header = () => {
  const viewport = useViewport();
  const user = useUser();
  const setUser = useSetUser();
  const isAdmin = user?.role === "Admin";
  const router = useRouter();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isUserDDOpen, setIsUserDDOpen] = useState(false);
  const currentPath = router.pathname;
  const dropdownRef = useRef();
  const notiRef = useRef();
  const [gotNotis, setGotNotis] = useState(false);
  const { data: notis, isPending, isError } = useQuery({
    queryKey: ["gotNotis", user?.id],
    queryFn: () => getNotis({ page: 1, limit: 1, is_read: false }),
    enabled: user?.id !== undefined,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      const { target } = e;
      if (isUserDDOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsUserDDOpen(false);
      }
      if (isNotiOpen && notiRef.current && !notiRef.current.contains(target)) {
        setIsNotiOpen(false);
      }
    };
    const handleRouterChange = () => {
      setIsUserDDOpen(false);
      setIsNotiOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    router.events.on("routeChangeStart", handleRouterChange);
  }, [isUserDDOpen, isNotiOpen, router.events]);

  useEffect(() => {
    if (notis?.user) {
      setUser(notis.user);
    }
    if (notis?.notifications?.totalCount > 0) {
      setGotNotis(true);
    } else {
      setGotNotis(false);
    }
  }, [notis]);

	return (
	  <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/"><Image width={120} height={27} src="/images/img_logo.png" alt="Logo" className={styles.logo} priority /></Link>
        {user?.role === "Admin" && (
          <div className={styles.adminNav}>
            <Link href="/admin/manage"><p className={`${styles.manageButton} ${currentPath === '/admin/manage' ? styles.active : ''}`}>챌린지 관리</p></Link>
            <Link href="/" ><p className={`${styles.listButton} ${currentPath === '/' ? styles.active : ''}`}>챌린지 목록</p></Link>
          </div>
        )}
      </div>
      <div className={styles.right}>
        {!user ? (
          <button className={styles.loginButton} onClick={() => router.push("/login")}>
            로그인
          </button>
        ) : (
          <>
            <div ref={notiRef} className={styles.notiContainer}>
                <Image width={24} height={24} src={gotNotis ? `/images/ic_noti.png` : `/images/ic_noti_empty.png`} alt="noti" className={styles.notificationButton} onClick={() => setIsNotiOpen(prev => !prev)} />
              {isNotiOpen && <div className={styles.notiDropDown}>
                <div className={styles.notiHeader}>
                  <h3>알림</h3>
                  <Link href="/users/me/notis-read"><button className={styles.notiButton}>읽은 알림 보기</button></Link>
                </div>
                <Notis />
              </div>}
            </div>
            <div className={styles.userContainer} ref={dropdownRef} >
                <Image width={32} height={32} src="/images/ic_profile.png" className={styles.userButton} alt="Profile" onClick={() => setIsUserDDOpen(prev => !prev)} />
              {isUserDDOpen && <div className={styles.userDropDown}>
                <div className={styles.user}>
                  <Image width={1.5 * viewport.size} height={1.5 * viewport.size} src="/images/ic_profile.png" alt="Profile" />
                  <div className={styles.nicknameAndGrade}>
                    <span className={styles.nickname}>{user?.nickname}</span>
                    <span className={styles.grade}>{GRADE[user?.grade]}</span>
                  </div>
                </div>
                  {isAdmin ? <Link href="/admin/manage"><div className={styles.userDropDownItem}>챌린지 관리하기</div></Link>
                : <Link href="/users/me/challenges/ongoing"><div className={styles.userDropDownItem}>나의 챌린지</div></Link>}
                <button className={styles.userDropDownItem} onClick={() => {
                  setUser(null);
                  localStorage.removeItem("user");
                  router.push("/");
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
