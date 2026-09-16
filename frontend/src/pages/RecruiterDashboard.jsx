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
  const API = import.meta.env.VITE_API_URL;

  const fetchPostings = () => {
    axios.get(`${API}/my-postings`, authHeaders)
      .then((res) => setPostings(res.data))
      .catch(() => setError('Could not load your postings'));
  };

  useEffect(() => {
    if (token) fetchPostings();
  }, [token]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: '', description: '', requirements: '', company_name: '' });
    setEditingId(null);
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/postings/${editingId}`, form, authHeaders);
      } else {
        await axios.post(`${API}/postings`, form, authHeaders);
      }
      resetForm();
      setShowForm(false);
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
    await axios.delete(`${API}/postings/${id}`, authHeaders);
    fetchPostings();
  };

  const handleViewApplicants = async (id) => {
    if (viewingApplicantsId === id) {
      setViewingApplicantsId(null);
      return;
    }
    const res = await axios.get(`${API}/postings/${id}/applicants`, authHeaders);
    setApplicants(res.data);
    setViewingApplicantsId(id);
  };

  if (!token) return <p className="max-w-4xl mx-auto px-6 py-16 text-ink/60">Log in as a recruiter to view your dashboard.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Recruiter Dashboard</h1>
        <button
          onClick={() => { setShowForm(!showForm); resetForm(); }}
          className="bg-accent hover:bg-accentdeep text-ink font-semibold px-5 py-2.5 rounded-lg shadow-sm transition"
        >
          {showForm ? 'Cancel' : '+ New Posting'}
        </button>
      </div>

      {error && <p className="text-rose-600 mb-4">{error}</p>}

      {showForm && (
        <form onSubmit={handleCreateOrUpdate} className="bg-white shadow-sm rounded-xl p-6 mb-6 space-y-4 border border-line">
          <input name="title" value={form.title} onChange={handleFormChange} placeholder="Job Title"
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required />
          <input name="company_name" value={form.company_name} onChange={handleFormChange} placeholder="Company Name"
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" required />
          <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Description"
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" rows="3" required />
          <textarea name="requirements" value={form.requirements} onChange={handleFormChange} placeholder="Requirements"
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" rows="2" />
          <button type="submit" className="bg-ink hover:bg-ink/90 text-paper font-semibold px-5 py-2.5 rounded-lg transition">
            {editingId ? 'Update Posting' : 'Create Posting'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {postings.map((p) => (
          <div key={p.id} className="bg-white shadow-sm rounded-xl p-5 border border-line hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-display font-bold text-lg text-ink">{p.title}</h2>
                <p className="text-ink/50 text-sm">{p.company_name}</p>
                <span className={`inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'open' ? 'bg-accent/20 text-accentdeep' : 'bg-line text-ink/50'}`}>
                  {p.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-sm border border-line text-ink hover:bg-line/40 px-3 py-1.5 rounded-lg transition">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition">Delete</button>
                <button onClick={() => handleViewApplicants(p.id)} className="text-sm bg-ink hover:bg-ink/90 text-paper px-3 py-1.5 rounded-lg transition">
                  {viewingApplicantsId === p.id ? 'Hide Applicants' : 'View Applicants'}
                </button>
              </div>
            </div>

            {viewingApplicantsId === p.id && (
              <div className="mt-4 border-t border-line pt-4">
                {applicants.length === 0 ? (
                  <p className="text-ink/40 text-sm">No applicants yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {applicants.map((a) => (
                      <li key={a.application_id} className="text-sm text-ink/70 flex justify-between">
                        <span>{a.student_name} ({a.student_email})</span>
                        <span className="text-ink/40">{a.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
        {postings.length === 0 && (
          <div className="bg-white border border-line border-dashed rounded-xl p-10 text-center">
            <p className="text-ink/50">You haven't posted any jobs yet. Click '+ New Posting' to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;