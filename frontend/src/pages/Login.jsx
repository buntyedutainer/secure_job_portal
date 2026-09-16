import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
      login(response.data.access_token, response.data.role);
      setMessage('Login successful!');
      navigate('/postings');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-white shadow-sm rounded-xl p-8 border border-line">
        <h1 className="font-display text-2xl font-bold text-ink mb-6">Welcome back</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <button type="submit" className="w-full bg-accent hover:bg-accentdeep text-ink py-2.5 rounded-lg shadow-sm font-semibold transition">
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-ink/60">{message}</p>}
      </div>
    </div>
  );
}

export default Login;