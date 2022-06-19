import React from 'react';
import Login from './user/Login/Login';
import User from './user/User';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/user" element={<User />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
