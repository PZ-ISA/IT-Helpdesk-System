import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainLayout from './components/layout/MainLayout';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<AuthPage />} />
				<Route path='/main' element={<MainLayout />}>
					{/* Tutaj routy na content na strony */}
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
