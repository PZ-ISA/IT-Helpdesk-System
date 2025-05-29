export type Ticket = {
	id: string;
	title: string;
	description: string;
	status: 'Open' | 'Closed';
	createdAt: string;
	employeeId?: string;
	adminId?: string;
};
