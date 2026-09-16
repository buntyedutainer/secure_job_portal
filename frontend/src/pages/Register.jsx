import { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { name, email, password, role });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-6">
      <div className="bg-white shadow-sm rounded-xl p-8 border border-line">
        <h1 className="font-display text-2xl font-bold text-ink mb-6">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>
          <button type="submit" className="w-full bg-ink hover:bg-ink/90 text-paper py-2.5 rounded-lg shadow-sm font-semibold transition">
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-ink/60">{message}</p>}
      </div>
    </div>
  );
}

export default Register;