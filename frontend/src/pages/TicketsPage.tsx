import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Ticket from '../components/tickets/Ticket';
import type { Ticket as TicketType } from '../types/types';
import TicketService from '../services/TicketService'; // Ensure this import is correct

// Typ dla filtra statusu
type StatusFilter = 'all' | 'open' | 'assigned' | 'closed';
type SortOption = 'newest' | 'oldest' | 'open' | 'closed';

const TicketsPage = () => {
	const { jwtToken, role, logout } = useAuth();
	const navigate = useNavigate();

	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([]);
	const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const handleTicketUpdate = useCallback((updatedTicket: TicketType) => {
		setTickets((prevTickets) =>
			prevTickets.map((t) =>
				t.id === updatedTicket.id ? updatedTicket : t
			)
		);
	}, []);

	// Funkcja do filtrowania ticketów na podstawie statusu
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

	// Aktualizuj przefiltrowane tickety gdy zmieni się filtr lub tickety
	useEffect(() => {
		setFilteredTickets(filterTickets(tickets, statusFilter));
	}, [tickets, statusFilter, filterTickets]);

	useEffect(() => {
		// Debugging logs (you can remove these once it's working)
		console.log('TicketsPage useEffect triggered.');
		console.log('Current jwtToken state:', jwtToken ? 'Present' : 'NULL');
		console.log('Current role state:', role);

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
				setIsLoading(false);
			}
		};

		fetchTickets();
	}, [jwtToken, role, navigate, logout]);

	// Sortowanie przefiltrowanych ticketów
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

	// Funkcja do obsługi zmiany filtra
	const handleFilterChange = (filter: StatusFilter) => {
		setStatusFilter(filter);
	};

	// Funkcja do mapowania statusu na tekst
	const getStatusText = (status: number): string => {
		switch (status) {
			case 0:
				return 'Open';
			case 1:
				return 'Assigned';
			case 2:
				return 'Closed';
			default:
				return 'Unknown';
		}
	};

	// Policz tickety dla każdego statusu
	const openTickets = tickets.filter((ticket) => ticket.status === 0);
	const assignedTickets = tickets.filter((ticket) => ticket.status === 1);
	const closedTickets = tickets.filter((ticket) => ticket.status === 2);

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
				<h1 className='text-2xl font-bold'>Tickets</h1>
			</div>

			{/* Filtry statusu */}
			<div className='bg-white rounded-lg shadow-sm p-4 border'>
				<div className='flex flex-wrap gap-2 mb-4'>
					<button
						onClick={() => handleFilterChange('all')}
						className={`px-4 py-2 rounded-lg font-medium transition ${
							statusFilter === 'all'
								? 'bg-blue-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						All ({tickets.length})
					</button>
					<button
						onClick={() => handleFilterChange('open')}
						className={`px-4 py-2 rounded-lg font-medium transition ${
							statusFilter === 'open'
								? 'bg-green-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Open ({openTickets.length})
					</button>
					<button
						onClick={() => handleFilterChange('assigned')}
						className={`px-4 py-2 rounded-lg font-medium transition ${
							statusFilter === 'assigned'
								? 'bg-yellow-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Assigned ({assignedTickets.length})
					</button>
					<button
						onClick={() => handleFilterChange('closed')}
						className={`px-4 py-2 rounded-lg font-medium transition ${
							statusFilter === 'closed'
								? 'bg-gray-600 text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
					>
						Closed ({closedTickets.length})
					</button>
				</div>

				{/* Aktualnie wyświetlany filtr */}
				<p className='text-sm text-gray-600'>
					Showing: {filteredTickets.length} of {tickets.length}{' '}
					tickets
					{statusFilter !== 'all' && (
						<span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs'>
							Filter:{' '}
							{statusFilter.charAt(0).toUpperCase() +
								statusFilter.slice(1)}
						</span>
					)}
				</p>
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
							{statusFilter === 'all'
								? 'No tickets found.'
								: `No ${statusFilter} tickets found.`}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TicketsPage;
