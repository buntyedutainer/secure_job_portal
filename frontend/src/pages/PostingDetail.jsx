import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

  if (error) return <p>{error}</p>;
  if (!posting) return <p>Loading...</p>;

  return (
    <div>
      <h1>{posting.title}</h1>
      <p><strong>Company:</strong> {posting.company_name}</p>
      <p><strong>Status:</strong> {posting.status}</p>
      <p><strong>Description:</strong> {posting.description}</p>
      <p><strong>Requirements:</strong> {posting.requirements}</p>
      {token ? ( 
        <div> 
            <button onClick={handleApply}>Apply</button> 
            {applyMessage && <p>{applyMessage}</p>} 
        </div> 
      ) : ( 
        <p>Log in to apply for this posting.</p> 
      )}
    </div>
  );
}

export default PostingDetail;