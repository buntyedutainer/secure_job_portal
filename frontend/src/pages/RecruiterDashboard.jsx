import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function RecruiterDashboard() {
  const { token } = useAuth();
  const [postings, setPostings] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingApplicantsId, setViewingApplicantsId] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const [form, setForm] = useState({ title: '', description: '', requirements: '', company_name: '' });

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPostings = () => {
    axios.get('http://localhost:5000/my-postings', authHeaders)
      .then((res) => setPostings(res.data))
      .catch(() => setError('Could not load your postings'));
  };

  useEffect(() => {
    if (token) fetchPostings();
  }, [token]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/postings/${editingId}`, form, authHeaders);
      } else {
        await axios.post('http://localhost:5000/postings', form, authHeaders);
      }
      setForm({ title: '', description: '', requirements: '', company_name: '' });
      setShowForm(false);
      setEditingId(null);
      fetchPostings();
    } catch {
      setError('Could not save posting');
    }
  };

  const handleEdit = (posting) => {
    setForm({
      title: posting.title,
      description: posting.description || '',
      requirements: posting.requirements || '',
      company_name: posting.company_name
    });
    setEditingId(posting.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this posting?')) return;
    await axios.delete(`http://localhost:5000/postings/${id}`, authHeaders);
    fetchPostings();
  };

  const handleViewApplicants = async (id) => {
    if (viewingApplicantsId === id) {
      setViewingApplicantsId(null);
      return;
    }
    const res = await axios.get(`http://localhost:5000/postings/${id}/applicants`, authHeaders);
    setApplicants(res.data);
    setViewingApplicantsId(id);
  };

  if (!token) return <p className="p-6">Log in as a recruiter to view your dashboard.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', requirements: '', company_name: '' }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          {showForm ? 'Cancel' : '+ New Posting'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white shadow-md rounded-xl p-6 mb-6 space-y-4 border border-gray-100">
          <input name="title" value={form.title} onChange={handleFormChange} placeholder="Job Title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input name="company_name" value={form.company_name} onChange={handleFormChange} placeholder="Company Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows="3" required />
          <textarea name="requirements" value={form.requirements} onChange={handleFormChange} placeholder="Requirements"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows="2" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition">
            {editingId ? 'Update Posting' : 'Create Posting'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {postings.map((p) => (
          <div key={p.id} className="bg-white shadow rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{p.title}</h2>
                <p className="text-gray-500">{p.company_name}</p>
                <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${p.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {p.status}
                </span>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(p)} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition">Delete</button>
                <button onClick={() => handleViewApplicants(p.id)} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition">
                  {viewingApplicantsId === p.id ? 'Hide Applicants' : 'View Applicants'}
                </button>
              </div>
            </div>

            {viewingApplicantsId === p.id && (
              <div className="mt-4 border-t pt-4">
                {applicants.length === 0 ? (
                  <p className="text-gray-500 text-sm">No applicants yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {applicants.map((a) => (
                      <li key={a.application_id} className="text-sm text-gray-700 flex justify-between">
                        <span>{a.student_name} ({a.student_email})</span>
                        <span className="text-gray-500">{a.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecruiterDashboard;