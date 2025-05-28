// components/auth/RegisterForm.tsx
import { useState } from 'react';
import { register } from '../../services/AuthService';

const RegisterForm = () => {
	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: '',
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormData({ ...formData, role: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		// e.preventDefault();
		// setError('');

		// if (formData.password !== formData.confirmPassword) {
		// 	setError('Passwords do not match');
		// 	return;
		// }

		// try {
		// 	setIsLoading(true);
		// 	await register(formData);
		// 	alert('Registration successful! Please log in.');
		// } catch (err) {
		// 	setError(
		// 		err instanceof Error ? err.message : 'Registration failed'
		// 	);
		// } finally {
		// 	setIsLoading(false);
		// }
		return;
	};

	return (
		<div className='space-y-4'>
			<p className='text-gray-600'>Sign Up to Get Started</p>

			{error && (
				<div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-3'>
				<div>
					<input
						type='text'
						name='name'
						placeholder='Your Name'
						className='w-full p-3 border rounded-lg'
						value={formData.name}
						onChange={handleChange}
					/>
				</div>
				<div className='space-y-3'>
					<input
						type='text'
						name='surname'
						placeholder='Your Surname'
						className='w-full p-3 border rounded-lg'
						value={formData.surname}
						onChange={handleChange}
					/>
					<div className='space-y-3'>
						<input
							type='email'
							name='email'
							placeholder='Email Address'
							className='w-full p-3 border rounded-lg'
							value={formData.email}
							onChange={handleChange}
						/>
					</div>
					<div className='space-y-3'>
						<select
							name='role'
							className='w-full p-3 border rounded-lg'
							value={formData.role}
							onChange={handleSelectChange}
						>
							<option value=''>Select Role</option>
							<option value='admin'>Admin</option>
							<option value='employee'>Employee</option>
						</select>
					</div>
					<div className='space-y-3'>
						<input
							type='password'
							name='password'
							placeholder='Password'
							className='w-full p-3 border rounded-lg'
							value={formData.password}
							onChange={handleChange}
						/>
					</div>
					<div className='space-y-3'>
						<input
							type='password'
							name='confirmPassword'
							placeholder='Confirm Password'
							className='w-full p-3 border rounded-lg'
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className={`w-full py-2 px-4 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-black hover:bg-gray-900'} transition-colors cursor-pointer`}
					>
						{isLoading ? 'Registering...' : 'Register'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
