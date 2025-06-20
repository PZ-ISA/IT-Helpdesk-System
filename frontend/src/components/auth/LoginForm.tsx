// components/auth/LoginForm.tsx
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { login as loginApi } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await loginApi(formData);
			login(data.jwtToken, data.refreshToken);
			navigate('/main');
		} catch (error) {
			console.error(error);
			alert(error instanceof Error ? error.message : 'Login failed');
		}
		return;
	};

	return (
		<div className='space-y-4'>
			<p className='text-gray-600'>Sign in to continue!</p>

			<form onSubmit={handleSubmit} className='space-y-3'>
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
				<button 
					type='submit'
					className='w-full bg-black text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-900 transition-colors'
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
