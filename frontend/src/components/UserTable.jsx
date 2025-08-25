import React, { useEffect, useState } from 'react';
import axios from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditData({ ...user });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/users/${editId}`, editData);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        {typeof window.onLogout === 'function' && (
          <button className="btn btn-outline-danger" onClick={window.onLogout}>Logout</button>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editId === user.id ? (
                  <input name="username" value={editData.username} onChange={handleChange} className="form-control" />
                ) : (
                  user.username
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <input name="email" value={editData.email} onChange={handleChange} className="form-control" />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <input name="role" value={editData.role} onChange={handleChange} className="form-control" />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editId === user.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
