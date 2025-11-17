import React, { useState } from 'react';

function InsertForm({ onInsert, loading }) {
  const [rover, setRover] = useState('curiosity');
  const [camera, setCamera] = useState('FHAZ');
  const [imgSrc, setImgSrc] = useState('https://example.com/nova-foto.jpg');
  const [earthDate, setEarthDate] = useState('2020-01-01');
  const [sol, setSol] = useState(1000);

  function handleSubmit(e) {
    e.preventDefault();
    onInsert({
      rover,
      camera,
      img_src: imgSrc,
      earth_date: earthDate,
      sol: Number(sol),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Inserir nova foto</h2>
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
            <option value="FHAZ">FHAZ</option>
            <option value="RHAZ">RHAZ</option>
            <option value="NAVCAM">NAVCAM</option>
            <option value="PANCAM">PANCAM</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div>
          <label>URL da imagem</label>
          <input
            type="url"
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div>
          <label>Data na Terra</label>
          <input
            type="date"
            value={earthDate}
            onChange={(e) => setEarthDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sol</label>
          <input
            type="number"
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Inserir'}
      </button>
    </form>
  );
}

export default InsertForm;
