import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import ChatPage from './pages/ChatbotPage';
import TicketsPage from './pages/TicketsPage';
import CreateTicketForm from './components/CreateTicketForm';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route element={<PrivateRoute />}>
					<Route path='/main' element={<MainLayout />}>
						<Route path='profile' element={<ProfilePage />} />
						<Route path='users' element={<UsersPage />} />
						<Route path='chat' element={<ChatPage />} />
						<Route path='tickets' element={<TicketsPage />} />
						<Route path='tickets/new' element={<CreateTicketForm />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
