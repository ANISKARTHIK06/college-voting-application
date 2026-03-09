import { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [importing, setImporting] = useState(false);

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
        const action = currentRole === 'admin' ? 'demote' : 'promote';
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        
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

    const toggleStatus = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/users/${userId}/status`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            alert('Failed to toggle access status');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            const header = rows[0].map(h => h.trim().toLowerCase());
            
            const usersData = rows.slice(1).filter(r => r.length > 1).map(row => {
                const userObj = {};
                header.forEach((h, i) => {
                    userObj[h] = row[i]?.trim();
                });
                return userObj;
            });

            try {
                const token = localStorage.getItem('token');
                const res = await axios.post('http://localhost:5000/api/users/import', { users: usersData }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert(res.data.message);
                fetchUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Bulk import failed');
            } finally {
                setImporting(false);
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    const [deptFilter, setDeptFilter] = useState('All');

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === 'All' || u.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    if (loading) {
      return (
        <div className="loader-wrapper">
          <div className="loader-spinner"></div>
          <p className="loader-text">Loading directory access...</p>
        </div>
      );
    }

    return (
        <div className="users-management-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Directory Management</h1>
                    <p className="page-subtitle">Manage platform permissions and user identities</p>
                </div>
                <div className="page-header-actions">
                    <label className={`btn btn-secondary ${importing ? 'disabled' : ''}`} style={{ cursor: 'pointer' }}>
                        {importing ? 'Importing...' : '📥 Bulk Import CSV'}
                        <input type="file" accept=".csv" onChange={handleFileUpload} hidden disabled={importing} />
                    </label>
                    <div className="glass-panel" style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>DEPT:</span>
                        <select 
                            className="form-input" 
                            style={{ border: 'none', background: 'transparent', padding: '8px 0', fontSize: '0.85rem', color: 'var(--text-main)', width: '120px' }}
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            <option value="CS">Computer Science</option>
                            <option value="IT">IT</option>
                            <option value="Mech">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="ECE">ECE</option>
                        </select>
                    </div>
                    <div className="glass-panel" style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="form-input"
                            style={{ border: 'none', background: 'transparent', width: '200px', padding: '8px 0', fontSize: '0.85rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="dashboard-card glass-panel animate-slideUp" style={{ padding: '0' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identifier</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Access Role</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eligibility</th>
                                <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-subtle)', opacity: user.isActive ? 1 : 0.6, transition: 'var(--transition)' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div className="topbar-avatar" style={{ width: '38px', height: '38px', filter: user.isActive ? 'none' : 'grayscale(100%)' }}>{user.name[0]}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <span className={`badge ${user.userType === 'staff' ? 'badge-published' : 'badge-user'}`} style={{ textTransform: 'capitalize' }}>
                                            {user.userType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                                        {user.department || '—'}
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <span className={`badge ${user.isActive ? 'badge-active' : 'badge-ended'}`}>
                                            {user.isActive ? 'Eligible' : 'Deactivated'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                className={`btn btn-sm btn-ghost`}
                                                onClick={() => toggleStatus(user._id)}
                                                title={user.isActive ? 'Deactivate Access' : 'Activate Access'}
                                            >
                                                {user.isActive ? '🚫 Disable' : '✅ Enable'}
                                            </button>
                                            <button 
                                                className={`btn btn-sm ${user.role === 'admin' ? 'btn-ghost' : 'btn-secondary'}`}
                                                onClick={() => toggleRole(user._id, user.role)}
                                            >
                                                {user.role === 'admin' ? '🛡️ Demote' : '⚡ Admin'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="empty-state" style={{ border: 'none' }}>
                    <div className="empty-state-icon">👥</div>
                    <p className="empty-state-text">No directory matches found.</p>
                  </div>
                )}
            </div>
            
            <div className="dashboard-card glass-panel" style={{ marginTop: '32px', background: 'var(--info-bg)', borderColor: 'var(--info)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--info)', marginBottom: '8px' }}>CSV Import Formatting</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', opacity: 0.8 }}>
                    <strong>Expected Columns:</strong> name, email, userType (student/staff), department, position. 
                    <br />Passwords will be set to "College@123" by default unless specified.
                </p>
            </div>
        </div>
    );
};

export default UsersManagement;
