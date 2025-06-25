// src/services/TicketService.ts

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// --- Type Definitions ---
export type Ticket = {
	id: string;
	title: string;
	description: string;
	status: number; // Updated to number based on your provided type
	createdAt: string;
	updatedAt: string;
	employeeUserId?: string; // Optional, represents the employee who created it
	adminUserId?: string; // Optional, represents the admin assigned to it
};

export type TicketMessage = {
	id: string;
	ticketId: string;
	senderId: string;
	senderName: string;
	message: string;
	createdAt: string;
};

export type SendTicketMessageData = {
	message: string;
};

export type PaginatedTicketsResponse = {
	items: Ticket[];
	totalCount: number;
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalItemsCount: number;
};
// --- END Type Definitions ---

const TicketService = {
	// getTickets should be able to fetch all tickets if no specific filter is needed by backend
	// Assuming backend endpoint /admin/tickets returns all tickets when no params are given
	getTickets: async (jwtToken: string): Promise<PaginatedTicketsResponse> => {
		// Adjust pageNumber and pageSize as needed, or make them parameters if your backend supports pagination
		const url = `${API_URL}/admin/tickets?pageNumber=1&pageSize=50`;

		const response = await axios.get<PaginatedTicketsResponse>(url, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
		return response.data;
	},

	// ... (rest of your TicketService methods: createTicket, updateTicket, deleteTicket, assignTicket, getTicketDetails, sendTicketMessage)
	// Ensure these methods use the updated Ticket type as needed.

	createTicket: async (
		title: string,
		description: string,
		jwtToken: string
	): Promise<Ticket> => {
		const response = await axios.post<Ticket>(
			`${API_URL}/tickets`,
			{ title, description },
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
				withCredentials: true,
			}
		);
		return response.data;
	},

	updateTicket: async (
		ticketId: string,
		title: string,
		description: string,
		status: number, // Use number for status
		jwtToken: string
	): Promise<Ticket> => {
		const response = await axios.put<Ticket>(
			`${API_URL}/tickets/${ticketId}`,
			{ title, description, status },
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	deleteTicket: async (ticketId: string, jwtToken: string): Promise<any> => {
		const response = await axios.delete(`${API_URL}/tickets/${ticketId}`, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
		return response.data;
	},

	assignTicket: async (
		ticketId: string,
		jwtToken: string
	): Promise<Ticket> => {
		const response = await axios.post<Ticket>(
			`${API_URL}/admin/tickets/${ticketId}/assign`,
			{},
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data;
	},

	getTicketDetails: async (
		ticketId: string,
		jwtToken: string
	): Promise<Ticket> => {
		const response = await axios.get<Ticket>(
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

	sendTicketMessage: async (
		ticketId: string,
		messageData: SendTicketMessageData,
		jwtToken: string
	): Promise<TicketMessage> => {
		const response = await axios.post<TicketMessage>(
			`${API_URL}/tickets/${ticketId}/messages`,
			messageData,
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

	closeTicket: async (ticketId: string, jwtToken: string): Promise<void> => {
		await axios.post(
			`${API_URL}/admin/tickets/${ticketId}/close`,
			{},
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			}
		);
	},
};

export default TicketService;
