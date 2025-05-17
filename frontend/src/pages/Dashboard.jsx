export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Salut, {user?.email || 'utilizator'}!</h2>
        <p>Ai acces la panoul de utilizator.</p>
      </div>
    );
  }
  