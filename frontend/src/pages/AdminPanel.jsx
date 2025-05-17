import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    id: null,
    brand: '',
    model: '',
    price: '',
    year: '',
    fuel: '',
    images: []
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
      .then(res => res.json())
      .then(data => setCars(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append('images', file);
    }

    try {
      const res = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, images: [...prev.images, ...data.files] }));
      }
    } catch {
      alert('Eroare la încărcarea imaginilor');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();

    if (form.price < 1000 || form.year < 1900 || form.year > currentYear || !form.fuel || !form.images.length) {
      alert('Completează toate câmpurile corect.');
      return;
    }

    if (form.id === null) {
      const { id, ...carData } = form; // eliminăm id
      fetch('http://localhost:3001/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
      })
        .then(res => res.json())
        .then(newCar => {
          setCars([...cars, newCar]);
          resetForm();
        });
    } else {
      fetch(`http://localhost:3001/api/cars/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(updated => {
          setCars(cars.map(c => (c.id === form.id ? updated.car : c)));
          resetForm();
        });
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      brand: '',
      model: '',
      price: '',
      year: '',
      fuel: '',
      images: []
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/cars/${id}`, { method: 'DELETE' })
      .then(() => setCars(cars.filter(car => car.id !== id)));
  };

  const handleEdit = (car) => {
    setForm(car);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>⚙️ Panou Administrator</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
        <input name="brand" placeholder="Marcă" value={form.brand} onChange={handleChange} required />
        <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Preț" value={form.price} onChange={handleChange} required />
        <input name="year" type="number" placeholder="An" value={form.year} onChange={handleChange} required />
        <select name="fuel" value={form.fuel} onChange={handleChange} required>
          <option value="">-- Combustibil --</option>
          <option value="Diesel">Diesel</option>
          <option value="Benzină">Benzină</option>
          <option value="Electric">Electric</option>
          <option value="Hibrid">Hibrid</option>
        </select>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        {form.images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {form.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img src={`http://localhost:3001${img}`} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                <button
                  type="button"
                  onClick={() => {
                    const imgs = [...form.images];
                    imgs.splice(idx, 1);
                    setForm({ ...form, images: imgs });
                  }}
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    background: 'red',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    fontSize: '12px',
                    width: 20,
                    height: 20,
                    cursor: 'pointer'
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">{form.id === null ? 'Adaugă mașină' : 'Salvează modificările'}</button>
        {form.id !== null && <button type="button" onClick={resetForm}>Renunță</button>}
      </form>

      <h3>📋 Mașini existente</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cars.map(car => (
          <li key={car.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            <strong>{car.brand} {car.model}</strong> – {car.price} €
            <br />
            <button onClick={() => handleEdit(car)}>✏️ Editează</button>
            <button onClick={() => handleDelete(car.id)} style={{ marginLeft: '1rem' }}>🗑️ Șterge</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
