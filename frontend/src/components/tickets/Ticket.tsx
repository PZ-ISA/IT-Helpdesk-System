import type { Ticket as TicketType } from '../../types/types';

interface TicketProps {
	ticket: TicketType;
}

const Ticket = ({ ticket }: TicketProps) => {
	return (
		<div className='bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500 hover:shadow-lg transition'>
			<div className='flex justify-between items-start'>
				<h3 className='text-xl font-semibold text-gray-800'>
					{ticket.title}
				</h3>
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${
						ticket.status === 'Open'
							? 'bg-green-100 text-green-800'
							: 'bg-gray-100 text-gray-800'
					}`}
				>
					{ticket.status}
				</span>
			</div>

			<p className='mt-2 text-gray-600'>{ticket.description}</p>

			<div className='mt-4 flex items-center text-sm text-gray-500'>
				<span>
					Created: {new Date(ticket.createdAt).toLocaleDateString()}
				</span>
			</div>
		</div>
	);
};

export default Ticket;
