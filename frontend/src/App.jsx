import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Postings from './pages/Postings';
import PostingDetail from './pages/PostingDetail';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/postings">Postings</Link> | <Link to="/my-applications">My Applications</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/postings" element={<Postings />} />
          <Route path="/postings/:id" element={<PostingDetail />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/dashboard" element={<RecruiterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;