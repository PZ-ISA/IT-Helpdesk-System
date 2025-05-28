// pages/AuthPage.tsx
import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
			<div className='w-full max-w-md bg-white p-8 rounded-xl shadow-sm'>
				{/* Logo */}
				<h1 className='text-3xl font-bold text-center mb-2'>
					IT HELP DESK
				</h1>

				{/* Form Toggle */}
				<div className='flex border-b mb-6'>
					<button
						className={`flex-1 py-2 font-medium ${isLogin ? 'border-b-2 border-black' : 'text-gray-500'}`}
						onClick={() => setIsLogin(true)}
					>
						Login
					</button>
					<button
						className={`flex-1 py-2 font-medium ${!isLogin ? 'border-b-2 border-black' : 'text-gray-500'}`}
						onClick={() => setIsLogin(false)}
					>
						Register
					</button>
				</div>

				{/* Active Form */}
				{isLogin ? <LoginForm /> : <RegisterForm />}
			</div>
		</div>
	);
};

export default AuthPage;
