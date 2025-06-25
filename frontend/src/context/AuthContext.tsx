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
	// Add other properties you might expect in your JWT payload if needed, e.g., 'exp' for expiration
	// exp?: number;
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
	// Initialize state from localStorage immediately to avoid a render flicker
	// (Alternative: keep null and use useEffect, but this is often cleaner for initial load)
	const [jwtToken, setJwtToken] = useState<string | null>(() =>
		localStorage.getItem('token')
	);
	const [refreshToken, setRefreshToken] = useState<string | null>(() =>
		localStorage.getItem('refreshToken')
	);
	// Role will be set by the effect below based on jwtToken
	const [role, setRole] = useState<'Admin' | 'Employee' | null>(null);

	// This effect runs on mount and whenever jwtToken changes
	useEffect(() => {
		if (jwtToken) {
			try {
				const decoded: JwtPayload = jwtDecode<JwtPayload>(jwtToken);
				setRole(decoded.role);

				// OPTIONAL: Add token expiration check here
				// if (decoded.exp && decoded.exp * 1000 < Date.now()) {
				//     console.warn('JWT token expired. Attempting to refresh or logging out.');
				//     // Here you'd trigger a token refresh or force logout
				//     // e.g., logout(); // This would clear everything
				// }
			} catch (error) {
				console.error('Failed to decode JWT or JWT is invalid:', error);
				// If the token is invalid (malformed, etc.), clear it.
				logout(); // Log out the user if the token is invalid
			}
		} else {
			// If jwtToken is null (e.g., after logout or no token in localStorage), clear the role
			setRole(null);
		}
	}, [jwtToken]); // Dependency: re-run whenever jwtToken changes

	const login = (jwtToken: string, refreshToken: string) => {
		localStorage.setItem('token', jwtToken);
		localStorage.setItem('refreshToken', refreshToken);
		setJwtToken(jwtToken);
		setRefreshToken(refreshToken);

		// Role will automatically be set by the useEffect above
		// No need to setRole here directly as jwtToken change will trigger the effect
		// const decoded: JwtPayload = jwtDecode<JwtPayload>(jwtToken);
		// setRole(decoded.role); // This line is now redundant here
	};

	const logout = () => {
		localStorage.clear(); // Clears all items including token and refreshToken
		setJwtToken(null);
		setRefreshToken(null);
		setRole(null); // Explicitly set role to null on logout
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
