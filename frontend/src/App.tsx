import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import ChatbotPage from './pages/ChatbotPage'; // Your individual chat session component
import TicketsPage from './pages/TicketsPage';
import CreateTicketForm from './components/CreateTicketForm';
import ChatHistoryPage from './pages/ChatHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import UserTicketsPage from './pages/UsersTicketsPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route path='login' element={<AuthPage />} />
				<Route element={<PrivateRoute />}>
					<Route path='/main' element={<MainLayout />}>
						<Route path='profile' element={<ProfilePage />} />
						<Route path='users' element={<UsersPage />} />
						<Route
							path='notifications'
							element={<NotificationsPage />}
						/>
						<Route
							path='userTickets'
							element={<UserTicketsPage />}
						/>
						<Route
							path='userProfile'
							element={<UserProfilePage />}
						/>
						<Route
							path='chat-history'
							element={<ChatHistoryPage />}
						/>
						<Route
							path='chat/:sessionId?'
							element={<ChatbotPage />}
						/>
						<Route path='tickets' element={<TicketsPage />} />
						<Route
							path='tickets/new'
							element={<CreateTicketForm />}
						/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
