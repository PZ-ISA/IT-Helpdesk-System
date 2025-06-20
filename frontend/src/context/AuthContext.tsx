// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
	jwtToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	role: 'Admin' | 'Employee' | null;
	login: (jwtToken: string, refreshToken: string) => void;
	logout: () => void;
};

type JwtPayload = {
  role: 'Admin' | 'Employee';
};

const AuthContext = createContext<AuthContextType>({
	jwtToken: null,
	refreshToken: null,
	isAuthenticated: false,
	role: null,
	login: () => {},
	logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [jwtToken, setJwtToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [role, setRole] = useState<'Admin' | 'Employee' | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedRefreshToken = localStorage.getItem('refreshToken');
		if (storedToken) setJwtToken(storedToken);
		if (storedRefreshToken) setRefreshToken(storedRefreshToken);
	}, []);

	const login = (jwtToken: string, refreshToken: string) => {
		localStorage.setItem('token', jwtToken);
		localStorage.setItem('refreshToken', refreshToken);
		setJwtToken(jwtToken);
		setRefreshToken(refreshToken);

		const decoded: JwtPayload = jwtDecode<JwtPayload>(jwtToken);
		setRole(decoded.role);
	};

	const logout = () => {
		localStorage.clear();
		setJwtToken(null);
		setRefreshToken(null);
	};

	return (
		<AuthContext.Provider
			value={{
				jwtToken,
				refreshToken,
				isAuthenticated: !!jwtToken,
				role,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
