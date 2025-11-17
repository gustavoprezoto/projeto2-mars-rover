import React, { useState } from 'react';

function SearchForm({ onSearch, loading }) {
  const [rover, setRover] = useState('curiosity');
  const [camera, setCamera] = useState('all');
  const [earthDate, setEarthDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch({
      rover,
      camera,
      earth_date: earthDate,
      page: 1,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1rem' }}>
      <h2>Busca de fotos</h2>
      <div className="form-row">
        <div>
          <label>Rover</label>
          <select value={rover} onChange={(e) => setRover(e.target.value)}>
            <option value="curiosity">Curiosity</option>
            <option value="opportunity">Opportunity</option>
            <option value="spirit">Spirit</option>
          </select>
        </div>
        <div>
          <label>Câmera</label>
          <select value={camera} onChange={(e) => setCamera(e.target.value)}>
            <option value="all">Todas</option>
            <option value="FHAZ">FHAZ</option>
            <option value="RHAZ">RHAZ</option>
            <option value="NAVCAM">NAVCAM</option>
            <option value="PANCAM">PANCAM</option>
          </select>
        </div>
        <div>
          <label>Data na Terra (YYYY-MM-DD)</label>
          <input
            type="date"
            value={earthDate}
            onChange={(e) => setEarthDate(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
}

export default SearchForm;
