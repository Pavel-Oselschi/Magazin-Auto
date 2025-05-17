import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#f1f1f1',
      alignItems: 'center'
    }}>
     
    </header>
  );
}
