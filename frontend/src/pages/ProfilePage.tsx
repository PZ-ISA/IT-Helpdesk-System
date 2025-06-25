// pages/ProfilePage.tsx

import { Box, Button, Modal, Typography } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import UserService, {
	type UserProfile,
	type ChangePasswordData,
} from '../services/UserService';
import TicketService, {
	type Ticket as TicketType,
} from '../services/TicketService';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);

	const [allTickets, setAllTickets] = useState<TicketType[]>([]);
	const [myTickets, setMyTickets] = useState<TicketType[]>([]);
	const [loadingTickets, setLoadingTickets] = useState(true);
	const [ticketsError, setTicketsError] = useState<string | null>(null);

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

	// New state for ticket modal
	const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(
		null
	);
	const [ticketMessage, setTicketMessage] = useState('');
	const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
	const [isClosingTicket, setIsClosingTicket] = useState(false);

	// New state for ticket filtering
	const [showClosedTickets, setShowClosedTickets] = useState(false);

	const { jwtToken, logout } = useAuth();
	const userId = profile?.id;

	// Filter tickets based on status preference
	const filteredTickets = showClosedTickets
		? myTickets
		: myTickets.filter((ticket) => ticket.status !== 2);

	// --- Fetch and Filter Tickets Function ---
	const fetchAndFilterTickets = useCallback(async () => {
		console.log('fetchAndFilterTickets called', {
			jwtToken: !!jwtToken,
			userId,
		});

		if (!jwtToken || !userId) {
			console.warn('No JWT token or userId available to fetch tickets.', {
				jwtToken: !!jwtToken,
				userId,
			});
			setLoadingTickets(false);
			return;
		}

		try {
			setLoadingTickets(true);
			setTicketsError(null);
			console.log('About to call TicketService.getAllTickets');

			// Fetch all tickets
			const tickets = await TicketService.getTickets(jwtToken);
			console.log('Fetched tickets:', tickets);
			setAllTickets(tickets.items);

			// Filter tickets where user is either the creator (employeeId) or assignee (adminId)
			const userTickets = tickets.items.filter(
				(ticket) => ticket.adminUserId === userId
			);
			console.log('Filtered user tickets:', userTickets);
			setMyTickets(userTickets);
		} catch (error: any) {
			console.error('Failed to fetch tickets', error);
			const errorMessage =
				error.response?.data?.message || 'Failed to fetch tickets.';
			setTicketsError(errorMessage);

			if (
				error.response?.status === 401 ||
				error.response?.status === 403
			) {
				logout();
			}
		} finally {
			setLoadingTickets(false);
		}
	}, [jwtToken, userId, logout]);

	// --- Ticket Modal Handlers ---
	const handleTicketClick = (e: React.MouseEvent, ticket: TicketType) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedTicket(ticket);
		setTicketMessage('');
		setIsTicketModalOpen(true);
	};

	const handleTicketModalClose = () => {
		setIsTicketModalOpen(false);
		setSelectedTicket(null);
		setTicketMessage('');
	};

	const handleMessageSubmit = async () => {
		if (!selectedTicket || !ticketMessage.trim() || !jwtToken) {
			alert('Please enter a message.');
			return;
		}

		setIsSubmittingMessage(true);
		try {
			// Assuming you have a method to add a message/comment to a ticket
			// You'll need to implement this in your TicketService
			await TicketService.sendTicketMessage(
				selectedTicket.id,
				{ message: ticketMessage },
				jwtToken
			);

			alert('Message added successfully!');
			setTicketMessage('');
			// Optionally refresh tickets to show updated info
			fetchAndFilterTickets();
		} catch (error: any) {
			console.error('Failed to add message', error);
			const errorMessage =
				error.response?.data?.message || 'Failed to add message.';
			alert(errorMessage);
		} finally {
			setIsSubmittingMessage(false);
		}
	};

	const handleCloseTicket = async () => {
		if (!selectedTicket || !jwtToken) return;

		if (!confirm('Are you sure you want to close this ticket?')) {
			return;
		}

		setIsClosingTicket(true);
		try {
			// Assuming you have a method to close a ticket
			// You'll need to implement this in your TicketService
			await TicketService.closeTicket(selectedTicket.id, jwtToken);

			alert('Ticket closed successfully!');
			handleTicketModalClose();
			// Refresh tickets to show updated status
			fetchAndFilterTickets();
		} catch (error: any) {
			console.error('Failed to close ticket', error);
			const errorMessage =
				error.response?.data?.message || 'Failed to close ticket.';
			alert(errorMessage);
		} finally {
			setIsClosingTicket(false);
		}
	};

	// --- Original Modal Handlers ---
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

	// --- Fetch Tickets on Component Mount ---
	useEffect(() => {
		console.log('Tickets useEffect triggered', {
			jwtToken: !!jwtToken,
			userId,
		});
		if (jwtToken && userId) {
			console.log('Calling fetchAndFilterTickets');
			fetchAndFilterTickets();
		} else {
			console.log('Missing jwtToken or userId', {
				jwtToken: !!jwtToken,
				userId,
			});
			setLoadingTickets(false);
		}
	}, [jwtToken, userId, fetchAndFilterTickets]);

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

				{/* --- Assigned Tickets Section --- */}
				<div className='mt-8 border-t pt-6 border-gray-200'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3'>
						<h2 className='text-2xl font-semibold text-gray-700'>
							Assigned Tickets
						</h2>

						{/* Filter Controls */}
						<div className='flex items-center gap-3'>
							<span className='text-sm text-gray-600'>
								Show closed tickets:
							</span>
							<label className='relative inline-flex items-center cursor-pointer'>
								<input
									type='checkbox'
									className='sr-only peer'
									checked={showClosedTickets}
									onChange={(e) =>
										setShowClosedTickets(e.target.checked)
									}
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
							</label>
						</div>
					</div>

					{/* Ticket Stats */}
					<div className='mb-4 p-3 bg-gray-50 rounded-lg'>
						<div className='flex flex-wrap gap-4 text-sm text-gray-600'>
							<span>
								<strong>Total:</strong> {myTickets.length}
							</span>
							<span>
								<strong>Open:</strong>{' '}
								{myTickets.filter((t) => t.status === 0).length}
							</span>
							<span>
								<strong>In Progress:</strong>{' '}
								{myTickets.filter((t) => t.status === 1).length}
							</span>
							<span>
								<strong>Closed:</strong>{' '}
								{myTickets.filter((t) => t.status === 2).length}
							</span>
							{!showClosedTickets &&
								myTickets.filter((t) => t.status === 2).length >
									0 && (
									<span className='text-blue-600'>
										(
										{
											myTickets.filter(
												(t) => t.status === 2
											).length
										}{' '}
										closed tickets hidden)
									</span>
								)}
						</div>
					</div>
					{loadingTickets ? (
						<div className='flex justify-center items-center py-6'>
							<div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
							<p className='ml-3 text-gray-600'>
								Loading your tickets...
							</p>
						</div>
					) : ticketsError ? (
						<div className='text-red-600 text-center p-4 border border-red-300 bg-red-50 rounded-md'>
							{ticketsError}
						</div>
					) : filteredTickets.length === 0 ? (
						<div className='text-gray-500 text-center p-4 border border-gray-300 bg-gray-50 rounded-md'>
							{myTickets.length === 0
								? 'You have no tickets currently associated with your account.'
								: showClosedTickets
									? 'No tickets found.'
									: "No open tickets. Toggle 'Show closed tickets' to see all tickets."}
						</div>
					) : (
						<div className='grid gap-4'>
							{filteredTickets.map((ticket) => (
								<div
									key={ticket.id}
									onClick={(e) =>
										handleTicketClick(e, ticket)
									}
									className='block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white cursor-pointer hover:bg-gray-50'
								>
									<h3 className='font-semibold text-gray-800 text-lg mb-1'>
										{ticket.title}
									</h3>
									<p className='text-sm text-gray-600 line-clamp-2'>
										{ticket.description}
									</p>
									<div className='flex justify-between items-center text-xs text-gray-500 mt-2'>
										<span>
											Status:{' '}
											<span
												className={`font-medium ${
													ticket.status === 0
														? 'text-red-500'
														: ticket.status === 1
															? 'text-yellow-600'
															: 'text-green-600'
												}`}
											>
												{ticket.status === 0
													? 'Open'
													: ticket.status === 1
														? 'In Progress'
														: 'Closed'}
											</span>
										</span>
									</div>
									{ticket.employeeUserId === userId && (
										<p className='text-xs text-green-600 mt-1'>
											Created by you
										</p>
									)}
									{ticket.adminUserId === userId && (
										<p className='text-xs text-blue-600 mt-1'>
											Assigned to you
										</p>
									)}
									<p className='text-xs text-gray-500 mt-1'>
										Last activity:{' '}
										{new Date(
											ticket.updatedAt
										).toLocaleString()}
									</p>
								</div>
							))}
						</div>
					)}
				</div>

				{/* --- Ticket Modal --- */}
				<Modal
					open={isTicketModalOpen}
					onClose={handleTicketModalClose}
				>
					<div
						className='fixed inset-0 flex items-center justify-center p-4'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
					>
						<Box className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto'>
							{selectedTicket && (
								<>
									<Typography
										variant='h6'
										component='h2'
										className='text-gray-800 mb-4'
									>
										{selectedTicket.title}
									</Typography>

									<div className='mb-4 p-3 bg-gray-50 rounded-lg'>
										<p className='text-sm text-gray-600 mb-2'>
											<strong>Description:</strong>
										</p>
										<p className='text-sm text-gray-700'>
											{selectedTicket.description}
										</p>
									</div>

									<div className='mb-4 text-sm text-gray-600'>
										<p className='mb-1'>
											<strong>Status:</strong>{' '}
											<span
												className={`font-medium ${
													selectedTicket.status === 0
														? 'text-red-500'
														: selectedTicket.status ===
															  1
															? 'text-yellow-600'
															: 'text-green-600'
												}`}
											>
												{selectedTicket.status === 0
													? 'Open'
													: selectedTicket.status ===
														  1
														? 'In Progress'
														: 'Closed'}
											</span>
										</p>
										<p className='mb-1'>
											<strong>Last Updated:</strong>{' '}
											{new Date(
												selectedTicket.updatedAt
											).toLocaleString()}
										</p>
									</div>

									{selectedTicket.status !== 2 && (
										<>
											<div className='mb-4'>
												<label className='block text-sm font-medium text-gray-700 mb-2'>
													Add a message:
												</label>
												<textarea
													className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
													rows={4}
													placeholder='Enter your message...'
													value={ticketMessage}
													onChange={(e) =>
														setTicketMessage(
															e.target.value
														)
													}
												/>
											</div>

											<div className='flex flex-col sm:flex-row justify-end gap-3'>
												<Button
													variant='outlined'
													onClick={
														handleTicketModalClose
													}
													sx={{ borderRadius: '8px' }}
												>
													Cancel
												</Button>
												<Button
													variant='contained'
													color='primary'
													onClick={
														handleMessageSubmit
													}
													disabled={
														isSubmittingMessage ||
														!ticketMessage.trim()
													}
													sx={{ borderRadius: '8px' }}
												>
													{isSubmittingMessage
														? 'Sending...'
														: 'Send Message'}
												</Button>
												<Button
													variant='contained'
													color='error'
													onClick={handleCloseTicket}
													disabled={isClosingTicket}
													sx={{ borderRadius: '8px' }}
												>
													{isClosingTicket
														? 'Closing...'
														: 'Close Ticket'}
												</Button>
											</div>
										</>
									)}

									{selectedTicket.status === 2 && (
										<div className='text-center'>
											<p className='text-gray-500 mb-4'>
												This ticket is already closed.
											</p>
											<Button
												variant='outlined'
												onClick={handleTicketModalClose}
												sx={{ borderRadius: '8px' }}
											>
												Close
											</Button>
										</div>
									)}
								</>
							)}
						</Box>
					</div>
				</Modal>

				{/* --- Original Modals --- */}
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

export default ProfilePage;
