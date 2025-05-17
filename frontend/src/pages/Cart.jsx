import { useEffect, useState } from 'react';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(saved);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter(car => car.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Coșul de cumpărături</h2>
      {cart.length === 0 && <p>Coșul este gol.</p>}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {cart.map(car => (
          <div key={car.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{car.brand} {car.model}</h3>
            <p>Preț: {car.price} €</p>
            <button onClick={() => removeFromCart(car.id)}>Șterge din coș</button>
          </div>
        ))}
      </div>
    </div>
  );
}
