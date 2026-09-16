import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    axios.get('http://localhost:5000/my-applications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => setApplications(response.data))
      .catch(() => setError('Could not load applications'));
  }, [token]);

  const statusStyle = (status) => {
    if (status === 'accepted') return 'bg-emerald-100 text-emerald-700';
    if (status === 'rejected') return 'bg-rose-100 text-rose-700';
    return 'bg-accent/20 text-accentdeep';
  };

  if (!token) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-ink/60">
          <Link to="/login" className="text-accentdeep font-medium hover:underline">Log in</Link> to view your applications.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">My Applications</h1>
      {error && <p className="text-rose-600 mb-4">{error}</p>}
      <div className="space-y-4">
        {applications.map((a) => (
          <div key={a.application_id} className="bg-white border border-line rounded-xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <h2 className="font-display font-bold text-lg text-ink">{a.posting_title}</h2>
              <p className="text-ink/50 text-sm mt-1">{a.company_name}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(a.status)}`}>
              {a.status}
            </span>
          </div>
        ))}
        {applications.length === 0 && !error && (
          <div className="bg-white border border-line border-dashed rounded-xl p-10 text-center">
            <p className="text-ink/50 mb-4">You haven't applied to anything yet.</p>
            <Link to="/postings" className="bg-accent hover:bg-accentdeep text-ink font-semibold px-5 py-2.5 rounded-lg transition inline-block">
              Browse Postings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;