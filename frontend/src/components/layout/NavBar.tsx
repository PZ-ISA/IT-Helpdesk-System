import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserService, { type UserProfile } from '../../services/UserService';
// import { /* Add icon imports here, e.g., from react-icons */ } from 'react-icons/fi'; // Example for icons if you decide to add them

const NavBar = () => {
	const navigate = useNavigate();
	const { logout, jwtToken } = useAuth();
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	// Fetch user profile to determine role
	useEffect(() => {
		const fetchUserProfile = async () => {
			if (!jwtToken) {
				setLoading(false);
				return;
			}

			try {
				const profile = await UserService.getCurrentUser(jwtToken);
				setUserProfile(profile);
			} catch (error) {
				console.error('Failed to fetch user profile:', error);
				// If we can't fetch the profile, we'll default to employee view
			} finally {
				setLoading(false);
			}
		};

		fetchUserProfile();
	}, [jwtToken]);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	// Determine if user is admin
	const isAdmin = userProfile?.role?.toLowerCase() === 'admin';

	// Show loading state while fetching user profile
	if (loading) {
		return (
			<nav className='fixed h-screen w-64 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg'>
				<div className='text-3xl font-extrabold text-blue-400 mb-10 tracking-wide'>
					IT Support
				</div>
				<div className='flex-1 flex items-center justify-center'>
					<div className='animate-spin h-8 w-8 border-4 border-blue-400 rounded-full border-t-transparent'></div>
				</div>
			</nav>
		);
	}

	return (
		<nav className='fixed h-screen w-64 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg'>
			<div className='text-3xl font-extrabold text-blue-400 mb-10 tracking-wide'>
				IT Support
			</div>

			{/* Navigation Links */}
			<ul className='space-y-3 flex-1'>
				{isAdmin ? (
					// Admin Navigation
					<>
						<NavItem to='/main/Profile' label='Profile' />
						<NavItem to='/main/Tickets' label='Tickets' />
						<NavItem to='/main/Users' label='Users' />
						<NavItem to='/main/Chat-history' label='Chat History' />
					</>
				) : (
					// Employee Navigation
					<>
						<NavItem to='/main/UserProfile' label='User Profile' />
						<NavItem to='/main/userTickets' label='User Tickets' />
						<NavItem to='/main/Chat-history' label='Chat History' />
						<NavItem
							to='/main/notifications'
							label='Notifications'
						/>
					</>
				)}
			</ul>

			{/* User Role Indicator */}
			{userProfile && (
				<div className='mb-4 p-2 bg-gray-700 rounded-lg text-center'>
					<p className='text-sm text-gray-300'>Logged in as</p>
					<p className='font-semibold text-blue-400 capitalize'>
						{userProfile.role}
					</p>
				</div>
			)}

			<button
				onClick={handleLogout}
				className='mt-4 p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md'
			>
				Logout
			</button>
		</nav>
	);
};

const NavItem = ({ to, label }: { to: string; label: string }) => (
	<li>
		<Link
			to={to}
			className='flex items-center p-3 rounded-lg text-gray-200 hover:bg-blue-600 hover:text-white transition duration-200 ease-in-out group'
		>
			<p className='font-medium text-lg'>{label}</p>
		</Link>
	</li>
);

export default NavBar;
