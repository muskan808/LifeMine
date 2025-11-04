import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from './features/users/userList';
import UserForm from './features/users/userForm';
import UserDetails from './features/users/userDetails';
import { ToastContainer } from 'react-toastify';

export default function App(): React.ReactElement {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
        <nav>
          <Link to="/">Users</Link>
          {' | '}
          <Link to="/create">Create New User</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/create" element={<UserForm />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/edit/:id" element={<UserForm editMode />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" />
    </div>
  );
}
