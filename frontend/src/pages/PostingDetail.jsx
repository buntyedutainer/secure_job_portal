import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PostingDetail() {
  const { id } = useParams();
  const [posting, setPosting] = useState(null);
  const [error, setError] = useState('');

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
    </div>
  );
}

export default PostingDetail;