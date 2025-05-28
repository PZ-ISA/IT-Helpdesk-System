import { Link } from 'react-router-dom';

const NavBar = () => {
	return (
		<nav className='fixed h-screen w-64 bg-black text-white p-6 flex flex-col'>
			<div className='text-2xl font-bold mb-8'>IT Support</div>

			{/* Navigation Links */}
			<ul className='space-y-2 flex-1'>
				<NavItem to='/main/Profile' label='Profile' />
				<NavItem to='/main/Tickets' label='Tickets' />
				<NavItem to='/main/Chat' label='Chat' />
				<NavItem to='/main/Users' label='Users' />
			</ul>
		</nav>
	);
};

const NavItem = ({ to, label }: { to: string; label: string }) => (
	<li>
		<Link
			to={to}
			className='flex items-center p-3 hover:bg-gray-700 rounded-lg transition'
		>
			<p className='font-bold text-lg'>{label}</p>
		</Link>
	</li>
);

export default NavBar;
