// src/pages/ChatHistoryPage.tsx
import React, { useEffect, useState, useCallback } from 'react'; // Dodajemy useCallback
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatService, {
	type ChatSession,
	type SendMessageData,
} from '../services/ChatService';

// Typ odpowiedzi paginacji, jeśli backend zwraca obiekt zamiast samej tablicy
type PaginatedChatSessionsResponse = {
	items: ChatSession[];
	totalCount: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalItemsCount: number;
};

const ChatHistoryPage = () => {
	const { jwtToken } = useAuth();
	const navigate = useNavigate();

	const [sessions, setSessions] = useState<ChatSession[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isClosingSession, setIsClosingSession] = useState<string | null>(
		null
	);

	// Initial message to send when creating a new session
	const initialNewSessionMessage: SendMessageData = {
		message: 'Zaczynamy rozmowe',
		date: new Date().toISOString(),
	};

	// Funkcja do pobierania sesji - wydzielona dla lepszej reużywalności
	// Używamy useCallback, aby zapewnić stabilność funkcji i uniknąć problemów z useEffect
	const fetchSessions = useCallback(async () => {
		if (!jwtToken) {
			setError('Token JWT jest wymagany do pobrania historii czatów.');
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const responseData: PaginatedChatSessionsResponse =
				await ChatService.getChatbotSessions(jwtToken);

			if (responseData && Array.isArray(responseData.items)) {
				const sortedSessions = responseData.items.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
				);
				setSessions(sortedSessions);
			} else {
				setError(
					'Otrzymano nieoczekiwaną strukturę danych sesji czatu z serwera.'
				);
				console.error('Otrzymana struktura:', responseData);
				setSessions([]);
			}
		} catch (err: any) {
			console.error('Błąd pobierania sesji czatu:', err);
			setError(
				err.response?.data?.message ||
					'Nie udało się pobrać historii czatów.'
			);
		} finally {
			setIsLoading(false);
		}
	}, [jwtToken]); // fetchSessions zależy od jwtToken

	useEffect(() => {
		fetchSessions();
	}, [fetchSessions]); // Teraz fetchSessions jest zależnością useEffect

	const handleStartNewChat = async () => {
		if (!jwtToken) {
			alert('Musisz być zalogowany, aby rozpocząć nowy czat.');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			await ChatService.createChatbotSession(
				jwtToken,
				initialNewSessionMessage
			);

			// Odśwież sesje przed nawigacją
			await ChatService.getChatbotSessions(jwtToken)
				.then((res) => {
					const sortedSessions = res.items.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
					);
					setSessions(sortedSessions);
				})
				.catch((err) =>
					console.error(
						'Failed to refresh sessions after creating new one:',
						err
					)
				);
		} catch (err: any) {
			console.error('Błąd tworzenia nowej sesji czatu:', err);
			setError(
				err.response?.data?.message ||
					'Nie udało się rozpocząć nowego czatu.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChat = (sessionId: string, isDisabled: boolean) => {
		// Jeśli sesja jest zablokowana (disabled), nie nawiguj
		if (isDisabled) {
			return;
		}
		navigate(`/main/chat/${sessionId}`);
	};

	const handleCloseChatClick = async (
		e: React.MouseEvent,
		session: ChatSession
	) => {
		e.stopPropagation(); // Zapobiega otwieraniu czatu, gdy kliknięto przycisk "Zamknij"

		if (!jwtToken) return;

		setIsClosingSession(session.id); // Ustawienie, która sesja jest zamykana

		try {
			const feedbackScore = 1; // Tutaj możesz pobrać wartość od użytkownika

			await ChatService.endChatbotSession(
				session.id,
				jwtToken,
				feedbackScore
			);

			// Po pomyślnym zakończeniu sesji, ponownie pobierz sesje, aby odzwierciedlić zmianę statusu
			await fetchSessions();
		} catch (err: any) {
			console.error('Błąd zamykania czatu:', err);
			setError(
				err.response?.data?.message ||
					'Nie udało się zamknąć czatu. Spróbuj ponownie.'
			);
		} finally {
			setIsClosingSession(null); // Zresetowanie stanu zamykania
		}
	};

	const getSessionStatus = (session: ChatSession) => {
		return session.feedback === 1 ? 'Zakończona' : 'Aktywna';
	};

	// Funkcja do sprawdzania, czy sesja powinna być wyłączona
	const isSessionDisabled = (session: ChatSession): boolean => {
		// Sesja jest zablokowana, jeśli jest zakończona ORAZ jej feedback wynosi 1
		return session.feedback === 1;
	};

	return (
		<div className='flex flex-col h-full bg-white rounded-lg shadow-md p-4 sm:p-6'>
			<div className='flex justify-between items-center mb-6 border-b pb-4'>
				<h1 className='text-2xl font-bold text-gray-800'>
					Historia Czatów
				</h1>
				<button
					onClick={handleStartNewChat}
					className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md'
					disabled={isLoading}
				>
					{isLoading ? 'Tworzenie...' : '+ Rozpocznij Nowy Czat'}
				</button>
			</div>

			{isLoading && !sessions.length ? (
				<div className='flex justify-center items-center flex-1'>
					<div className='animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent'></div>
					<p className='ml-4 text-gray-700'>
						Ładowanie historii czatów...
					</p>
				</div>
			) : error ? (
				<div className='flex justify-center items-center flex-1 text-red-600 p-4 border border-red-300 bg-red-50 rounded-md'>
					<p>{error}</p>
				</div>
			) : sessions.length === 0 ? (
				<div className='flex justify-center items-center flex-1 text-gray-500 p-4'>
					<p>Brak dostępnych sesji czatu. Rozpocznij nowy czat!</p>
				</div>
			) : (
				<div className='flex-1 overflow-y-auto space-y-3'>
					{sessions.map((session) => {
						const isDisabled = isSessionDisabled(session);
						return (
							<div
								key={session.id}
								className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg shadow-sm transition 
                                    ${
										isDisabled
											? 'bg-gray-50 cursor-not-allowed opacity-70'
											: 'hover:shadow-md cursor-pointer'
									}`}
								onClick={() =>
									handleOpenChat(session.id, isDisabled)
								}
							>
								<div className='flex-1 mb-2 sm:mb-0'>
									<h3 className='text-lg font-semibold text-gray-800'>
										{session.title ||
											`Sesja ${new Date(session.createdAt).toLocaleString()}`}
									</h3>
									<p className='text-sm text-gray-600'>
										Zmieniono:{' '}
										{new Date(
											session.createdAt
										).toLocaleString()}
									</p>
								</div>

								<div className='flex items-center gap-2'>
									<span
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											session.endedAt
												? 'bg-gray-100 text-gray-800'
												: 'bg-green-100 text-green-800'
										}`}
									>
										{getSessionStatus(session)}
									</span>

									{!session.endedAt && (
										<button
											onClick={(e) =>
												handleCloseChatClick(e, session)
											}
											className='px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition'
											disabled={isDisabled === true}
										>
											{isClosingSession === session.id
												? 'Zamykanie...'
												: 'Zamknij'}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ChatHistoryPage;
