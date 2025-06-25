import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Ticket from '../components/tickets/Ticket';
import type { Ticket as TicketType } from '../types/types';
import TicketService from '../services/TicketService'; // Ensure this import is correct

const TicketsPage = () => {
	const { jwtToken, role, logout } = useAuth(); // Keep 'role' for potential UI logic or future checks
	const navigate = useNavigate();

	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [sortBy, setSortBy] = useState<
		'newest' | 'oldest' | 'open' | 'closed'
	>('newest');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	type SortOption = 'newest' | 'oldest' | 'open' | 'closed';

	const handleTicketUpdate = useCallback((updatedTicket: TicketType) => {
		setTickets((prevTickets) =>
			prevTickets.map((t) =>
				t.id === updatedTicket.id ? updatedTicket : t
			)
		);
	}, []);

	useEffect(() => {
		// Debugging logs (you can remove these once it's working)
		console.log('TicketsPage useEffect triggered.');
		console.log('Current jwtToken state:', jwtToken ? 'Present' : 'NULL');
		console.log('Current role state:', role); // Still good to know the current role

		if (!jwtToken) {
			console.log('No JWT token, navigating to /login.');
			navigate('/login');
			setIsLoading(false);
			return;
		}

		// Optional: If this page *absolutely* requires an Admin role, add this check
		if (role !== 'Admin') {
			setError('You must be an Admin to view this page.');
			setIsLoading(false);
			// Optionally redirect non-admins, but be careful not to create a loop
			// navigate('/dashboard'); // Example redirect
			return;
		}

		const fetchTickets = async () => {
			setIsLoading(true);
			setError(null); // Clear previous errors

			try {
				// Call the service method without passing 'role'
				// It will now always fetch from /api/admin/tickets
				console.log(
					`Attempting to fetch tickets from /api/admin/tickets with token.`
				);
				const data = await TicketService.getTickets(jwtToken); // No 'role' needed here
				setTickets(data.items);
				console.log('Successfully fetched tickets data.');
			} catch (err: any) {
				console.error('Failed to fetch tickets:', err);
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
						`Access Forbidden: You do not have admin permissions to view all tickets.`
					);
				} else {
					setError('Failed to load tickets. Please try again later.');
				}
			} finally {
				// Corrected typo: setIsLoadi should be setIsLoading
				setIsLoading(false);
			}
		};

		fetchTickets();
	}, [jwtToken, role, navigate, logout]); // Keep role in dependencies if you use the optional 'Admin' check

	const sorted = [...tickets].sort((a, b) => {
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

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
				<h1 className='text-2xl font-bold'>Tickets</h1>
				<div className='flex items-center gap-3'>
					<label className='text-gray-600'>Sort by:</label>
					<select
						value={sortBy}
						onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
							setSortBy(e.target.value as SortOption)
						}
						className='px-3 py-2 border rounded-md rounded-lg'
					>
						<option value='newest'>Newest</option>
						<option value='oldest'>Oldest</option>
						<option value='open'>Open</option>
						<option value='closed'>Closed</option>
					</select>
					<button
						onClick={() => navigate('/main/tickets/new')}
						className='px-4 py-2 bg-blue-600 text-white rounded-md rounded-lg hover:bg-blue-700 transition'
					>
						+ Create New Ticket
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className='flex justify-center py-10'>
					<div className='animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent'></div>
				</div>
			) : error ? (
				<div className='text-red-600 text-center p-4 border border-red-300 bg-red-50 rounded-md'>
					{error}
				</div>
			) : (
				<div className='grid gap-4'>
					{sorted.length > 0 ? (
						sorted.map((t) => (
							<Ticket
								key={t.id}
								ticket={t}
								onTicketUpdate={handleTicketUpdate}
							/>
						))
					) : (
						<div className='text-gray-500 text-center p-4 border border-gray-300 bg-gray-50 rounded-md'>
							No tickets found.
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TicketsPage;
