import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

type User = {
	id: string;
	name: string;
	surname: string;
	email: string;
	role: string;
	isActive: boolean;
};

const UsersPage = () => {
	const [users, setUsers] = useState<User[]>([]);
	const { jwtToken } = useAuth();

	useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/users?pageNumber=1&pageSize=25`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setUsers(response.data.items); // <--- KLUCZOWA ZMIANA
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        if (jwtToken) {
            fetchUsers();
        }
    }, [jwtToken]);


	const handleVerify = async (userId: string) => {
		try {
			await axios.patch(
				`${API_URL}/admin/users/${userId}`,
				{ isActive: true },
				{
					headers: {
						Authorization: `Bearer ${jwtToken}`,
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			// Lokalna aktualizacja stanu
			setUsers((prev) =>
				prev.map((user) =>
					user.id === userId ? { ...user, isActive: true } : user
				)
			);
		} catch (error) {
			console.error('Failed to verify user:', error);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-bg bg-white p-8 rounded-xl shadow-sm'>
				<h1 className='text-3xl font-bold text-center mb-2'>USERS</h1>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Weryfikacja</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Surname</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Role</TableCell>
								<TableCell>Active</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<Button
											variant='contained'
											color='primary'
											disabled={user.isActive}
											onClick={() => handleVerify(user.id)}
										>
											Weryfikuj
										</Button>
									</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.surname}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell>
										{user.isActive ? 'Yes' : 'No'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</div>
	);
};

export default UsersPage;
