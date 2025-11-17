import React from 'react';

function PhotoTable({ result }) {
  if (!result) return null;
  if (result.photos.length === 0) {
    return <div className="card">Nenhum resultado encontrado.</div>;
  }

  return (
    <div className="card">
      <h2>Resultados</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rover</th>
            <th>Câmera</th>
            <th>Sol</th>
            <th>Data na Terra</th>
            <th>Imagem</th>
          </tr>
        </thead>
        <tbody>
          {result.photos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.rover}</td>
              <td>{p.camera}</td>
              <td>{p.sol}</td>
              <td>{p.earth_date}</td>
              <td>
                <a href={p.img_src} target="_blank" rel="noreferrer">
                  abrir
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Página {result.page} • Total: {result.total}</p>
    </div>
  );
}

export default PhotoTable;
