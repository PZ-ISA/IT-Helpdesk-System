import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserTicket from '../components/tickets/UserTicket';
import type { Ticket as TicketType } from '../types/types';
import UserService, { type UserProfile } from '../services/UserService';
import UserTicketsService from '../services/UserTicketsService';

// Type for status filter
type StatusFilter = 'all' | 'open' | 'assigned' | 'closed';
type SortOption = 'newest' | 'oldest' | 'open' | 'closed';

const UserTicketsPage = () => {
	const { jwtToken, logout } = useAuth();
	const navigate = useNavigate();

	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

	const handleTicketUpdate = useCallback((updatedTicket: TicketType) => {
		setTickets((prevTickets) =>
			prevTickets.map((t) =>
				t.id === updatedTicket.id ? updatedTicket : t
			)
		);
	}, []);

	// Function to filter tickets based on status
	const filterTickets = useCallback(
		(tickets: TicketType[], filter: StatusFilter) => {
			switch (filter) {
				case 'open':
					return tickets.filter((ticket) => ticket.status === 0);
				case 'assigned':
					return tickets.filter((ticket) => ticket.status === 1);
				case 'closed':
					return tickets.filter((ticket) => ticket.status === 2);
				case 'all':
				default:
					return tickets;
			}
		},
		[]
	);

	// Update filtered tickets when filter or tickets change
	useEffect(() => {
		setFilteredTickets(filterTickets(tickets, statusFilter));
	}, [tickets, statusFilter, filterTickets]);

	// Fetch user profile and tickets
	useEffect(() => {
		console.log('UserTicketsPage useEffect triggered.');
		console.log('Current jwtToken state:', jwtToken ? 'Present' : 'NULL');

		if (!jwtToken) {
			console.log('No JWT token, navigating to /login.');
			navigate('/login');
			setIsLoading(false);
			return;
		}

		const fetchUserDataAndTickets = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// First fetch user profile to get user ID
				console.log('Fetching user profile...');
				const profile = await UserService.getCurrentUser(jwtToken);
				setUserProfile(profile);
				console.log('User profile fetched:', profile);

				// Then fetch user's tickets (all tickets created by the user)
				console.log('Fetching user tickets...');
				const data = await UserTicketsService.getUserTickets(
					50,
					1,
					jwtToken
				);
				console.log('User tickets fetched:', data.items);

				// All tickets are created by the user, so no need to filter
				setTickets(data.items);
			} catch (err: any) {
				console.error('Failed to fetch user data or tickets:', err);
				if (err.response) {
					console.error('Response status:', err.response.status);
					console.error('Response data:', err.response.data);
				}

				if (err.response && err.response.status === 401) {
					setError(
						'Session expired or invalid token. Please log in again.'
					);
					logout();
					navigate('/login');
				} else if (err.response && err.response.status === 403) {
					setError(
						'Access Forbidden: You do not have permission to view tickets.'
					);
				} else {
					setError('Failed to load tickets. Please try again later.');
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserDataAndTickets();
	}, [jwtToken, navigate, logout]);

	// Sort filtered tickets
	const sorted = [...filteredTickets].sort((a, b) => {
		switch (sortBy) {
			case 'newest':
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				);
			case 'oldest':
				return (
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime()
				);
			case 'open':
				return a.status === 0 ? -1 : b.status === 0 ? 1 : 0;
			case 'closed':
				return a.status === 2 ? -1 : b.status === 2 ? 1 : 0;
			default:
				return 0;
		}
	});

	// Function to handle filter change
	const handleFilterChange = (filter: StatusFilter) => {
		setStatusFilter(filter);
	};

	// Function to handle sort change
	const handleSortChange = (sort: SortOption) => {
		setSortBy(sort);
	};

	// Count tickets for each status
	const openTickets = tickets.filter((ticket) => ticket.status === 0);
	const assignedTickets = tickets.filter((ticket) => ticket.status === 1);
	const closedTickets = tickets.filter((ticket) => ticket.status === 2);

	return (
		<div className='min-h-screen bg-gray-50 p-4'>
			<div className='max-w-6xl mx-auto space-y-6'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
					<div>
						<h1 className='text-3xl font-bold text-gray-900'>
							My Tickets
						</h1>
						<p className='text-gray-600 text-sm mt-1'>
							Manage and track your support tickets
						</p>
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={() => navigate('/main/tickets/new')}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium'
						>
							+ Create New Ticket
						</button>
					</div>
				</div>

				{/* User ticket stats */}
				<div className='bg-white rounded-lg shadow-sm p-6 border'>
					<h3 className='text-lg font-semibold mb-4 text-gray-800'>
						Ticket Overview
					</h3>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='text-center p-4 bg-blue-50 rounded-lg border border-blue-100'>
							<div className='text-2xl font-bold text-blue-600'>
								{tickets.length}
							</div>
							<div className='text-gray-600 text-sm'>
								Total Tickets
							</div>
						</div>
						<div className='text-center p-4 bg-green-50 rounded-lg border border-green-100'>
							<div className='text-2xl font-bold text-green-600'>
								{openTickets.length}
							</div>
							<div className='text-gray-600 text-sm'>
								Open Tickets
							</div>
						</div>
						<div className='text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100'>
							<div className='text-2xl font-bold text-yellow-600'>
								{assignedTickets.length}
							</div>
							<div className='text-gray-600 text-sm'>
								In Progress
							</div>
						</div>
						<div className='text-center p-4 bg-gray-50 rounded-lg border border-gray-100'>
							<div className='text-2xl font-bold text-gray-600'>
								{closedTickets.length}
							</div>
							<div className='text-gray-600 text-sm'>
								Closed Tickets
							</div>
						</div>
					</div>
				</div>

				{/* Filters and Sort */}
				<div className='bg-white rounded-lg shadow-sm p-6 border'>
					<div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
						{/* Status filters */}
						<div className='flex flex-wrap gap-2'>
							<span className='text-sm font-medium text-gray-700 mr-2 self-center'>
								Filter:
							</span>
							<button
								onClick={() => handleFilterChange('all')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'all'
										? 'bg-blue-600 text-white shadow-md'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								All ({tickets.length})
							</button>
							<button
								onClick={() => handleFilterChange('open')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'open'
										? 'bg-green-600 text-white shadow-md'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Open ({openTickets.length})
							</button>
							<button
								onClick={() => handleFilterChange('assigned')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'assigned'
										? 'bg-yellow-600 text-white shadow-md'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								In Progress ({assignedTickets.length})
							</button>
							<button
								onClick={() => handleFilterChange('closed')}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									statusFilter === 'closed'
										? 'bg-gray-600 text-white shadow-md'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								Closed ({closedTickets.length})
							</button>
						</div>

						{/* Sort options */}
						<div className='flex items-center gap-2'>
							<span className='text-sm font-medium text-gray-700'>
								Sort by:
							</span>
							<select
								value={sortBy}
								onChange={(e) =>
									handleSortChange(
										e.target.value as SortOption
									)
								}
								className='px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value='newest'>Newest First</option>
								<option value='oldest'>Oldest First</option>
								<option value='open'>Open First</option>
								<option value='closed'>Closed First</option>
							</select>
						</div>
					</div>

					{/* Results summary */}
					<div className='mt-4 pt-4 border-t border-gray-200'>
						<p className='text-sm text-gray-600'>
							Showing{' '}
							<span className='font-medium'>
								{filteredTickets.length}
							</span>{' '}
							of{' '}
							<span className='font-medium'>
								{tickets.length}
							</span>{' '}
							tickets
							{statusFilter !== 'all' && (
								<span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
									{statusFilter.charAt(0).toUpperCase() +
										statusFilter.slice(1)}{' '}
									Only
								</span>
							)}
						</p>
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className='flex justify-center py-12'>
						<div className='flex items-center space-x-2'>
							<div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
							<span className='text-gray-600'>
								Loading your tickets...
							</span>
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
						<div className='flex items-center'>
							<div className='text-red-600 mr-2'>⚠️</div>
							<div className='text-red-800 font-medium'>
								{error}
							</div>
						</div>
					</div>
				)}

				{/* Tickets List */}
				{!isLoading && !error && (
					<div className='space-y-4'>
						{sorted.length > 0 ? (
							sorted.map((ticket) => (
								<UserTicket
									key={ticket.id}
									ticket={ticket}
									onTicketUpdate={handleTicketUpdate}
								/>
							))
						) : (
							<div className='bg-white rounded-lg border border-gray-200 p-12 text-center'>
								<div className='text-gray-400 mb-4'>
									<svg
										className='mx-auto h-12 w-12'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1}
											d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
										/>
									</svg>
								</div>
								<h3 className='text-lg font-medium text-gray-900 mb-2'>
									{statusFilter === 'all' &&
									tickets.length === 0
										? 'No tickets yet'
										: `No ${statusFilter} tickets`}
								</h3>
								<p className='text-gray-500 mb-4'>
									{statusFilter === 'all' &&
									tickets.length === 0
										? "You haven't created any tickets yet. Get started by creating your first support ticket!"
										: `You don't have any ${statusFilter} tickets at the moment.`}
								</p>
								{statusFilter === 'all' &&
									tickets.length === 0 && (
										<button
											onClick={() =>
												navigate('/main/tickets/new')
											}
											className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium'
										>
											Create Your First Ticket
										</button>
									)}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default UserTicketsPage;
