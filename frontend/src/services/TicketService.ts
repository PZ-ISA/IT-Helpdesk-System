// src/services/TicketService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const TicketService = {
	// getTickets remains the same
	getTickets: async (jwtToken: string) => {
		const url = `${API_URL}/admin/tickets?pageNumber=1&pageSize=50`;
		const response = await axios.get(url, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
		return response.data;
	},

	// createTicket remains the same
	createTicket: async (
		title: string,
		description: string,
		jwtToken: string
	) => {
		const response = await axios.post(
			`${API_URL}/tickets`,
			{ title, description },
			{
				headers: { Authorization: `Bearer ${jwtToken}` },
				withCredentials: true,
			}
		);
		return response.data;
	},

	// updateTicket remains the same
	updateTicket: async (
		ticketId: string,
		title: string,
		description: string,
		status: number,
		jwtToken: string
	) => {
		const response = await axios.put(
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

	// deleteTicket remains the same
	deleteTicket: async (ticketId: string, jwtToken: string) => {
		const response = await axios.delete(`${API_URL}/tickets/${ticketId}`, {
			headers: { Authorization: `Bearer ${jwtToken}` },
			withCredentials: true,
		});
		return response.data;
	},

	// --- NEW: assignTicket method ---
	assignTicket: async (ticketId: string, jwtToken: string) => {
		const response = await axios.post(
			`${API_URL}/admin/tickets/${ticketId}/assign`, // Endpoint for assigning
			{}, // Empty body, as assignment is based on authenticated user
			{
				headers: {
					Authorization: `Bearer ${jwtToken}`,
				},
				withCredentials: true,
			}
		);
		return response.data; // This should return the updated ticket object
	},
};

export default TicketService;
