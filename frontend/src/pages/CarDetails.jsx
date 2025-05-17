import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/api/cars')
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id === parseInt(id));
        setCar(found);
      });
  }, [id]);

  if (!car) return <p style={{ padding: '2rem' }}>Se încarcă...</p>;

  const openSlider = (index) => {
    setCurrentIndex(index);
    setSelectedImg(car.images[index]);
  };

  const prevImg = () => {
    const newIndex = (currentIndex - 1 + car.images.length) % car.images.length;
    setCurrentIndex(newIndex);
    setSelectedImg(car.images[newIndex]);
  };

  const nextImg = () => {
    const newIndex = (currentIndex + 1) % car.images.length;
    setCurrentIndex(newIndex);
    setSelectedImg(car.images[newIndex]);
  };

  return (
    <div className="container">
      <h2>{car.brand} {car.model}</h2>
      <p><strong>Preț:</strong> {car.price} €</p>
      <p><strong>An fabricație:</strong> {car.year}</p>
      <p><strong>Combustibil:</strong> {car.fuel}</p>

      <div className="catalog-grid">
        {car.images?.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:3001${img}`}
            alt={`img-${index}`}
            style={{ cursor: 'pointer', height: '200px', objectFit: 'cover' }}
            onClick={() => openSlider(index)}
          />
        ))}
      </div>

      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
          }}
        >
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} style={arrowBtnStyle}>⬅</button>
          <img
            src={`http://localhost:3001${selectedImg}`}
            alt="fullscreen"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px' }}
          />
          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} style={arrowBtnStyle}>➡</button>
        </div>
      )}
    </div>
  );
}

const arrowBtnStyle = {
  background: 'transparent',
  color: 'white',
  fontSize: '2rem',
  border: 'none',
  cursor: 'pointer',
  margin: '0 1rem',
  userSelect: 'none'
};
