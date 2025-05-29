import { useState, useRef, useEffect } from 'react';

type Message = {
	id: string;
	text: string;
	sender: 'user' | 'support';
	timestamp: Date;
};

const ChatPage = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: 'Hello! How can I help you today?',
			sender: 'support',
			timestamp: new Date(Date.now() - 3600000),
		},
		{
			id: '2',
			text: "I'm having trouble with my printer",
			sender: 'user',
			timestamp: new Date(Date.now() - 1800000),
		},
	]);
	const [newMessage, setNewMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleSendMessage = () => {
		if (newMessage.trim() === '') return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: newMessage,
			sender: 'user',
			timestamp: new Date(),
		};

		setMessages([...messages, userMessage]);
		setNewMessage('');

		setTimeout(() => {
			const supportMessage: Message = {
				id: Date.now().toString(),
				text: "Thanks for your message. We'll look into your printer issue.",
				sender: 'support',
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, supportMessage]);
		});
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className='flex flex-col h-full'>
			<div className='border-b p-4'>
				<h1 className='text-xl font-bold'>Support Chat</h1>
				<p className='text-sm text-gray-500'>IT Helpdesk Team</p>
			</div>

			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
					>
						<div
							className={`max-w-xs md:max-w-md rounded-lg p-3 ${
								message.sender === 'user'
									? 'bg-blue-500 text-white rounded-br-none'
									: 'bg-gray-200 text-gray-800 rounded-bl-none'
							}`}
						>
							<p>{message.text}</p>
							<p
								className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
							>
								{message.timestamp.toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className='border-t p-4'>
				<div className='flex gap-2'>
					<input
						type='text'
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder='Type your message...'
						className='flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
					<button
						onClick={handleSendMessage}
						disabled={newMessage.trim() === ''}
						className={`px-4 py-2 rounded-lg ${
							newMessage.trim() === ''
								? 'bg-gray-300 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-700 text-white'
						}`}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
