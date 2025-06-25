// src/services/UserTicketsService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Type Definitions ---
export type UserTicket = {
	id: string;
	title: string;
	description: string;
	status: number;
	createdAt: string;
	updatedAt: string;
	feedback: string | null;
	employeeUserId: string;
	adminUserId: string;
};

export type PaginatedUserTicketsResponse = {
	items: UserTicket[];
	pageSize: number;
	pageNumber: number;
	totalPages: number;
	totalItemsCount: number;
};

export type CreateTicketData = {
	title: string;
	description: string;
};

export type UpdateTicketData = {
	title?: string;
	description?: string;
};
// --- END Type Definitions ---

const UserTicketsService = {
	// Get paginated user tickets
	getUserTickets: async (
		pageSize: number,
		pageNumber: number,
		jwtToken: string
	): Promise<PaginatedUserTicketsResponse> => {
		const url = `${API_URL}/tickets?pageSize=${pageSize}&pageNumber=${pageNumber}`;

		const response = await axios.get<PaginatedUserTicketsResponse>(url, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
		return response.data;
	},

	// Create a new ticket
	createTicket: async (
		ticketData: CreateTicketData,
		jwtToken: string
	): Promise<UserTicket> => {
		const response = await axios.post<UserTicket>(
			`${API_URL}/tickets`,
			ticketData,
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
				withCredentials: true,
			}
		);
		return response.data;
	},

	// Update an existing ticket
	updateTicket: async (
		ticketId: string,
		ticketData: UpdateTicketData,
		jwtToken: string
	): Promise<UserTicket> => {
		const response = await axios.put<UserTicket>(
			`${API_URL}/tickets/${ticketId}`,
			ticketData,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	// Get ticket details by ID
	getTicketDetails: async (
		ticketId: string,
		jwtToken: string
	): Promise<UserTicket> => {
		const response = await axios.get<UserTicket>(
			`${API_URL}/tickets/${ticketId}`,
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	// Delete a ticket
	deleteTicket: async (ticketId: string, jwtToken: string): Promise<void> => {
		await axios.delete(`${API_URL}/tickets/${ticketId}`, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
	},

	postFeedback: async (
		ticketId: string,
		feedback: number,
		jwtToken: string
	): Promise<UserTicket> => {
		const response = await axios.post<UserTicket>(
			`${API_URL}/tickets/${ticketId}/feedback`,
			{ feedback },
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
				withCredentials: true,
			}
		);
		return response.data;
	},

	getTicketMessages: async (
		ticketId: string,
		jwtToken: string,
		pageSize: number,
		pageNumber: number
	) => {
		const response = await axios.get<PaginatedUserTicketsResponse>(
			`${API_URL}/tickets/${ticketId}/messages?pageSize=${pageSize}&pageNumber=${pageNumber}`,
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
				withCredentials: true,
			}
		);
		return response.data;
	},
};

export default UserTicketsService;
