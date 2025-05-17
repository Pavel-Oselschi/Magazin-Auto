import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
      .then(res => res.json())
      .then(data => setCars(data));
  }, []);

  const filtered = cars.filter(car => {
    const match = car.brand.toLowerCase().includes(search.toLowerCase());
    const inMin = min ? car.price >= parseInt(min) : true;
    const inMax = max ? car.price <= parseInt(max) : true;
    return match && inMin && inMax;
  });

  return (
    <div className="catalog-container">
      <h2>Catalog Autovehicule</h2>
      <div className="filters">
        <input placeholder="Caută marcă (ex: BMW)" value={search} onChange={e => setSearch(e.target.value)} />
        <input type="number" placeholder="Preț minim" value={min} onChange={e => setMin(e.target.value)} />
        <input type="number" placeholder="Preț maxim" value={max} onChange={e => setMax(e.target.value)} />
      </div>

      <div className="catalog-grid">
        {filtered.map(car => (
          <div key={car.id} className="card">
            <img src={`http://localhost:3001${car.images?.[0]}`} alt={car.model} />
            <h3>{car.brand} {car.model}</h3>
            <p><strong>Preț:</strong> {car.price} €</p>
            <button onClick={() => navigate(`/car/${car.id}`)}>Detalii</button>
          </div>
        ))}
      </div>
    </div>
  );
}
