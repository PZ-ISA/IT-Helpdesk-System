// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (userData: {
	name: string;
	surname: string;
	email: string;
	role: string;
	password: string;
	confirmPassword: string;
}) => {
	try {
		console.log('Sending register data:', userData);
		const response = await axios.post(`${API_URL}/register`, userData, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error(error);
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || 'Registration failed'
			);
		}
		throw new Error('Unknown error occurred');
	}
};

export const login = async (userData: { email: string; password: string }) => {
	try {
		const response = await axios.post(`${API_URL}/login`, userData, {
			headers: {
				'Content-Type': 'application/json',
			},
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error(error);
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || 'Login failed');
		}
		throw new Error('Unknown error occurred');
	}
};
