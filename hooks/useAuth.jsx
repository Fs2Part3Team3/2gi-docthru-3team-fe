import { useRouter } from 'next/router';
import { useUser } from '@/context/UserProvider';
import { useEffect, useState } from 'react';

export default function useAuth(required ) {
    const allowedUser = useUser();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState(null);
    
    useEffect(() => {
        if (!allowedUser) {
            setErrorMessage({ message: "로그인이 필요한 서비스입니다.", onCancel: () => router.push('/login')});
        }

        else if (required && allowedUser.role !== required) {
            setErrorMessage({ message: "관리자만 접근할 수 있습니다.", onCancel: () => router.push('/')});
        }

        else setErrorMessage(null);

    }, [allowedUser, router, required]);

    return { allowedUser, errorMessage, setErrorMessage };
}