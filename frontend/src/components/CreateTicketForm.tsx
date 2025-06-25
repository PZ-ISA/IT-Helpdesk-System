// src/components/CreateTicketForm.tsx
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

const CreateTicketForm = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { jwtToken, role } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			setIsLoading(true);
			await axios.post(
				`${API_URL}/api/tickets`,
				{ title, description },
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwtToken}`,
					},
					withCredentials: true,
				}
			);

			// Navigate based on user role
			if (role === 'Admin') {
				navigate('/main/tickets');
			} else {
				navigate('/main/userTickets');
			}
		} catch (err) {
			console.error(err);
			setError('Failed to create ticket');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6'>
			<h2 className='text-2xl font-bold text-gray-800'>
				Create New Ticket
			</h2>

			{error && (
				<div className='bg-red-100 text-red-700 p-3 rounded'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block mb-1 text-gray-700 font-medium'>
						Title
					</label>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
						className='w-full p-3 border rounded-md'
						placeholder='Enter ticket title'
					/>
				</div>

				<div>
					<label className='block mb-1 text-gray-700 font-medium'>
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
						className='w-full p-3 border rounded-md'
						rows={4}
						placeholder='Describe the issue...'
					/>
				</div>

				<button
					type='submit'
					disabled={isLoading}
					className={`w-full py-2 px-4 rounded text-white ${
						isLoading
							? 'bg-gray-400'
							: 'bg-blue-600 hover:bg-blue-700'
					} transition-colors`}
				>
					{isLoading ? 'Creating...' : 'Create Ticket'}
				</button>
			</form>
		</div>
	);
};

export default CreateTicketForm;
