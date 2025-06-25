// pages/ProfilePage.tsx

import { Box, Button, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserService, {
	type UserProfile,
	type ChangePasswordData,
} from '../services/UserService';

const ProfilePage = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);

	// State for Reset Password Modal
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [passwordFormData, setPasswordFormData] =
		useState<ChangePasswordData>({
			// Use ChangePasswordData type
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});

	// State for Edit Profile Info Modal
	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
	const [editProfileFormData, setEditProfileFormData] = useState<Omit<
		UserProfile,
		'id' | 'role'
	> | null>(null);

	const { jwtToken } = useAuth();

	// --- Password Modal Handlers ---
	const handlePasswordModalOpen = () => setIsPasswordModalOpen(true);
	const handlePasswordModalClose = () => {
		setPasswordFormData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
		setIsPasswordModalOpen(false);
	};

	// --- Edit Profile Modal Handlers ---
	const handleEditProfileModalOpen = () => {
		if (profile) {
			setEditProfileFormData({
				name: profile.name,
				surname: profile.surname,
				email: profile.email,
			});
		}
		setIsEditProfileModalOpen(true);
	};
	const handleEditProfileModalClose = () => {
		setEditProfileFormData(null); // Clear form data on close
		setIsEditProfileModalOpen(false);
	};

	useEffect(() => {
		const fetchProfile = async () => {
			if (!jwtToken) {
				console.warn('No JWT token available to fetch profile.');
				return;
			}
			try {
				// Use UserService to fetch current user profile
				const userProfile = await UserService.getCurrentUser(jwtToken);
				setProfile(userProfile);
			} catch (error: any) {
				console.error('Failed to fetch profile', error);
				const errorMessage =
					error.response?.data?.message || 'Failed to fetch profile.';
				alert(errorMessage); // Use alert for user feedback
				// Optionally handle error, e.g., redirect to login if token invalid
			}
		};

		if (jwtToken) {
			fetchProfile();
		}
	}, [jwtToken]);

	// --- Generic Change Handler for Password Form ---
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordFormData({
			...passwordFormData,
			[e.target.name]: e.target.value,
		});
	};

	// --- Generic Change Handler for Edit Profile Form ---
	const handleEditProfileChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (editProfileFormData) {
			setEditProfileFormData({
				...editProfileFormData,
				[e.target.name]: e.target.value,
			});
		}
	};

	// --- Submit Handler for Password Change ---
	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
			alert("New password doesn't match.");
			return;
		}

		if (!jwtToken) {
			alert('Authentication required to change password.');
			return;
		}

		try {
			// Use UserService to change password
			await UserService.changePassword(passwordFormData, jwtToken);
			handlePasswordModalClose();
		} catch (error: any) {
			console.error('Password change failed', error);
			const errorMessage =
				error.response?.data?.message ||
				'Failed to change password. Please check your current password.';
			alert(errorMessage);
		}
	};

	// --- Submit Handler for Profile Info Change ---
	const handleEditProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!editProfileFormData) return; // Should not happen if modal is open correctly
		if (!jwtToken) {
			alert('Authentication required to update profile.');
			return;
		}

		try {
			// Use UserService to update user profile
			const updatedProfile = await UserService.updateUserProfile(
				editProfileFormData,
				jwtToken
			);
			setProfile(updatedProfile); // Update the profile state with the new data from the backend
			handleEditProfileModalClose();
			window.location.reload(); // <--- Added this line to refresh the page
		} catch (error: any) {
			console.error('Profile update failed', error);
			const errorMessage =
				error.response?.data?.message || 'Failed to update profile.';
			alert(errorMessage);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-md bg-white p-8 rounded-xl shadow-sm'>
				<h1 className='text-3xl font-bold text-center mb-4'>
					USER PROFILE
				</h1>

				{profile ? (
					<div className='space-y-2'>
						<p className='text-lg font-medium'>
							<span className='font-bold'>Name:</span>{' '}
							{profile.name} {profile.surname}
						</p>
						<p className='text-lg font-medium'>
							<span className='font-bold'>Email:</span>{' '}
							{profile.email}
						</p>
						<p className='text-lg font-medium'>
							<span className='font-bold'>Role:</span>{' '}
							{profile.role}
						</p>
					</div>
				) : (
					<p>Loading profile...</p>
				)}

				<div className='flex flex-col sm:flex-row justify-center gap-4 mt-6'>
					<Button
						onClick={handlePasswordModalOpen}
						variant='outlined'
					>
						Reset password
					</Button>
					<Button
						onClick={handleEditProfileModalOpen}
						variant='contained'
					>
						Change Profile Info
					</Button>
				</div>

				{/* --- Reset Password Modal --- */}
				<Modal
					open={isPasswordModalOpen}
					onClose={handlePasswordModalClose}
				>
					<div
						className='fixed inset-0 flex items-center justify-center'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
					>
						<Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-3'>
							<Typography variant='h6' component='h2'>
								Reset Password
							</Typography>

							<input
								type='password'
								name='currentPassword'
								placeholder='Current password'
								className='w-full p-3 border rounded-lg'
								value={passwordFormData.currentPassword}
								onChange={handlePasswordChange}
							/>
							<input
								type='password'
								name='newPassword'
								placeholder='New password'
								className='w-full p-3 border rounded-lg'
								value={passwordFormData.newPassword}
								onChange={handlePasswordChange}
							/>
							<input
								type='password'
								name='confirmPassword'
								placeholder='Confirm new password'
								className='w-full p-3 border rounded-lg'
								value={passwordFormData.confirmPassword}
								onChange={handlePasswordChange}
							/>

							<div className='flex justify-end space-x-4 gap-4'>
								{' '}
								{/* Added space-x-4 here */}
								<Button
									variant='outlined'
									onClick={handlePasswordModalClose}
								>
									Cancel
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={handlePasswordSubmit}
								>
									Confirm
								</Button>
							</div>
						</Box>
					</div>
				</Modal>

				{/* --- Change Profile Info Modal --- */}
				<Modal
					open={isEditProfileModalOpen}
					onClose={handleEditProfileModalClose}
				>
					<div
						className='fixed inset-0 flex items-center justify-center'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
					>
						<Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-3'>
							<Typography variant='h6' component='h2'>
								Change Profile Information
							</Typography>

							<input
								type='text'
								name='name'
								placeholder='Name'
								className='w-full p-3 border rounded-lg'
								value={editProfileFormData?.name || ''}
								onChange={handleEditProfileChange}
							/>
							<input
								type='text'
								name='surname'
								placeholder='Surname'
								className='w-full p-3 border rounded-lg'
								value={editProfileFormData?.surname || ''}
								onChange={handleEditProfileChange}
							/>
							<input
								type='email'
								name='email'
								placeholder='Email'
								className='w-full p-3 border rounded-lg'
								value={editProfileFormData?.email || ''}
								onChange={handleEditProfileChange}
							/>

							<div className='flex justify-end space-x-4 gap-4'>
								<Button
									variant='outlined'
									onClick={handleEditProfileModalClose}
								>
									Cancel
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={handleEditProfileSubmit}
								>
									Save Changes
								</Button>
							</div>
						</Box>
					</div>
				</Modal>
			</div>
		</div>
	);
};

export default ProfilePage;
