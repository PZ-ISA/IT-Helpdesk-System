import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route path='/main' element={<MainLayout />}>
					<Route path='profile' element={<ProfilePage />} />
					<Route path='users' element={<UsersPage />} />
					<Route path='chat' element={<ChatbotPage />} />
				</Route>

			</Routes>
		</BrowserRouter>
	);
}

export default App;
