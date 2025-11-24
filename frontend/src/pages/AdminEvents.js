import React, { useEffect, useState, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { authAPI, eventAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';
import SafeRichText from '../components/SafeRichText';
const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY; // Secure the API key

export default function AdminEvents() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);

	// API base (used for upload/display like AdminMembers.js)
	const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://venturepoint-backend.onrender.com';

	// Validate image helper
	const validateImage = (file) => {
		// Check file size (10 MB limit)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return 'Image size exceeds 10 MB. Please upload a smaller image.';
		}
		
		// Check file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedTypes.includes(file.type)) {
			return 'Invalid file type. Please upload a valid image (JPEG, PNG, GIF, or WebP).';
		}
		
		return null;
	};

	// preload images for events into object URLs
	const preloadEventImages = async (eventsList) => {
		const updated = await Promise.all(eventsList.map(async (p) => {
			try {
				if (p.image_url && (p.image_url.startsWith('/api/') || p.image_url.startsWith(API_BASE + '/api/'))) {
					const url = p.image_url.startsWith('/api/') ? (API_BASE + p.image_url) : p.image_url;
					const r = await fetch(url);
					if (!r.ok) return p;
					const blob = await r.blob();
					const obj = URL.createObjectURL(blob);
					return { ...p, _imageSrc: obj };
				}
			} catch (err) {
				// ignore preload errors
			}
			return p;
		}));
		return updated;
	};

	const fetchEvents = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await eventAPI.getEvents();
			console.log('Fetched events:', response.data); // Debug log
			const data = response.data || [];
			const withImages = await preloadEventImages(data);
			setEvents(withImages);
		} catch (err) {
			setError(err.message || 'Failed to fetch events');
			setEvents([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Check user role and fetch events on mount
	useEffect(() => {
		const init = async () => {
			// Try to get user info from API first (preferred)
			try {
				const resp = await authAPI.getCurrentUser();
				const role = resp?.data?.role;
				setIsSuperAdmin(role === 'superadmin');
			} catch (err) {
				// Fallback to checking the token payload if /auth/me fails
				setIsSuperAdmin(authAPI.hasRole('superadmin'));
			}
			// Fetch events afterwards
			await fetchEvents();
		};

		init();

	}, [fetchEvents]);

	// Add Event Modal States
	const [showAddModal, setShowAddModal] = useState(false);
	const [addForm, setAddForm] = useState({
		title: '',
		description: '',
		event_date: '',
	});

	// Edit Event Modal States
	const [showEditModal, setShowEditModal] = useState(false);
	const [editForm, setEditForm] = useState({
		id: '',
		title: '',
		description: '',
		event_date: '',
	});
	const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
	const [editError, setEditError] = useState(null);
	const [editLoading, setEditLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(null);

	const navigate = useNavigate();

	// Image states
	const [addImage, setAddImage] = useState(null);
	const [editImage, setEditImage] = useState(null);

	// Dedicated image handlers (like AdminProjects)
	const handleAddImage = (e) => {
		setAddImage(e.target.files[0]);
	};
	const handleEditImage = (e) => {
		setEditImage(e.target.files[0]);
		// If user selects a new image, they no longer intend to remove the current image
		setRemoveCurrentImage(false);
	};
	const [addError, setAddError] = useState(null);
	const [addLoading, setAddLoading] = useState(false);

	// Handle logout
	const handleLogout = () => {
		// Add your logout logic here
		navigate('/login');
	};

	// Handle edit button click
	const handleEditClick = (event) => {
		setEditForm({
			id: event.id,
			title: event.title,
			description: event.description,
			event_date: event.event_date,
			image_url: event.image_url || '',
			_imageSrc: event._imageSrc || null
		});
		setEditImage(null); // Reset image selection
		setRemoveCurrentImage(false); // Reset remove-image flag
		setShowEditModal(true);
		setEditError(null);
	};

	// Handle edit form input
	const handleEditInput = (e) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	};

	// Handle add form input
	const handleAddInput = (e) => {
		setAddForm({ ...addForm, [e.target.name]: e.target.value });
	};

	// Handle add form submit (multipart FormData to /api/events)
	const handleAddSubmit = async (e) => {
		e.preventDefault();
		setAddLoading(true);
		setAddError(null);
		try {
			if (addImage) {
				const imageError = validateImage(addImage);
				if (imageError) {
					setAddError(imageError);
					setAddLoading(false);
					return;
				}
			}
			const formData = new FormData();
			formData.append('title', addForm.title.trim());
			formData.append('description', addForm.description.trim());
			formData.append('event_date', addForm.event_date);
			if (addImage) formData.append('image', addImage);
			await eventAPI.createEvent(formData, true);
			// Reset form and close modal
			setShowAddModal(false);
			setAddForm({ title: '', description: '', event_date: '' });
			setAddImage(null);
			await fetchEvents();
		} catch (err) {
			console.error('Add event error:', err);
			setAddError(err.response?.data?.message || err.message || 'Failed to add event');
		} finally {
			setAddLoading(false);
		}
	};

	// Handle edit form submit (multipart FormData to /api/events)
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		setEditLoading(true);
		setEditError(null);
		try {
			if (editImage) {
				const imageError = validateImage(editImage);
				if (imageError) {
					setEditError(imageError);
					setEditLoading(false);
					return;
				}
			}
			const formData = new FormData();
			formData.append('title', editForm.title.trim());
			formData.append('description', editForm.description.trim());
			formData.append('event_date', editForm.event_date);
			if (editImage) formData.append('image', editImage);
			// If user requested removal of current image, include a flag so backend can delete it
			if (removeCurrentImage) formData.append('remove_image', '1');
			const isFormData = !!editImage || removeCurrentImage;
			await eventAPI.updateEvent(editForm.id, formData, isFormData);
			setShowEditModal(false);
			setEditImage(null);
			setRemoveCurrentImage(false);
			await fetchEvents();
		} catch (error) {
			console.error('Edit event error:', error);
			setEditError(error.response?.data?.message || error.message || 'Failed to update event');
		} finally {
			setEditLoading(false);
		}
	};

	// Handle delete event
	const handleDeleteEvent = async (eventId, eventTitle) => {
		if (!window.confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
			return;
		}
		setDeleteLoading(eventId);
		try {
			await eventAPI.deleteEvent(eventId);
			fetchEvents();
		} catch (error) {
			console.error('Error deleting event:', error);
			setError('Failed to delete event');
		} finally {
			setDeleteLoading(null);
		}
	};

	// Helper function to get image URL
	const getImageUrl = (imageUrl) => {
		if (!imageUrl) return null;
		
		// Debug log
		console.log('Processing image URL:', imageUrl);
		
		// If it's already a full URL, return as is, but add cache-busting
		if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
			return imageUrl + '?t=' + Date.now();
		}

		// If the backend returns a numeric ID (like '21') or plain id, map to /image/{id}
		const maybeId = String(imageUrl).trim();
		if (!isNaN(Number(maybeId))) {
			return `${API_BASE}/image/${maybeId}?t=${Date.now()}`;
		}

		// If it starts with a slash, remove it to avoid double slashes
		const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
		return `${API_BASE}/${cleanPath}?t=${Date.now()}`;
	};

	// Add Event Modal
	const renderAddModal = showAddModal && (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
			<div className="min-h-screen flex items-start sm:items-center justify-center p-4">
				<div className="bg-white p-6 rounded-lg shadow-2xl ring-1 ring-black/5 w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-hidden relative z-50">
					<h3 className="text-xl font-bold mb-4">Add New Event</h3>
					<div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
						<form onSubmit={handleAddSubmit}>
					<div className="mb-4">
						<label className="block mb-2 font-medium text-gray-700">Title *</label>
						<input
							type="text"
							name="title"
							value={addForm.title}
							onChange={handleAddInput}
							className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
							maxLength={255}
						/>
					</div>
					<div className="mb-4">
									<label className="block mb-2 font-medium text-gray-700">Description *</label>
									<Editor
										apiKey={TINYMCE_API_KEY}
										value={addForm.description}
										onEditorChange={val => setAddForm(f => ({ ...f, description: val }))}
										init={{
											height: 450,
											menubar: false,
												branding: false,
											plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
											toolbar:
												'undo redo | formatselect | bold italic backcolor | \
												alignleft aligncenter alignright alignjustify | \
												bullist numlist outdent indent | removeformat | help'
										}}
									/>
					</div>
					<div className="mb-4">
						<label className="block mb-2 font-medium text-gray-700">Event Date *</label>
						<input
							type="date"
							name="event_date"
							value={addForm.event_date}
							onChange={handleAddInput}
							className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block mb-2 font-medium text-gray-700">Image</label>
						<input
							type="file"
							name="image"
							accept="image/*"
							onChange={handleAddImage}
							className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{addImage && (
							<div className="mt-2 text-sm text-gray-600">
								Selected: {addImage.name} ({(addImage.size / 1024 / 1024).toFixed(2)} MB)
							</div>
						)}
					</div>
					{addError && (
						<div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
							{addError}
						</div>
					)}
					<div className="flex justify-end gap-3">
						<button
							type="button"
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
							onClick={() => {
								setShowAddModal(false);
								setAddError(null);
								setAddImage(null);
								setAddForm({ title: '', description: '', event_date: '' });
							}}
							disabled={addLoading}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
							disabled={addLoading}
						>
							{addLoading ? 'Adding...' : 'Add Event'}
						</button>
					</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);

	// Edit Modal
	const renderEditModal = showEditModal && (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
			<div className="min-h-screen flex items-start sm:items-center justify-center p-4">
				<div className="bg-white p-6 rounded-lg shadow-2xl ring-1 ring-black/5 w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-hidden relative z-50">
					<h3 className="text-xl font-bold mb-4">Edit Event</h3>
					<div className="overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
						<form onSubmit={handleEditSubmit}>
						<div className="mb-4">
							<label className="block mb-2 font-medium text-gray-700">Title *</label>
							<input
								type="text"
								name="title"
								value={editForm.title}
								onChange={handleEditInput}
								className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
								maxLength={255}
							/>
						</div>
						<div className="mb-4">
							<label className="block mb-2 font-medium text-gray-700">Description *</label>
							<Editor
								apiKey={TINYMCE_API_KEY}
								value={editForm.description}
								onEditorChange={val => setEditForm(f => ({ ...f, description: val }))}
								init={{
									height: 450,
									menubar: false,
									branding: false,
									plugins: 'advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount',
									toolbar:
										'undo redo | formatselect | bold italic backcolor | \
										alignleft aligncenter alignright alignjustify | \
										bullist numlist outdent indent | removeformat | help'
								}}
							/>
						</div>
						<div className="mb-4">
							<label className="block mb-2 font-medium text-gray-700">Event Date *</label>
							<input
								type="date"
								name="event_date"
								value={editForm.event_date ? editForm.event_date.slice(0, 10) : ''}
								onChange={handleEditInput}
								className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block mb-2 font-medium text-gray-700">Image</label>
							{editForm.image_url && !removeCurrentImage && (
								<div className="mb-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">Current Image:</p>
									<img
										src={editForm._imageSrc || getImageUrl(editForm.image_url)}
										alt="Current"
										className="h-32 w-32 object-cover rounded-lg border border-gray-300"
									/>
								</div>
							)}
							<input
								type="file"
								name="image"
								accept="image/*"
								onChange={handleEditImage}
								className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{editImage && (
								<div className="mt-3 p-4 bg-blue-50 border border-blue-300 rounded-lg">
									<p className="text-sm font-medium text-blue-600 mb-2">New Image Preview:</p>
									<img src={URL.createObjectURL(editImage)} alt="New" className="h-32 w-32 object-cover rounded-lg border border-blue-300" />
								</div>
							)}
							<div className="flex items-center gap-2 mt-2">
								<input id="removeImage" type="checkbox" checked={removeCurrentImage} onChange={(e) => setRemoveCurrentImage(e.target.checked)} className="h-4 w-4" />
								<label htmlFor="removeImage" className="text-sm text-gray-700">Remove current image (leave this event without a photo)</label>
							</div>
							<div className="mt-1 text-xs text-gray-500">Leave file input empty to keep current image; check the box to remove it</div>
						</div>
						{editError && (
							<div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">{editError}</div>
						)}
						<div className="flex justify-end gap-3">
							<button type="button" className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors" onClick={() => { setShowEditModal(false); setEditError(null); setEditImage(null); setRemoveCurrentImage(false); }} disabled={editLoading}>Cancel</button>
							<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors" disabled={editLoading}>{editLoading ? 'Updating...' : 'Update Event'}</button>
						</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="p-2 sm:p-4 md:p-8 w-full max-w-screen-2xl mx-auto flex flex-col items-center sm:items-start">
			<div className="w-full flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Manage Events</h2>
				<div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end">
					<span className={`px-3 py-1 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
						{isSuperAdmin ? 'Super Admin' : 'Admin'}
					</span>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Logout
					</button>
				</div>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
					{error}
				</div>
			)}

			<div className="flex justify-center w-full">
				<button
					className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 font-medium"
					style={{ width: 'auto', display: 'inline-block' }}
					onClick={() => setShowAddModal(true)}
				>
					+ Add New Event
				</button>
			</div>

			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center py-12">
					<div className="text-gray-500 text-lg">Loading events...</div>
				</div>
			)}

			{/* Events Table */}
			{!loading && (
				<div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border-2 border-blue-200 w-full">
					<table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
						<thead className="bg-gray-50">
							<tr>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Title</th>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Description</th>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Event Date</th>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Image</th>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-blue-100">
							{events.length === 0 ? (
								<tr>
									<td colSpan="5" className="py-8 px-4 text-center text-gray-500">
										<div className="text-lg">No events found</div>
										<div className="text-sm mt-1">Add your first event to get started!</div>
									</td>
								</tr>
							) : (
								events.map((event) => (
									<tr key={event.id} className="hover:bg-blue-50 transition-colors">
										<td className="py-4 px-4 font-medium text-gray-900">
											{event.title && event.title.length > 50 ? event.title.slice(0, 50) + '…' : event.title}
										</td>
										<td className="py-4 px-4 max-w-xs truncate whitespace-pre-line break-words" title={event.description}>
											<SafeRichText content={event.description && event.description.length > 50 ? event.description.slice(0, 50) + '…' : event.description} />
										</td>
										<td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{event.event_date ? event.event_date.slice(0, 10) : ''}</td>
										<td className="py-4 px-4">
											{event.image_url ? (
												<div>
													<img
														src={event._imageSrc ? event._imageSrc : getImageUrl(event.image_url)}
														alt={event.title}
														className="h-12 w-12 object-cover rounded border"
														onLoad={() => console.log('Image loaded successfully:', event.image_url)}
														onError={(e) => {
															console.error('Image failed to load:', {
																originalUrl: event.image_url,
																constructedUrl: getImageUrl(event.image_url),
																eventId: event.id
															});
															e.target.style.display = 'none';
															e.target.nextSibling.style.display = 'inline';
														}}
													/>
													<span className="text-red-400 text-xs hidden">Image not found</span>
												</div>
											) : (
												<span className="text-gray-400">No image</span>
											)}
										</td>
										<td className="py-4 px-4">
											<div className="flex flex-col gap-2 items-stretch justify-center">
												<button
													onClick={() => handleEditClick(event)}
													className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
													style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
												>
													Edit
												</button>
												{isSuperAdmin ? (
													<button
														onClick={() => handleDeleteEvent(event.id, event.title)}
														disabled={deleteLoading === event.id}
														className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
														style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
													>
														{deleteLoading === event.id ? 'Deleting...' : 'Delete'}
													</button>
												) : (
													<button
														disabled
														className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
														title="Superadmin role required to delete events"
														style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}
													>
														Delete
													</button>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}
			{renderAddModal}
			{renderEditModal}
		</div>
	);
}