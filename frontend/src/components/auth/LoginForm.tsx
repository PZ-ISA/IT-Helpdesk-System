// components/auth/LoginForm.tsx
import { useState } from 'react';
import { login } from '../../services/AuthService';

const LoginForm = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		// e.preventDefault();
		// try {
		// 	await login(formData);
		// 	alert('Login successful!');
		// } catch (error) {
		// 	alert(error instanceof Error ? error.message : 'Login failed');
		// }
		return;
	};

	return (
		<div className='space-y-4'>
			<p className='text-gray-600'>Sign In to Continue</p>

			<div className='space-y-3'>
				<div>
					<input
						type='email'
						name='email'
						placeholder='Email Address'
						className='w-full p-3 border rounded-lg'
						value={formData.email}
						onChange={handleChange}
					/>
				</div>
				<div>
					<input
						type='password'
						name='password'
						placeholder='Password'
						className='w-full p-3 border rounded-lg'
						value={formData.password}
						onChange={handleChange}
					/>
				</div>
			</div>

			<button className='w-full bg-black text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-900 transition-colors'>
				Login
			</button>
		</div>
	);
};

export default LoginForm;
