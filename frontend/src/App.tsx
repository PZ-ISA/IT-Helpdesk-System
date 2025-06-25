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

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route element={<PrivateRoute />}>
					<Route path='/main' element={<MainLayout />}>
						<Route path='profile' element={<ProfilePage />} />
						<Route path='users' element={<UsersPage />} />
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
