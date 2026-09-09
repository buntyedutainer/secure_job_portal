import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Postings() {
  const [postings, setPostings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/postings')
      .then((response) => setPostings(response.data))
      .catch(() => setError('Could not load postings'));
  }, []);

  return (
    <div>
      <h1>Job Postings</h1>
      {error && <p>{error}</p>}
      <ul>
        {postings.map((p) => (
          <li key={p.id}>
            <Link to={`/postings/${p.id}`}>{p.title}</Link> — {p.company_name} ({p.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Postings;