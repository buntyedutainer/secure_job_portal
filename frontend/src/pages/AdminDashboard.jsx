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

  if (!token) return <p className="max-w-5xl mx-auto px-6 py-16 text-ink/60">Log in as an admin to view this page.</p>;
  if (role !== 'admin') return <p className="max-w-5xl mx-auto px-6 py-16 text-ink/60">Admin access only.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <h1 className="font-display text-3xl font-bold text-ink">Admin Dashboard</h1>
      {error && <p className="text-rose-600">{error}</p>}

      <section>
        <h2 className="font-display text-xl font-bold text-ink mb-4">All Postings</h2>
        <div className="space-y-3">
          {postings.map((p) => (
            <div key={p.id} className="bg-white shadow-sm rounded-xl p-4 border border-line flex justify-between items-center">
              <div>
                <p className="font-semibold text-ink">{p.title}</p>
                <p className="text-sm text-ink/50">{p.company_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'open' ? 'bg-accent/20 text-accentdeep' : 'bg-line text-ink/50'}`}>
                  {p.status}
                </span>
                <button
                  onClick={() => togglePostingStatus(p)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition ${p.status === 'open' ? 'text-rose-600 border border-rose-200 hover:bg-rose-50' : 'bg-accent hover:bg-accentdeep text-ink font-medium'}`}
                >
                  {p.status === 'open' ? 'Reject' : 'Approve'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold text-ink mb-4">All Users</h2>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="bg-white shadow-sm rounded-xl p-4 border border-line flex justify-between items-center">
              <div>
                <p className="font-semibold text-ink">{u.name} <span className="text-ink/40 text-sm font-normal">({u.role})</span></p>
                <p className="text-sm text-ink/50">{u.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {u.is_active ? 'Active' : 'Disabled'}
                </span>
                <button
                  onClick={() => toggleUserActive(u.id)}
                  className={`text-sm px-3 py-1.5 rounded-lg transition ${u.is_active ? 'text-rose-600 border border-rose-200 hover:bg-rose-50' : 'bg-accent hover:bg-accentdeep text-ink font-medium'}`}
                >
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