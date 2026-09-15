import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PostingDetail() {
  const { id } = useParams();
  const [posting, setPosting] = useState(null);
  const [error, setError] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const { token } = useAuth();

  const handleApply = async () => {
    try {
      await axios.post('http://localhost:5000/applications',
        { posting_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplyMessage('Application submitted!');
    } catch (error) {
      setApplyMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/postings/${id}`)
      .then((response) => setPosting(response.data))
      .catch(() => setError('Posting not found'));
  }, [id]);

  if (error) return <p className="max-w-2xl mx-auto px-6 py-12 text-rose-600">{error}</p>;
  if (!posting) return <p className="max-w-2xl mx-auto px-6 py-12 text-ink/50">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/postings" className="text-sm text-ink/50 hover:text-ink transition mb-6 inline-block">&larr; Back to postings</Link>
      <div className="bg-white border border-line rounded-xl shadow-sm p-8">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${posting.status === 'open' ? 'bg-accent/20 text-accentdeep' : 'bg-line text-ink/50'}`}>
          {posting.status}
        </span>
        <h1 className="font-display text-3xl font-bold text-ink mt-3">{posting.title}</h1>
        <p className="text-ink/50 mt-1">{posting.company_name}</p>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Description</p>
            <p className="text-ink/80">{posting.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Requirements</p>
            <p className="text-ink/80">{posting.requirements}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-line">
          {token ? (
            <div>
              <button onClick={handleApply} className="bg-accent hover:bg-accentdeep text-ink font-semibold px-6 py-3 rounded-lg shadow-sm transition">
                Apply Now
              </button>
              {applyMessage && <p className="mt-3 text-sm text-ink/60">{applyMessage}</p>}
            </div>
          ) : (
            <p className="text-ink/50">
              <Link to="/login" className="text-accentdeep font-medium hover:underline">Log in</Link> to apply for this posting.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostingDetail;