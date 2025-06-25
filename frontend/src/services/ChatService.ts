// src/services/ChatService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Type Definitions ---

// Podstawowy typ sesji czatu
export type ChatSession = {
	sessionId: string;
	title: string;
	createdAt: string;
	endedAt: string | null;
	feedback?: number | string | null;
};

export type UpdateSessionData = {
	title?: string;
};

// Podstawowy typ wiadomości czatu
// Dostosowano do schematu tabeli bazy danych chatbotmessages
export type ChatMessage = {
	id: string; // Z mapowania Id z bazy danych, jest wymagane
	message: string;
	isUserMessage: boolean; // Nowa właściwość
	sessionId: string; // Z mapowania chatbotsessionid, jest wymagane
	createdAt: string; // Z mapowania created at
	updatedAt: string; // Nowa właściwość z mapowania updatedat
	// Usunięto 'sender' na rzecz 'isUserMessage' dla jasności
};

// Struktura danych żądania wysyłania wiadomości (także dla initialMessage w sesji)
export type SendMessageData = {
	message: string;
	date: string;
};

// Typ odpowiedzi paginacji dla sesji czatu (przeniesiony z ChatHistoryPage, aby był globalnie dostępny)
export type PaginatedChatSessionsResponse = {
	items: ChatSession[];
	totalCount: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number; // Dodano, aby być zgodnym z odpowiedzią backendu
	totalItemsCount: number; // Dodano, aby być zgodnym z odpowiedzią backendu
	// Dodaj inne właściwości paginacji, jeśli istnieją
};

// --- NOWY TYP: Odpowiedź paginacji dla wiadomości czatu ---
export type PaginatedChatMessagesResponse = {
	items: ChatMessage[];
	totalCount: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalItemsCount: number;
	// Dodaj inne właściwości paginacji, jeśli istnieją
};

const ChatService = {
	/**
	 * Tworzy nową sesję czatbota z opcjonalną wiadomością początkową.
	 * Endpoint: POST /api/chatbot-sessions
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @param initialMessageData Opcjonalna początkowa wiadomość do wysłania przy tworzeniu sesji.
	 * @returns Obietnica, która rozwiązuje się w nowo utworzoną ChatSession.
	 */
	createChatbotSession: async (
		jwtToken: string,
		initialMessageData?: SendMessageData
	): Promise<ChatSession> => {
		const response = await axios.post<ChatSession>(
			`${API_URL}/chatbot-sessions`,
			initialMessageData || {},
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	/**
	 * Pobiera wszystkie sesje czatbota dla bieżącego użytkownika z paginacją.
	 * Endpoint: GET /api/chatbot-sessions
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @param pageNumber Numer strony do pobrania (domyślnie 1).
	 * @param pageSize Rozmiar strony (liczba elementów na stronę, domyślnie 50).
	 * @returns Obietnica, która rozwiązuje się w PaginatedChatSessionsResponse.
	 */
	getChatbotSessions: async (
		jwtToken: string,
		pageNumber: number = 1,
		pageSize: number = 50
	): Promise<PaginatedChatSessionsResponse> => {
		const response = await axios.get<PaginatedChatSessionsResponse>(
			`${API_URL}/chatbot-sessions?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	/**
	 * Wysyła wiadomość w ramach określonej sesji czatbota.
	 * Endpoint: POST /api/chatbot-sessions/{id}/messages
	 * @param sessionId ID sesji czatu.
	 * @param messageData Treść wiadomości do wysłania.
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @returns Obietnica, która rozwiązuje się w nowo utworzoną ChatMessage (odpowiedź bota).
	 */
	sendMessage: async (
		sessionId: string,
		messageData: SendMessageData,
		jwtToken: string
	): Promise<ChatMessage> => {
		const response = await axios.post<ChatMessage>(
			`${API_URL}/chatbot-sessions/${sessionId}/messages`,
			messageData,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	/**
	 * Pobiera wszystkie wiadomości dla określonej sesji czatbota z paginacją.
	 * Endpoint: GET /api/chatbot-sessions/{id}/messages
	 * @param sessionId ID sesji czatu.
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @param pageNumber Numer strony do pobrania (domyślnie 1).
	 * @param pageSize Rozmiar strony (liczba elementów na stronę, domyślnie 50).
	 * @returns Obietnica, która rozwiązuje się w PaginatedChatMessagesResponse.
	 */
	getChatbotSessionMessages: async (
		sessionId: string,
		jwtToken: string,
		pageNumber: number = 1,
		pageSize: number = 50
	): Promise<PaginatedChatMessagesResponse> => {
		const response = await axios.get<PaginatedChatMessagesResponse>(
			`${API_URL}/chatbot-sessions/${sessionId}/messages?pageNumber=${pageNumber}&pageSize=${pageSize}`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	/**
	 * Aktualizuje istniejącą sesję czatbota.
	 * Endpoint: PATCH /api/chatbot-sessions/{id}
	 * @param sessionId ID sesji czatu do zaktualizowania.
	 * @param data Dane do zaktualizowania (np. { title: "Nowy Tytuł" }).
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @returns Obietnica, która rozwiązuje się w zaktualizowaną ChatSession.
	 */
	updateChatbotSession: async (
		sessionId: string,
		data: UpdateSessionData,
		jwtToken: string
	): Promise<ChatSession> => {
		const response = await axios.patch<ChatSession>(
			`${API_URL}/chatbot-sessions/${sessionId}/title`,
			data,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	/**
	 * Kończy określoną sesję czatbota.
	 * Endpoint: POST /api/chatbot-sessions/{id}/end
	 * @param sessionId ID sesji czatu do zakończenia.
	 * @param jwtToken Token JWT do uwierzytelnienia.
	 * @returns Obietnica, która rozwiązuje się w zaktualizowaną ChatSession (ze znacznikiem czasu endedAt).
	 */
	endChatbotSession: async (
		sessionId: string,
		jwtToken: string,
		feedback?: number
	): Promise<ChatSession> => {
		const response = await axios.post<ChatSession>(
			`${API_URL}/chatbot-sessions/${sessionId}/end`,
			{ feedback },
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
		return response.data;
	},
};

export default ChatService;
