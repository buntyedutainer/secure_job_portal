import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { token, role } = useAuth();
  const [postings, setPostings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = () => {
    axios.get('http://localhost:5000/admin/postings', authHeaders)
      .then((res) => setPostings(res.data))
      .catch(() => setError('Could not load postings'));
    axios.get('http://localhost:5000/admin/users', authHeaders)
      .then((res) => setUsers(res.data))
      .catch(() => setError('Could not load users'));
  };

  useEffect(() => {
    if (token && role === 'admin') fetchData();
  }, [token, role]);

  const togglePostingStatus = async (posting) => {
    const newStatus = posting.status === 'open' ? 'closed' : 'open';
    await axios.put(`http://localhost:5000/admin/postings/${posting.id}/status`, { status: newStatus }, authHeaders);
    fetchData();
  };

  const toggleUserActive = async (userId) => {
    await axios.put(`http://localhost:5000/admin/users/${userId}/toggle-active`, {}, authHeaders);
    fetchData();
  };

  if (!token) return <p className="p-6">Log in as an admin to view this page.</p>;
  if (role !== 'admin') return <p className="p-6">Admin access only.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      {error && <p className="text-red-600">{error}</p>}

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">All Postings</h2>
        <div className="space-y-3">
          {postings.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-xl p-4 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{p.title}</p>
                <p className="text-sm text-gray-500">{p.company_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {p.status}
                </span>
                <button onClick={() => togglePostingStatus(p)} className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition">
                  {p.status === 'open' ? 'Reject' : 'Approve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">All Users</h2>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white shadow rounded-xl p-4 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{u.name} <span className="text-gray-400 text-sm">({u.role})</span></p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {u.is_active ? 'Active' : 'Disabled'}
                </span>
                <button onClick={() => toggleUserActive(u.id)} className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg transition">
                  {u.is_active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;