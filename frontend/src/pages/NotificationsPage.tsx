import React, { useState, useEffect } from 'react';

interface Notification {
	id: string;
	title: string;
	content: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	seen: boolean;
}

// Global variable to persist data across component re-renders
let globalNotifications: Notification[] | null = null;

const getInitialNotifications = (): Notification[] => {
	if (globalNotifications) {
		return globalNotifications;
	}

	return [
		{
			id: '97c079ed-3a3c-41f3-95d2-08ddb379ded3',
			title: 'Modi autem repellendus dolores ducimus impedit repellat dolores quia voluptatem.',
			content:
				'Aliquid nisi a aut rerum sit hic possimus. Et quas similique adipisci.Corporis quis adipisci officia.Qui est et occaecati..',
			userId: '8e9619c9-918b-41c6-3b37-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7285994 +00:00',
			updatedAt: '2025-06-24 23:50:16.7285994 +00:00',
			seen: false,
		},
		{
			id: '2863dbda-dc15-447c-95d3-08ddb379ded3',
			title: 'Non quas aliquid cum dolorem qui soluta ex vel.',
			content:
				'Hic non qui similique natus temporibus et eum. Quia deserunt hic.',
			userId: '47aace58-7336-4946-3b35-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7286063 +00:00',
			updatedAt: '2025-06-24 23:50:16.7286064 +00:00',
			seen: true,
		},
		{
			id: '8f3ccfeb-6455-48c7-95d4-08ddb379ded3',
			title: 'Autem nihil quo maxime deleniti reiciendis aut et officiis.',
			content:
				'Itaque officia ea.Aut omnis porro ullam.Atque fugiat cum placeat nesciunt..',
			userId: '8e9619c9-918b-41c6-3b37-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7286109 +00:00',
			updatedAt: '2025-06-24 23:50:16.7286109 +00:00',
			seen: true,
		},
		{
			id: '8190d750-3f38-418a-95d6-08ddb379ded3',
			title: 'Laudantium et et est corrupti.',
			content:
				'Rerum et ab molestiae harum et. Et aliquid eaque ut ut quod autem.',
			userId: '3d476ea5-1b82-4402-3b39-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7286109 +00:00',
			updatedAt: '2025-06-24 23:50:16.7286242 +00:00',
			seen: false,
		},
		{
			id: '0c98cee0-a7c2-44a2-95d7-08ddb379ded3',
			title: 'Omnis officia ea cupiditate sit ullam debitis et facilis.',
			content:
				'Consectetur possimus esse alias qui ut quod doloremque aliquid a. Modi aliquam libero quia enim magni..',
			userId: '47aace58-7336-4946-3b35-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7286288 +00:00',
			updatedAt: '2025-06-24 23:50:16.7286288 +00:00',
			seen: false,
		},
		{
			id: 'cbb85ad7-5312-40c6-95da-08ddb379ded3',
			title: 'Ipsum similique dolorum et qui natus omnis.',
			content:
				'Laudantium consequatur non labore.Ex recusandae sitCorporis qui nesciunt ipsam illo natus.Facere occaecati totam.',
			userId: 'ca41e4bc-1a9f-4559-3b42-08ddb379de07',
			createdAt: '2025-06-21 11:20:00.0000000 +00:00',
			updatedAt: '2025-06-21 13:45:00.0000000 +00:00',
			seen: true,
		},
		{
			id: '88f7a5c3-213e-48e5-95d8-08ddb379ded3',
			title: 'Nisi saepe possimus.',
			content:
				'Ex mollitia repellat commodi.Nostrum quo rerum provident vel quae voluptatibus esse.Ut hic nemo.Eos accusamus possimus est dolores ut.Accusantium laudantium similique eum velit.',
			userId: '42227578-7fb0-4aa2-3b33-08ddb379de07',
			createdAt: '2025-06-24 23:50:16.7286338 +00:00',
			updatedAt: '2025-06-24 23:50:16.7286338 +00:00',
			seen: true,
		},
		{
			id: 'h8i9j0k1-l2m3-4567-hijk-890123456789',
			title: 'Unde velit pariatur cupiditate.',
			content:
				'Eum provident in reprehenderit.Nobis voluptatem illum numquam repellat dolorum alias aut eum.Vel recusandae dolorum quod tempore quidem sed..',
			userId: '8e9619c9-918b-41c6-3b37-08ddb379de07',
			createdAt: '2025-06-26 15:45:00.0000000 +00:00',
			updatedAt: '2025-06-26 15:45:00.0000000 +00:00',
			seen: false,
		},
	];
};

const NotificationsPage = () => {
	const [notifications, setNotifications] = useState<Notification[]>(() =>
		getInitialNotifications()
	);
	const [filterSeen, setFilterSeen] = useState<'all' | 'seen' | 'unseen'>(
		'all'
	);

	// Update global variable whenever notifications change
	useEffect(() => {
		globalNotifications = notifications;
	}, [notifications]);

	const markAsSeen = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id
					? {
							...notification,
							seen: true,
							updatedAt: new Date().toISOString(),
						}
					: notification
			)
		);
	};

	const markAsUnseen = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id
					? {
							...notification,
							seen: false,
							updatedAt: new Date().toISOString(),
						}
					: notification
			)
		);
	};

	const markAllAsSeen = () => {
		const now = new Date().toISOString();
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.seen
					? notification
					: { ...notification, seen: true, updatedAt: now }
			)
		);
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	};

	const resetToDefaults = () => {
		globalNotifications = null;
		setNotifications(getInitialNotifications());
	};

	const filteredNotifications = notifications.filter((notification) => {
		if (filterSeen === 'seen') return notification.seen;
		if (filterSeen === 'unseen') return !notification.seen;
		return true;
	});

	const unseenCount = notifications.filter((n) => !n.seen).length;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className='max-w-6xl mx-auto p-6'>
			<div className='mb-6'>
				<div className='flex justify-between items-center mb-4'>
					<h1 className='text-3xl font-bold text-gray-800'>
						Notifications
					</h1>
					<div className='flex items-center gap-3'>
						{unseenCount > 0 && (
							<span className='bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
								{unseenCount} unseen
							</span>
						)}
						{unseenCount > 0 && (
							<button
								onClick={markAllAsSeen}
								className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm'
							>
								Mark All as Seen
							</button>
						)}
						<button
							onClick={resetToDefaults}
							className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm'
						>
							Reset Data
						</button>
					</div>
				</div>

				{/* Filter Buttons */}
				<div className='flex space-x-2 mb-6'>
					{(['all', 'unseen', 'seen'] as const).map((filter) => (
						<button
							key={filter}
							onClick={() => setFilterSeen(filter)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
								filterSeen === filter
									? 'bg-blue-600 text-white'
									: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}
						>
							{filter.charAt(0).toUpperCase() + filter.slice(1)}
							<span className='ml-1 text-xs'>
								(
								{filter === 'all'
									? notifications.length
									: filter === 'unseen'
										? unseenCount
										: notifications.length - unseenCount}
								)
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Notifications List */}
			<div className='space-y-4'>
				{filteredNotifications.length === 0 ? (
					<div className='text-center py-12'>
						<div className='text-gray-400 mb-4'>
							<svg
								className='w-16 h-16 mx-auto'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 17h5l-5 5v-5zM12 17H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V11'
								/>
							</svg>
						</div>
						<p className='text-gray-500 text-lg'>
							No notifications found.
						</p>
					</div>
				) : (
					filteredNotifications.map((notification) => (
						<div
							key={notification.id}
							className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition hover:shadow-lg ${
								!notification.seen
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-300'
							}`}
						>
							<div className='flex justify-between items-start mb-3'>
								<div className='flex-1'>
									<div className='flex items-center gap-3 mb-2'>
										<h3 className='text-lg font-semibold text-gray-800'>
											{notification.title}
										</h3>
										{!notification.seen && (
											<span className='w-2 h-2 bg-blue-500 rounded-full'></span>
										)}
									</div>
									<p className='text-gray-600 mb-4 leading-relaxed'>
										{notification.content}
									</p>

									<div className='flex justify-between items-center text-sm text-gray-500'>
										<div className='flex items-center gap-4'>
											<span>
												Created:{' '}
												{formatDate(
													notification.createdAt
												)}
											</span>
											{notification.createdAt !==
												notification.updatedAt && (
												<span>
													Updated:{' '}
													{formatDate(
														notification.updatedAt
													)}
												</span>
											)}
										</div>
									</div>
								</div>

								<div className='flex items-center gap-2 ml-4'>
									{notification.seen ? (
										<button
											onClick={() =>
												markAsUnseen(notification.id)
											}
											className='px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition'
											title='Mark as unseen'
										>
											Mark Unseen
										</button>
									) : (
										<button
											onClick={() =>
												markAsSeen(notification.id)
											}
											className='px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition'
											title='Mark as seen'
										>
											Mark Seen
										</button>
									)}
									<button
										onClick={() =>
											deleteNotification(notification.id)
										}
										className='px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition'
										title='Delete notification'
									>
										Delete
									</button>
								</div>
							</div>

							<div className='text-xs text-gray-400 mt-2'>
								ID: {notification.id}
							</div>
						</div>
					))
				)}
			</div>

			{/* Summary */}
			{notifications.length > 0 && (
				<div className='mt-8 p-4 bg-gray-50 rounded-lg'>
					<div className='flex justify-between items-center text-sm text-gray-600'>
						<span>Total notifications: {notifications.length}</span>
						<span>
							Unseen: {unseenCount} | Seen:{' '}
							{notifications.length - unseenCount}
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationsPage;
