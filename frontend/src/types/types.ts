export type Ticket = {
	id: string;
	title: string;
	description: string;
	status: number;
	createdAt: string;
	updatedAt: string;
	employeeId?: string;
	adminId?: string;
};
