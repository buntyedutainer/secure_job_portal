import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Postings() {
  const [postings, setPostings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/postings`)
      .then((response) => setPostings(response.data))
      .catch(() => setError('Could not load postings'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Job Postings</h1>
      {error && <p className="text-rose-600 mb-4">{error}</p>}
      <div className="space-y-4">
        {postings.map((p) => (
          <Link
            key={p.id}
            to={`/postings/${p.id}`}
            className="block bg-white border border-line rounded-xl p-5 shadow-sm hover:shadow-md hover:border-ink/20 hover:scale-[1.01] transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-display font-bold text-lg text-ink">{p.title}</h2>
                <p className="text-ink/50 text-sm mt-1">{p.company_name}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === 'open' ? 'bg-accent/20 text-accentdeep' : 'bg-line text-ink/50'}`}>
                {p.status}
              </span>
            </div>
          </Link>
        ))}
        {postings.length === 0 && !error && (
          <p className="text-ink/50">No postings yet. Check back soon.</p>
        )}
      </div>
    </div>
  );
}

export default Postings;