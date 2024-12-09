import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSetUser } from '@/context/UserProvider';
import Loading from '@/components/Loading';

export default function GoogleCallback() {
  const router = useRouter();
  const setUser = useSetUser();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      // URL에서 쿼리 파라미터 추출
      const query = new URLSearchParams(window.location.search);
      const accessToken = query.get('accessToken');
      const refreshToken = query.get('refreshToken');
      const user = query.get('user');

      if (accessToken && refreshToken && user) {
        localStorage.setItem('user', JSON.stringify({ accessToken, refreshToken, user: JSON.parse(user) }));

        // 사용자 정보 업데이트
        setUser(JSON.parse(user));

        // 권한에 따라 페이지 이동
        const parsedUser = JSON.parse(user);
        if (parsedUser.role === 'Admin') {
          router.push('/admin/manage');
        } else {
          router.push('/');
        }
      } else {
        router.push('/login'); 
      }
    };

    handleGoogleLogin();
  }, [router, setUser]);

  return <Loading />;
}
