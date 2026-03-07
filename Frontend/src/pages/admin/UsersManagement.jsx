import { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const toggleRole = async (userId, currentRole) => {
        try {
            const token = localStorage.getItem('token');
            const newRole = currentRole === 'admin' ? 'user' : 'admin';
            await axios.patch(`http://localhost:5000/api/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="users-management-page animate-slideUp">
            <div className="section-header">
                <h2 className="section-title">Directory Management</h2>
                <div className="search-bar glass-card" style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
                    🔍 <input 
                        type="text" 
                        placeholder="Search users..." 
                        style={{ border: 'none', background: 'transparent', padding: '12px', width: '250px', outline: 'none' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Identity</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="table-avatar">{user.name[0]}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{user.name}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge-type ${user.userType}`}>
                                        {user.userType}
                                    </span>
                                </td>
                                <td>{user.department || '—'}</td>
                                <td>
                                    <span className={`role-tag ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        className="btn-small glass-card" 
                                        onClick={() => toggleRole(user._id, user.role)}
                                    >
                                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;
