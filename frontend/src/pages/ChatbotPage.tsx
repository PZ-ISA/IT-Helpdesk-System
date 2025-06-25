import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatService, {
	type ChatMessage,
	type ChatSession,
	type SendMessageData,
	type PaginatedChatMessagesResponse,
} from '../services/ChatService';
import { v4 as uuidv4 } from 'uuid';

type DisplayMessage = ChatMessage & {
	tempId?: string;
};

const ChatPage = () => {
	const { jwtToken } = useAuth();
	const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();

	const [messages, setMessages] = useState<DisplayMessage[]>([]);
	const [newMessageText, setNewMessageText] = useState('');
	const [currentSession, setCurrentSession] = useState<ChatSession | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [chatTitle, setChatTitle] = useState('Support Chat');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const formatMessageTime = (dateString: string) => {
		try {
			const normalizedDate = dateString.replace(
				/(\.\d{3})\d+([+-]\d{2}:\d{2})?$/,
				'$1$2'
			);
			const date = new Date(normalizedDate);

			if (isNaN(date.getTime())) {
				console.warn('Invalid date:', dateString);
				return '--:--';
			}

			return date.toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		} catch (e) {
			console.error('Date formatting error:', e);
			return '--:--';
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		const initializeChat = async () => {
			if (!jwtToken) {
				setError('JWT token is required to initialize chat.');
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);
			setMessages([]);

			let sessionToLoad: ChatSession | null = null;

			try {
				if (routeSessionId) {
					const allSessionsResponse =
						await ChatService.getChatbotSessions(jwtToken);
					sessionToLoad =
						allSessionsResponse.items.find(
							(s) => s.id === routeSessionId
						) || null;

					if (!sessionToLoad) {
						setError(
							"Specified chat session was not found or you don't have access."
						);
						setIsLoading(false);
						return;
					}
				} else {
					const allSessionsResponse =
						await ChatService.getChatbotSessions(jwtToken);
					const sessions = allSessionsResponse.items;

					sessionToLoad =
						sessions.find((s) => s.endedAt === null) || null;

					if (!sessionToLoad && sessions.length > 0) {
						sessionToLoad = sessions[sessions.length - 1];
					}

					if (!sessionToLoad) {
						const initialUserMessageData: SendMessageData = {
							message: 'Zaczynamy rozmowe',
							date: new Date().toISOString(),
						};
						sessionToLoad = await ChatService.createChatbotSession(
							jwtToken,
							initialUserMessageData
						);
					}
				}

				if (!sessionToLoad) {
					setError('Could not initialize or find chat session.');
					setIsLoading(false);
					return;
				}

				setCurrentSession(sessionToLoad);
				setChatTitle(sessionToLoad.title || 'Support Chat');

				const messagesResponse: PaginatedChatMessagesResponse =
					await ChatService.getChatbotSessionMessages(
						sessionToLoad.id,
						jwtToken
					);

				const sortedMessages = messagesResponse.items.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
				);
				setMessages(sortedMessages);
			} catch (err: any) {
				console.error('Chat initialization error:', err);
				setError(
					err.response?.data?.message ||
						'Failed to initialize chat. Please try again later.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		initializeChat();
	}, [jwtToken, routeSessionId]);

	const updateChatTitleOnBackend = async (newTitle: string) => {
		// 1. Upewnij się, że masz token i bieżącą sesję
		if (!jwtToken || !currentSession) {
			console.warn(
				'Cannot update chat title: Missing JWT token or current session.'
			);
			setError('Błąd: Nie można zaktualizować tytułu czatu.');
			return;
		}

		// 2. Optymalizacja: Nie wysyłaj żądania, jeśli tytuł się nie zmienił
		if (newTitle === currentSession.title) {
			console.log('Title not changed, skipping backend update.');
			return;
		}

		// 3. Zapisz stary tytuł na wypadek błędu
		const originalTitle = currentSession.title;
		// Optymistycznie zaktualizuj tytuł w stanie
		setChatTitle(newTitle); // Aktualizujemy pole inputa
		// WAŻNA ZMIANA: Zaktualizuj currentSession LOKALNIE
		setCurrentSession((prevSession) => {
			if (prevSession) {
				return { ...prevSession, title: newTitle };
			}
			return null;
		});

		try {
			// 4. Wyślij żądanie do backendu
			// Ponieważ backend nic nie zwraca, nie oczekujemy tu obiektu do aktualizacji stanu.
			// Ważne, żeby to zapytanie i tak było wykonane, żeby tytuł ZAPISAŁ się w bazie danych.
			await ChatService.updateChatbotSession(
				currentSession.id, // Sesja ID, która na pewno istnieje w currentSession
				{ title: newTitle }, // Wysyłamy tylko tytuł
				jwtToken
			);

			// Jeśli zapytanie się powiedzie, stan już został zaktualizowany optymistycznie
			console.log(
				'Chat title successfully updated locally and sent to backend:',
				newTitle
			);
			setError(null); // Czyścimy błędy
		} catch (err: any) {
			console.error('Failed to update chat title on backend:', err);
			setError(
				err.response?.data?.message ||
					'Nie udało się zapisać tytułu czatu. Spróbuj ponownie.'
			);
			// 5. W przypadku błędu, przywróć oryginalny tytuł
			setChatTitle(originalTitle);
			setCurrentSession((prevSession) => {
				if (prevSession) {
					return { ...prevSession, title: originalTitle };
				}
				return null;
			});
		}
	};

	// ... (reszta funkcji handleSendMessage, handleKeyPress, etc. pozostaje bez zmian)

	const handleSendMessage = async () => {
		if (newMessageText.trim() === '' || !currentSession || !jwtToken)
			return;

		const userMessage: DisplayMessage = {
			id: uuidv4(),
			tempId: uuidv4(),
			sessionId: currentSession.id,
			message: newMessageText,
			isUserMessage: true,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setNewMessageText('');

		try {
			const messageData: SendMessageData = {
				message: userMessage.message,
				date: userMessage.createdAt,
			};

			const botResponse = await ChatService.sendMessage(
				currentSession.id,
				messageData,
				jwtToken
			);

			const finalBotResponse: ChatMessage = {
				...botResponse,
				createdAt: botResponse.createdAt || new Date().toISOString(),
				updatedAt: botResponse.updatedAt || new Date().toISOString(),
			};

			setMessages((prevMessages) => [...prevMessages, finalBotResponse]);
		} catch (err: any) {
			console.error('Error sending message:', err);
			setError(
				err.response?.data?.message ||
					'Failed to send message or receive response.'
			);
			setMessages((prevMessages) =>
				prevMessages.filter((msg) => msg.tempId !== userMessage.tempId)
			);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-full'>
				<div className='animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent'></div>
				<p className='ml-4 text-gray-700'>Ładowanie czatu...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex justify-center items-center h-full text-red-600 p-4'>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className='flex flex-col p-4 bg-gray-50 items-center justify-center w-full h-full'>
			<div className='flex flex-col w-full min-w-7xl h-[90vh] bg-white rounded-lg shadow-md'>
				<div className='border-b p-4'>
					{/* Input for chat title */}
					<input
						type='text'
						value={chatTitle}
						onChange={(e) => setChatTitle(e.target.value)}
						onBlur={(e) => updateChatTitleOnBackend(e.target.value)}
						className='text-xl font-bold w-full p-1 border-b-2 border-transparent focus:border-blue-500 outline-none bg-transparent'
						aria-label='Chat title'
					/>
					{/* Conditional rendering for Session ID and Team Name */}
					{currentSession && (
						<>
							<p className='text-sm text-gray-500'>
								Sesja ID: {currentSession.id}
							</p>
							<p className='text-sm text-gray-500'>
								IT Helpdesk Team
							</p>
						</>
					)}
				</div>

				<div className='flex-1 overflow-y-auto p-4 space-y-4'>
					{messages.map((message) => (
						<div
							key={message.id || message.tempId}
							className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-xs md:max-w-md rounded-lg p-3 ${
									message.isUserMessage
										? 'bg-blue-500 text-white rounded-br-none'
										: 'bg-gray-200 text-gray-800 rounded-bl-none'
								}`}
							>
								<p>{message.message}</p>
								<p
									className={`text-xs mt-1 ${
										message.isUserMessage
											? 'text-blue-100'
											: 'text-gray-500'
									}`}
								>
									{formatMessageTime(message.createdAt)}
								</p>
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				<div className='border-t p-4'>
					<div className='flex gap-2'>
						<input
							type='text'
							value={newMessageText}
							onChange={(e) => setNewMessageText(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder='Type your message...'
							className='flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						/>
						<button
							onClick={handleSendMessage}
							disabled={
								newMessageText.trim() === '' || !currentSession
							}
							className={`px-4 py-2 rounded-lg ${
								newMessageText.trim() === '' || !currentSession
									? 'bg-gray-300 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700 text-white'
							}`}
						>
							Send
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
