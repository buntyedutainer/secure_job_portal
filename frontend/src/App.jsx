import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Postings from './pages/Postings';
import PostingDetail from './pages/PostingDetail';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = "relative text-ink/70 hover:text-ink transition text-sm font-medium py-2 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-accent after:transition-all hover:after:w-full";

  return (
    <nav className="bg-paper border-b border-line sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-3 h-3 bg-accent rounded-sm"></span>
          <span className="font-display font-bold text-lg text-ink">JobPortal</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/postings" className={linkClass}>Postings</Link>
          {token && role === 'student' && <Link to="/my-applications" className={linkClass}>My Applications</Link>}
          {token && role === 'recruiter' && <Link to="/dashboard" className={linkClass}>Dashboard</Link>}
          {token && role === 'admin' && <Link to="/admin" className={linkClass}>Admin</Link>}
          {!token && <Link to="/login" className={linkClass}>Login</Link>}
          {!token && (
            <Link to="/register" className="bg-ink hover:bg-ink/90 text-paper text-sm font-medium px-4 py-2 rounded-md transition">
              Get Started
            </Link>
          )}
          {token && (
            <button onClick={handleLogout} className="text-sm font-medium text-ink/70 hover:text-ink transition">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-paper">
          <NavBar />
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;