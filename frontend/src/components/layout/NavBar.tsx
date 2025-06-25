import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
// import { /* Add icon imports here, e.g., from react-icons */ } from 'react-icons/fi'; // Example for icons if you decide to add them

const NavBar = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className='fixed h-screen w-64 bg-gray-800 text-gray-200 p-6 flex flex-col shadow-lg'>
			<div className='text-3xl font-extrabold text-blue-400 mb-10 tracking-wide'>
				IT Support
			</div>

			{/* Navigation Links */}
			<ul className='space-y-3 flex-1'>
				<NavItem to='/main/Profile' label='Profile' />
				<NavItem to='/main/Tickets' label='Tickets' />
				<NavItem to='/main/Users' label='Users' />
				<NavItem to='/main/Chat-history' label='Chat History' />
			</ul>

			<button
				onClick={handleLogout}
				className='mt-8 p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md'
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
			{/* Example for an icon - uncomment and replace with actual icon components if you add a library */}
			{/* {label === 'Profile' && <FiUser className="mr-3 text-xl text-gray-400 group-hover:text-white" />}
            {label === 'Tickets' && <FiTag className="mr-3 text-xl text-gray-400 group-hover:text-white" />}
            {label === 'Users' && <FiUsers className="mr-3 text-xl text-gray-400 group-hover:text-white" />}
            {label === 'Chat History' && <FiMessageSquare className="mr-3 text-xl text-gray-400 group-hover:text-white" />} */}
			<p className='font-medium text-lg'>{label}</p>
		</Link>
	</li>
);

export default NavBar;
