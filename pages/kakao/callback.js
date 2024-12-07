import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSetUser } from '@/context/UserProvider';
import Loading from '@/components/Loading';

export default function KakaoCallback() {
  const router = useRouter();
  const setUser = useSetUser();

  useEffect(() => {
    const handleKakaoLogin = async () => {
      const query = new URLSearchParams(window.location.search);
      const accessToken = query.get('accessToken');
      const refreshToken = query.get('refreshToken');
      const user = query.get('user');

      if (accessToken && refreshToken && user) {
        localStorage.setItem('user', JSON.stringify({ accessToken, refreshToken, user: JSON.parse(user) }));

        setUser(JSON.parse(user));

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

    handleKakaoLogin();
  }, [router, setUser]);

  return <Loading />;
}
