// src/services/UserService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export type UserProfile = {
	id: string;
	name: string;
	surname: string;
	email: string;
	role: string;
};

export type UpdateUserProfileData = {
	name?: string;
	surname?: string;
	email?: string;
};

// Define the type for the data sent to change password
export type ChangePasswordData = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const UserService = {
	getCurrentUser: async (jwtToken: string): Promise<UserProfile> => {
		const response = await axios.get<UserProfile>(`${API_URL}/users/me`, {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
			withCredentials: true,
		});
		return response.data;
	},

	updateUserProfile: async (
		data: UpdateUserProfileData,
		jwtToken: string
	): Promise<UserProfile> => {
		const response = await axios.put<UserProfile>(
			`${API_URL}/users/me`,
			data,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	changePassword: async (
		data: ChangePasswordData,
		jwtToken: string
	): Promise<any> => {
		const response = await axios.patch(
			`${API_URL}/users/me/change-password`,
			data,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
		return response.data;
	},
};

export default UserService;
