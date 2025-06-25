// src/components/tickets/UserTicket.tsx

import React, { useState } from 'react';
import type { Ticket as TicketType } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import UserTicketsService from '../../services/UserTicketsService';
import { useNavigate } from 'react-router-dom';
import ChatService from '../../services/ChatService';

interface UserTicketProps {
	ticket: TicketType;
	onTicketUpdate: (updatedTicket: TicketType) => void;
}

const UserTicket = ({ ticket, onTicketUpdate }: UserTicketProps) => {
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(false);
	const [messagesError, setMessagesError] = useState<string | null>(null);
	const [isStartingChat, setIsStartingChat] = useState(false);
	const { jwtToken } = useAuth();
	const navigate = useNavigate();

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

	const handleMessagesClick = async () => {
		if (!jwtToken) {
			alert('You must be logged in to view messages.');
			return;
		}

		setIsMessagesModalOpen(true);
		setIsLoadingMessages(true);
		setMessagesError(null);

		try {
			console.log(`Fetching messages for ticket ID: ${ticket.id}`);

			// Fetch messages with pagination (default page size 10, page 1)
			const response = await UserTicketsService.getTicketMessages(
				ticket.id.toString(),
				jwtToken,
				10,
				1
			);

			setMessages(response.items || []);
		} catch (error: any) {
			console.error('Failed to fetch messages:', error);
			const errorMessage =
				error.response?.data?.message ||
				'Failed to load messages. Please try again.';
			setMessagesError(errorMessage);
		} finally {
			setIsLoadingMessages(false);
		}
	};

	const handleStartChatWithAI = async () => {
		if (!jwtToken) {
			alert('You must be logged in to start a chat with AI.');
			return;
		}

		setIsStartingChat(true);

		try {
			const initialMessageData = {
				message: `Title: ${ticket.title}\n\nDescription: ${ticket.description}`,
				date: new Date().toISOString(),
			};

			const chatSession = await ChatService.createChatbotSession(
				jwtToken,
				initialMessageData
			);

			// Navigate to the chat session
			navigate(`/main/chat/${chatSession.sessionId}`);
		} catch (error: any) {
			console.error('Failed to start chat with AI:', error);
			alert('Failed to start chat with AI. Please try again.');
		} finally {
			setIsStartingChat(false);
		}
	};

	const handleDetailsClick = () => setIsDetailsModalOpen(true);
	const closeDetailsModal = () => setIsDetailsModalOpen(false);
	const closeMessagesModal = () => {
		setIsMessagesModalOpen(false);
		setMessages([]);
		setMessagesError(null);
	};

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
						onClick={handleStartChatWithAI}
						disabled={!jwtToken || isStartingChat}
						className={`px-3 py-1 rounded text-white text-sm ${
							jwtToken && !isStartingChat
								? 'bg-purple-600 hover:bg-purple-700'
								: 'bg-gray-400 cursor-not-allowed'
						} transition`}
					>
						{isStartingChat ? 'Starting...' : 'Start Chat with AI'}
					</button>
					<button
						onClick={handleMessagesClick}
						disabled={!jwtToken}
						className={`px-3 py-1 rounded text-white text-sm ${
							jwtToken
								? 'bg-green-600 hover:bg-green-700'
								: 'bg-gray-400 cursor-not-allowed'
						} transition`}
					>
						Messages
					</button>
					<button
						onClick={handleDetailsClick}
						className='px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 text-sm transition'
					>
						Details
					</button>
				</div>
			</div>

			{/* Details Modal */}
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
								onClick={closeDetailsModal}
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
								onClick={closeDetailsModal}
								className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Messages Modal */}
			{isMessagesModalOpen && (
				<div
					className='fixed inset-0 flex items-center justify-center z-50 p-4'
					style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
				>
					<div className='bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden'>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-2xl font-bold'>
								Messages - {ticket.title}
							</h2>
							<button
								onClick={closeMessagesModal}
								className='text-gray-500 hover:text-gray-700 text-3xl leading-none'
							>
								&times;
							</button>
						</div>

						<div className='overflow-y-auto max-h-[60vh]'>
							{isLoadingMessages ? (
								<div className='text-center py-8'>
									<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
									<p className='mt-2 text-gray-600'>
										Loading messages...
									</p>
								</div>
							) : messagesError ? (
								<div className='text-center py-8'>
									<p className='text-red-600'>
										{messagesError}
									</p>
									<button
										onClick={handleMessagesClick}
										className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
									>
										Retry
									</button>
								</div>
							) : messages.length === 0 ? (
								<div className='text-center py-8'>
									<p className='text-gray-600'>
										No messages found for this ticket.
									</p>
								</div>
							) : (
								<div className='space-y-4'>
									{messages.map((message, index) => (
										<div
											key={message.id || index}
											className='border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 rounded'
										>
											<div className='flex justify-between items-start mb-2'>
												<span className='font-medium text-gray-800'>
													{message.sender ||
														'Unknown User'}
												</span>
												<span className='text-xs text-gray-500'>
													{message.createdAt
														? new Date(
																message.createdAt
															).toLocaleDateString(
																'en-US',
																{
																	year: 'numeric',
																	month: 'short',
																	day: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																}
															)
														: 'Unknown Date'}
												</span>
											</div>
											<p className='text-gray-700 whitespace-pre-wrap'>
												{message.content ||
													message.message}
											</p>
										</div>
									))}
								</div>
							)}
						</div>

						<div className='mt-6 text-right border-t pt-4'>
							<button
								onClick={closeMessagesModal}
								className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition'
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

export default UserTicket;
