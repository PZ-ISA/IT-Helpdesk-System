import { useState, useEffect } from 'react';
import Ticket from '../components/tickets/Ticket';
import type { Ticket as TicketType } from '../types/types';

type SortOption = 'newest' | 'oldest' | 'open' | 'closed';

const TicketsPage = () => {
	const [tickets, setTickets] = useState<TicketType[]>([]);
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const mockTickets: TicketType[] = [
			{
				id: '1',
				title: 'Printer not working',
				description:
					'The office printer on floor 3 is showing error messages.',
				status: 'Open',
				createdAt: '2023-05-15T10:30:00Z',
			},
			{
				id: '2',
				title: 'Email setup for new employee',
				description: 'Need help setting up email account.',
				status: 'Closed',
				createdAt: '2023-05-10T14:15:00Z',
			},
			{
				id: '3',
				title: 'VPN connection issues',
				description: 'Cannot establish VPN connection remotely.',
				status: 'Open',
				createdAt: '2023-05-12T09:45:00Z',
			},
		];

		setIsLoading(false);
		setTickets(mockTickets);
	}, []);

	const sortedTickets = [...tickets].sort((a, b) => {
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
				return a.status === 'Open' ? -1 : 1;
			case 'closed':
				return a.status === 'Closed' ? -1 : 1;
			default:
				return 0;
		}
	});

	return (
		<div className='space-y-6'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<h1 className='text-2xl font-bold text-gray-800'>Tickets</h1>

				<div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
					<div className='flex items-center gap-2'>
						<label htmlFor='sort' className='text-sm text-gray-600'>
							Sort by:
						</label>
						<select
							id='sort'
							value={sortBy}
							onChange={(e) =>
								setSortBy(e.target.value as SortOption)
							}
							className='px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500'
						>
							<option value='newest'>Newest First</option>
							<option value='oldest'>Oldest First</option>
							<option value='open'>Open Tickets</option>
							<option value='closed'>Closed Tickets</option>
						</select>
					</div>

					<button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm'>
						+ Create New Ticket
					</button>
				</div>
			</div>

			{isLoading ? (
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
				</div>
			) : (
				<div className='grid gap-4'>
					{sortedTickets.length > 0 ? (
						sortedTickets.map((ticket) => (
							<Ticket key={ticket.id} ticket={ticket} />
						))
					) : (
						<div className='bg-white p-6 rounded-lg shadow-md text-center text-gray-500'>
							No tickets found
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TicketsPage;
