import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchUsers, deleteUser } from './usersSlice';
import { Link } from 'react-router-dom';
import Pagination from '../../components/pagination';
import Modal from '../../components/modal';
import { toast } from 'react-toastify';

const PAGE_SIZE = 5;

export default function UserList(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.users);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | ''>('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchUsers()); }, [dispatch]);

  const filtered = useMemo(() => {
    let data = [...list];
    if (search) data = data.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
    if (roleFilter) data = data.filter((u) => u.role === roleFilter);
    if (activeFilter) data = data.filter((u) => String(u.isActive) === activeFilter);
    if (sortBy) data.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    return data;
  }, [list, search, roleFilter, activeFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="">No sort</option>
          <option value="name">Sort by name</option>
          <option value="email">Sort by email</option>
        </select>
        <Link to="/create"><button className="button">Create New User</button></Link>
      </div>

      {loading ? <div>Loading...</div> : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <Link to={`/users/${u.id}`}><button className="button">View</button></Link>
                    <Link to={`/edit/${u.id}`}><button className="button">Edit</button></Link>
                    <button className="button" onClick={() => setConfirmDeleteId(u.id!)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination current={page} totalPages={pageCount} onChange={setPage} />
        </>
      )}

      <Modal open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <div>
          <p>Are you sure you want to delete this user?</p>
          <button className="button" onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}>Yes, delete</button>
          <button className="button" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
