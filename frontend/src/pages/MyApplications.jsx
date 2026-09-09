import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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

  if (!token) return <p>Log in to view your applications.</p>;

  return (
    <div>
      <h1>My Applications</h1>
      {error && <p>{error}</p>}
      <ul>
        {applications.map((a) => (
          <li key={a.application_id}>
            {a.posting_title} at {a.company_name} — Status: {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyApplications;