export type Ticket = {
	id: string;
	title: string;
	description: string;
	status: number;
	createdAt: string;
	updatedAt: string;
	employeeUserId?: string;
	adminUserId?: string;
};
