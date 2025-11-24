
import React, { useEffect, useState, useCallback } from 'react';
import { authorsAPI, authAPI } from '../utils/authUtils';
import { useNavigate } from 'react-router-dom';

export default function AdminAuthors() {
	const [authors, setAuthors] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSuperAdmin, setIsSuperAdmin] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [editForm, setEditForm] = useState({ id: '', name: '' });
	const [editError, setEditError] = useState(null);
	const [editLoading, setEditLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [addForm, setAddForm] = useState({ name: '' });
	const [addError, setAddError] = useState(null);
	const [addLoading, setAddLoading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		setIsSuperAdmin(authAPI.hasRole('superadmin'));
		setIsAdmin(authAPI.hasRole('admin'));
	}, []);

	// Fetch authors
	const fetchAuthors = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await authorsAPI.getAuthors();
			setAuthors(response.data?.data || []);
		} catch (err) {
			setError(err.message || 'Failed to fetch authors');
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAuthors();
	}, [fetchAuthors]);

	// Success message helper
	const showSuccess = (msg) => {
		setSuccessMessage(msg);
		setTimeout(() => setSuccessMessage(''), 3000);
	};

	// Add author handlers
	const handleAddInput = (e) => {
		setAddForm({ ...addForm, [e.target.name]: e.target.value });
	};
	const handleAddSubmit = async (e) => {
		e.preventDefault();
		setAddLoading(true);
		setAddError(null);
		try {
			const data = { name: addForm.name };
			const response = await authorsAPI.createAuthor(data);
			if (response.data?.success) {
				setShowAddModal(false);
				setAddForm({ name: '' });
				showSuccess('Author added successfully!');
				fetchAuthors();
			} else {
				setAddError(response.data?.message || 'Failed to add author');
			}
		} catch (err) {
			setAddError(err.message || 'Failed to add author');
		} finally {
			setAddLoading(false);
		}
	};

	// Edit author handlers
	const handleEditClick = (author) => {
		setEditForm({ id: author.id, name: author.name });
		setShowEditModal(true);
		setEditError(null);
	};
	const handleEditInput = (e) => {
		setEditForm({ ...editForm, [e.target.name]: e.target.value });
	};
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		setEditLoading(true);
		setEditError(null);
		try {
			const data = { name: editForm.name };
			const response = await authorsAPI.updateAuthor(editForm.id, data);
			if (response.data?.success) {
				setShowEditModal(false);
				showSuccess('Author updated successfully!');
				fetchAuthors();
			} else {
				setEditError(response.data?.message || 'Failed to update author');
			}
		} catch (err) {
			setEditError(err.message || 'Failed to update author');
		} finally {
			setEditLoading(false);
		}
	};

	// Delete author
	const handleDeleteAuthor = async (authorId, authorName) => {
		if (!isSuperAdmin) {
			alert('Access denied. Only superadmin can delete authors.');
			return;
		}
		const confirmDelete = window.confirm(`Are you sure you want to delete "${authorName}"? This action cannot be undone.`);
		if (!confirmDelete) return;
		setDeleteLoading(authorId);
		setError(null);
		try {
			await authorsAPI.deleteAuthor(authorId);
			setAuthors(prev => prev.filter(a => a.id !== authorId));
			showSuccess('Author deleted successfully!');
		} catch (err) {
			setError(err.message || 'Failed to delete author');
		} finally {
			setDeleteLoading(null);
		}
	};

	// Logout
	const handleLogout = () => {
		authAPI.logout();
		navigate('/admin/login');
	};

	// Permission logic
	const canEdit = isSuperAdmin || isAdmin;
	const canAdd = isSuperAdmin;
	const canDelete = isSuperAdmin;

	return (
	<div className="w-full max-w-screen-2xl mx-auto px-1 md:px-4 py-4 mt-2 landscape:px-8 landscape:py-8 flex flex-col items-center justify-center">
							<div className="w-full flex flex-col items-center sm:items-start gap-4 sm:flex-row sm:justify-between mb-6 md:gap-0">
								<h2 className="text-3xl md:text-4xl font-bold text-black mb-2 text-center sm:text-left drop-shadow-lg">Authors Management</h2>
								<div className="flex items-center gap-2 sm:gap-4 justify-center sm:justify-end">
					<span className={`px-3 py-1 rounded-full text-sm font-medium ${isSuperAdmin ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>{isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}</span>
					<button
						onClick={handleLogout}
						className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-red-300"
					>
						Logout
					</button>
				</div>
			</div>

			{successMessage && (
				<div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
					{successMessage}
				</div>
			)}

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
					<strong>Error:</strong> {error}
				</div>
			)}

			{canAdd && (
				<button
					className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 font-medium"
					onClick={() => setShowAddModal(true)}
				>
					+ Add New Author
				</button>
			)}

			{showAddModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
						<h3 className="text-xl font-bold mb-4">Add New Author</h3>
						<form onSubmit={handleAddSubmit}>
							<div className="mb-4">
								<label className="block mb-2 font-medium text-gray-700">Name</label>
								<input
									type="text"
									name="name"
									value={addForm.name}
									onChange={handleAddInput}
									className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
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
									{addLoading ? 'Adding...' : 'Add Author'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{showEditModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
						<h3 className="text-xl font-bold mb-4">Edit Author</h3>
						<form onSubmit={handleEditSubmit}>
							<div className="mb-4">
								<label className="block mb-2 font-medium text-gray-700">Name</label>
								<input
									type="text"
									name="name"
									value={editForm.name}
									onChange={handleEditInput}
									className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>
							{editError && (
								<div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
									{editError}
								</div>
							)}
							<div className="flex justify-end gap-3">
								<button
									type="button"
									className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
									onClick={() => {
										setShowEditModal(false);
										setEditError(null);
									}}
									disabled={editLoading}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
									disabled={editLoading}
								>
									{editLoading ? 'Updating...' : 'Update Author'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{loading && (
				<div className="flex items-center justify-center py-12">
					<div className="text-gray-500 text-lg">Loading authors...</div>
				</div>
			)}

			{!loading && (
				<div className="bg-white rounded-2xl shadow-2xl overflow-x-auto border-2 border-blue-200 w-full mx-2 md:mx-8">
					<table className="min-w-full text-sm md:text-base rounded-2xl overflow-hidden">
						<thead className="bg-gray-50">
							<tr>
								<th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
								<th className="py-3 px-4 text-left font-medium text-gray-700" style={{width: '120px'}}>Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-blue-100">
							{authors.length === 0 ? (
								<tr>
									<td colSpan="2" className="py-8 px-4 text-center text-gray-500">
										<div className="text-lg">No authors found</div>
										<div className="text-sm mt-1">Add your first author to get started!</div>
									</td>
								</tr>
							) : (
								authors.map((author) => (
									<tr key={author.id} className="hover:bg-blue-50 transition-colors">
										<td className="py-4 px-4 font-medium text-gray-900">
											{author.name && author.name.length > 50 ? author.name.slice(0, 50) + '…' : author.name}
										</td>
										<td className="py-4 px-4" style={{width: '120px'}}>
											<div className="flex flex-col gap-2 items-stretch justify-center">
												{canEdit && (
													<button
														onClick={() => handleEditClick(author)}
														className="px-3 py-1 bg-blue-600 text-white rounded-xl hover:scale-105 shadow-lg transition-all duration-300 border border-blue-700 text-base md:text-sm lg:text-base xl:text-lg"
														style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
														Edit
													</button>
												)}
												{canDelete ? (
													<button
														onClick={() => handleDeleteAuthor(author.id, author.name)}
														disabled={deleteLoading === author.id}
														className="px-3 py-1 bg-red-600 text-white rounded-xl hover:scale-105 shadow-lg disabled:opacity-50 transition-all duration-300 border border-red-700 text-base md:text-sm lg:text-base xl:text-lg"
														style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
														{deleteLoading === author.id ? 'Deleting...' : 'Delete'}
													</button>
												) : (
													<button
														disabled
														className="px-3 py-1 bg-gray-400 text-white rounded-xl cursor-not-allowed text-base md:text-sm lg:text-base xl:text-lg"
														title="Superadmin role required to delete authors"
														style={{fontSize: 'clamp(0.95rem, 1vw + 0.8rem, 1.1rem)'}}>
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
		</div>
	);
}
