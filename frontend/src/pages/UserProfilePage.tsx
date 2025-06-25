// pages/UserProfilePage.tsx

import { Box, Button, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserService, {
	type UserProfile,
	type ChangePasswordData,
} from '../services/UserService';

const UserProfilePage = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);

	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [passwordFormData, setPasswordFormData] =
		useState<ChangePasswordData>({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});

	const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
	const [editProfileFormData, setEditProfileFormData] = useState<Omit<
		UserProfile,
		'id' | 'role'
	> | null>(null);

	const { jwtToken, logout } = useAuth();

	// --- Modal Handlers ---
	const handlePasswordModalOpen = () => setIsPasswordModalOpen(true);
	const handlePasswordModalClose = () => {
		setPasswordFormData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
		setIsPasswordModalOpen(false);
	};

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
		setEditProfileFormData(null);
		setIsEditProfileModalOpen(false);
	};

	// --- Fetch User Profile ---
	useEffect(() => {
		const fetchProfile = async () => {
			if (!jwtToken) {
				console.warn('No JWT token available to fetch profile.');
				return;
			}
			try {
				const userProfile = await UserService.getCurrentUser(jwtToken);
				setProfile(userProfile);
			} catch (error: any) {
				console.error('Failed to fetch profile', error);
				const errorMessage =
					error.response?.data?.message || 'Failed to fetch profile.';
				alert(errorMessage);
				if (
					error.response?.status === 401 ||
					error.response?.status === 403
				) {
					logout();
				}
			}
		};

		if (jwtToken) {
			fetchProfile();
		}
	}, [jwtToken, logout]);

	// --- Generic Change Handlers ---
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordFormData({
			...passwordFormData,
			[e.target.name]: e.target.value,
		});
	};

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

	// --- Submit Handlers ---
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
			await UserService.changePassword(passwordFormData, jwtToken);
			alert('Password changed successfully!');
			handlePasswordModalClose();
		} catch (error: any) {
			console.error('Password change failed', error);
			const errorMessage =
				error.response?.data?.message ||
				'Failed to change password. Please check your current password.';
			alert(errorMessage);
		}
	};

	const handleEditProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!editProfileFormData) return;
		if (!jwtToken) {
			alert('Authentication required to update profile.');
			return;
		}

		try {
			const updatedProfile = await UserService.updateUserProfile(
				editProfileFormData,
				jwtToken
			);
			setProfile(updatedProfile);
			alert('Profile updated successfully!');
			handleEditProfileModalClose();
		} catch (error: any) {
			console.error('Profile update failed', error);
			const errorMessage =
				error.response?.data?.message || 'Failed to update profile.';
			alert(errorMessage);
		}
	};

	// --- JSX ---
	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm'>
				<h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
					USER PROFILE
				</h1>

				{/* User Profile Information */}
				<div className='mb-8 border-b pb-6 border-gray-200'>
					<h2 className='text-2xl font-semibold mb-4 text-gray-700'>
						Your Details
					</h2>
					{profile ? (
						<div className='space-y-3 text-gray-700'>
							<p className='text-lg'>
								<span className='font-bold'>Name:</span>{' '}
								{profile.name} {profile.surname}
							</p>
							<p className='text-lg'>
								<span className='font-bold'>Email:</span>{' '}
								{profile.email}
							</p>
							<p className='text-lg'>
								<span className='font-bold'>Role:</span>{' '}
								{profile.role}
							</p>
						</div>
					) : (
						<p className='text-gray-500'>
							Loading profile details...
						</p>
					)}

					<div className='flex flex-col sm:flex-row justify-center gap-4 mt-6'>
						<Button
							onClick={handlePasswordModalOpen}
							variant='outlined'
							color='primary'
							sx={{ padding: '10px 20px', borderRadius: '8px' }}
						>
							Reset Password
						</Button>
						<Button
							onClick={handleEditProfileModalOpen}
							variant='contained'
							color='primary'
							sx={{ padding: '10px 20px', borderRadius: '8px' }}
						>
							Change Profile Info
						</Button>
					</div>
				</div>

				{/* --- Password Modal --- */}
				<Modal
					open={isPasswordModalOpen}
					onClose={handlePasswordModalClose}
				>
					<div
						className='fixed inset-0 flex items-center justify-center'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
					>
						<Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-3'>
							<Typography
								variant='h6'
								component='h2'
								className='text-gray-800'
							>
								Reset Password
							</Typography>
							<input
								type='password'
								name='currentPassword'
								placeholder='Current password'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={passwordFormData.currentPassword}
								onChange={handlePasswordChange}
							/>
							<input
								type='password'
								name='newPassword'
								placeholder='New password'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={passwordFormData.newPassword}
								onChange={handlePasswordChange}
							/>
							<input
								type='password'
								name='confirmPassword'
								placeholder='Confirm new password'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={passwordFormData.confirmPassword}
								onChange={handlePasswordChange}
							/>
							<div className='flex justify-end space-x-4 gap-4'>
								<Button
									variant='outlined'
									onClick={handlePasswordModalClose}
									sx={{ borderRadius: '8px' }}
								>
									Cancel
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={handlePasswordSubmit}
									sx={{ borderRadius: '8px' }}
								>
									Confirm
								</Button>
							</div>
						</Box>
					</div>
				</Modal>

				{/* --- Edit Profile Modal --- */}
				<Modal
					open={isEditProfileModalOpen}
					onClose={handleEditProfileModalClose}
				>
					<div
						className='fixed inset-0 flex items-center justify-center'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
					>
						<Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-3'>
							<Typography
								variant='h6'
								component='h2'
								className='text-gray-800'
							>
								Change Profile Information
							</Typography>
							<input
								type='text'
								name='name'
								placeholder='Name'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={editProfileFormData?.name || ''}
								onChange={handleEditProfileChange}
							/>
							<input
								type='text'
								name='surname'
								placeholder='Surname'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={editProfileFormData?.surname || ''}
								onChange={handleEditProfileChange}
							/>
							<input
								type='email'
								name='email'
								placeholder='Email'
								className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
								value={editProfileFormData?.email || ''}
								onChange={handleEditProfileChange}
							/>
							<div className='flex justify-end space-x-4 gap-4'>
								<Button
									variant='outlined'
									onClick={handleEditProfileModalClose}
									sx={{ borderRadius: '8px' }}
								>
									Cancel
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={handleEditProfileSubmit}
									sx={{ borderRadius: '8px' }}
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

export default UserProfilePage;
