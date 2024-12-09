import styles from './Footer.module.css';
import Image from 'next/image';
import Link from 'next/link';
import img_logo from '@/public/images/img_logo.png';

function Footer() {
  return (
    <>
      <div className={styles.footerContainer}>
        <div className={styles.footer}>
          <Image src={img_logo} width={120} height={27} alt="로고" />
          <div className={styles.footerMenu}>
            <Link href="/footer/about"> 중급 프로젝트 소개 </Link>
            <Link href="/footer/terms"> 이용약관 </Link>
            <Link href="/footer/policy"> 개인정보 처리방침 </Link>
          </div>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} Docthru. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}

export default Footer;
