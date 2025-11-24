import React, { useEffect } from "react";
import { NavLink } from 'react-router-dom';

export default function AdminSidePanel() {
		return (
			<aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col py-8 px-4 shadow-lg">
				<div className="mb-6">
					<h2 className="text-xl font-bold text-green-700 text-center">Admin Panel</h2>
				</div>
				<nav className="flex flex-col gap-4">
					<NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'font-bold text-green-700' : 'text-green-500'}>
						Dashboard
					</NavLink>
					<NavLink to="/admin/partners" className={({ isActive }) => isActive ? 'font-bold text-green-700' : 'text-green-500'}>
						Partners
					</NavLink>
					<NavLink to="/admin/advisors" className={({ isActive }) => isActive ? 'font-bold text-green-700' : 'text-green-500'}>
						Advisors
					</NavLink>
					{/* Add other admin links here as needed */}
				</nav>
			</aside>
		);
}
