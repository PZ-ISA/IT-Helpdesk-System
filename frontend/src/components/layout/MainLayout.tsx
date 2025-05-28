import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const MainLayout = () => {
	return (
		<div className='flex min-h-screen'>
			<NavBar />
			<main className='ml-64 flex-1 p-8 bg-gray-50 min-h-screen'>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
