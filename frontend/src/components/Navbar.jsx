import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {

    
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">🚗 Magazin Auto</div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        <Link to="/" onClick={() => setMenuOpen(false)}>Acasă</Link>
        <Link to="/cart" onClick={() => setMenuOpen(false)}>Coș</Link>
        <Link to="/catalog" onClick={() => setMenuOpen(false)}>Catalog</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/register" onClick={() => setMenuOpen(false)}>Înregistrare</Link>
        <button onClick={handleLogout} className="btn logout">Logout</button>
        <button onClick={() => setDarkMode(!darkMode)} className="btn mode-toggle">
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✖' : '☰'}
      </button>
    </header>
  );
}
