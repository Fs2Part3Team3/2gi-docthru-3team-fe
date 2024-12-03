import { useState, createContext, useContext } from 'react';
import { useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			setUser(JSON.parse(storedUser).user);
		}
	}, []);

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('반드시 UserProvider 안에서 사용해야 합니다.');
	}

	const { user } = context;
	return user;
}

export function useSetUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('반드시 UserProvider 안에서 사용해야 합니다.');
	}

	const { setUser } = context;
	return setUser;
}
