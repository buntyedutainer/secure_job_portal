import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Postings from './pages/Postings';
import PostingDetail from './pages/PostingDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/postings">Postings</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/postings" element={<Postings />} />
          <Route path="/postings/:id" element={<PostingDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App; 