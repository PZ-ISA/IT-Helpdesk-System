// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// --- Start: Define JwtPayload and AuthContextType ---
type JwtPayload = {
	// Assuming your JWT payload contains 'role' and 'sub' (subject/user ID)
	role: 'Admin' | 'Employee';
	sub: string; // 'sub' is a standard JWT claim for the subject (usually userId)
	exp?: number; // Optional: 'exp' for expiration timestamp
	// Add any other custom claims your JWT might contain, e.g., 'name', 'email'
	// name?: string;
	// email?: string;
};

type AuthContextType = {
	jwtToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	role: 'Admin' | 'Employee' | null;
	userId: string | null; // <--- ADDED userId to AuthContextType
	login: (jwtToken: string, refreshToken: string) => void;
	logout: () => void;
};
// --- End: Define JwtPayload and AuthContextType ---

const AuthContext = createContext<AuthContextType>({
	jwtToken: null,
	refreshToken: null,
	isAuthenticated: false,
	role: null,
	userId: null, // <--- ADDED default value for userId
	login: () => {},
	logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [jwtToken, setJwtToken] = useState<string | null>(() =>
		localStorage.getItem('token')
	);
	const [refreshToken, setRefreshToken] = useState<string | null>(() =>
		localStorage.getItem('refreshToken')
	);
	const [role, setRole] = useState<'Admin' | 'Employee' | null>(null);
	const [userId, setUserId] = useState<string | null>(null); // <--- ADDED userId state

	useEffect(() => {
		if (jwtToken) {
			try {
				const decoded: JwtPayload = jwtDecode<JwtPayload>(jwtToken);
				setRole(decoded.role);
				setUserId(decoded.sub); // <--- EXTRACT userId FROM JWT PAYLOAD

				// OPTIONAL: Add token expiration check here
				if (decoded.exp && decoded.exp * 1000 < Date.now()) {
					console.warn('JWT token expired. Logging out.');
					logout(); // Log out the user if the token has already expired
				}
			} catch (error) {
				console.error('Failed to decode JWT or JWT is invalid:', error);
				// If the token is invalid (malformed, etc.), clear it.
				logout(); // Log out the user if the token is invalid
			}
		} else {
			// If jwtToken is null (e.g., after logout or no token in localStorage), clear states
			setRole(null);
			setUserId(null); // <--- CLEAR userId on no token
		}
	}, [jwtToken]); // Dependency: re-run whenever jwtToken changes

	const login = (jwtToken: string, refreshToken: string) => {
		localStorage.setItem('token', jwtToken);
		localStorage.setItem('refreshToken', refreshToken);
		setJwtToken(jwtToken);
		setRefreshToken(refreshToken);

		// The useEffect hook will now handle decoding the new jwtToken
		// and setting the role and userId automatically.
	};

	const logout = () => {
		localStorage.clear(); // Clears all items including token and refreshToken
		setJwtToken(null);
		setRefreshToken(null);
		setRole(null); // Explicitly set role to null on logout
		setUserId(null); // <--- Explicitly set userId to null on logout
	};

	return (
		<AuthContext.Provider
			value={{
				jwtToken,
				refreshToken,
				isAuthenticated: !!jwtToken, // isAuthenticated is true if jwtToken exists
				role,
				userId, // <--- EXPOSE userId in context value
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
