// src/components/tickets/Ticket.tsx

import React, { useState } from 'react';
import type { Ticket as TicketType } from '../../types/types';
import TicketService from '../../services/TicketService';
import { useAuth } from '../../context/AuthContext';

interface TicketProps {
	ticket: TicketType;
	onTicketUpdate: (updatedTicket: TicketType) => void;
}

const Ticket = ({ ticket, onTicketUpdate }: TicketProps) => {
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const { jwtToken, role } = useAuth();

	const getStatusText = (status: number) => {
		switch (status) {
			case 0:
				return 'Open';
			case 1:
				return 'In Progress';
			case 2:
				return 'Closed';
			default:
				return 'Unknown';
		}
	};

	const handleAssignClick = async () => {
		if (!jwtToken) {
			alert('You must be logged in to assign tickets.');
			return;
		}
		if (role !== 'Admin') {
			alert('Only Admin users can assign tickets via this action.');
			return;
		}

		try {
			console.log(
				`Attempting to assign ticket ID: ${ticket.id} to current admin.`
			);

			await TicketService.assignTicket(ticket.id, jwtToken);

			const optimisticallyUpdatedTicket: TicketType = {
				...ticket, // Keep all existing properties
				status: 1,
			};

			// Step 3: Call onTicketUpdate with the optimistically updated ticket
			onTicketUpdate(optimisticallyUpdatedTicket);
		} catch (error: any) {
			// If an error occurs (e.g., 403 Forbidden, network error), show error and revert implicitly
			console.error('Failed to assign ticket:', error);
			const errorMessage =
				error.response?.data?.message ||
				'Failed to assign ticket. Please try again.';
			alert(`Error assigning ticket: ${errorMessage}`);
			// In a more complex optimistic UI, you might explicitly revert state here
			// but since the current state wasn't changed yet, this simply prevents the update.
		}
	};

	const handleDetailsClick = () => setIsDetailsModalOpen(true);
	const closeModal = () => setIsDetailsModalOpen(false);

	// Button active only if ticket is 'Open' (status 0) AND a token exists
	// After optimistic update to status 1, this will correctly disable the button.
	const isAssignActive = ticket.status === 0 && !!jwtToken;

	return (
		<div className='bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500 hover:shadow-lg transition'>
			<div className='flex justify-between items-start mb-3'>
				<h3 className='text-xl font-semibold text-gray-800'>
					{ticket.title}
				</h3>
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${
						ticket.status === 2
							? 'bg-green-100 text-green-800'
							: ticket.status === 0
								? 'bg-blue-100 text-blue-800'
								: 'bg-yellow-100 text-yellow-800'
					}`}
				>
					{getStatusText(ticket.status)}
				</span>
			</div>

			<p className='mt-2 text-gray-600 line-clamp-2'>
				{ticket.description}
			</p>

			<div className='mt-4 flex justify-between items-center text-sm text-gray-500'>
				<span>
					Created:{' '}
					{new Date(ticket.createdAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
					})}
				</span>
				<div className='flex space-x-2'>
					<button
						onClick={handleAssignClick}
						disabled={!isAssignActive}
						className={`px-3 py-1 rounded text-white text-sm ${
							isAssignActive
								? 'bg-indigo-600 hover:bg-indigo-700'
								: 'bg-gray-400 cursor-not-allowed'
						} transition`}
					>
						Assign
					</button>
					<button
						onClick={handleDetailsClick}
						className='px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm transition'
					>
						Details
					</button>
				</div>
			</div>

			{/* Details Modal (unchanged) */}
			{isDetailsModalOpen && (
				<div
					className='fixed inset-0 flex items-center justify-center z-50 p-4'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
				>
					<div className='bg-white rounded-lg p-6 shadow-xl max-w-lg w-full'>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-2xl font-bold'>
								{ticket.title}
							</h2>
							<button
								onClick={closeModal}
								className='text-gray-500 hover:text-gray-700 text-3xl leading-none'
							>
								&times;
							</button>
						</div>
						<p className='text-gray-700 whitespace-pre-wrap'>
							{ticket.description}
						</p>
						<div className='mt-6 text-right'>
							<button
								onClick={closeModal}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Ticket;
