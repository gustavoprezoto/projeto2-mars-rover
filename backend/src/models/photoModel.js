const { getDb } = require('./db');

function searchPhotos({ rover, camera, earth_date, page = 1, limit = 20 }) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const params = [];
    let where = 'WHERE 1=1';

    if (rover) {
      where += ' AND rover = ?';
      params.push(rover);
    }
    if (camera && camera !== 'all') {
      where += ' AND camera = ?';
      params.push(camera);
    }
    if (earth_date) {
      where += ' AND earth_date = ?';
      params.push(earth_date);
    }

    const offset = (page - 1) * limit;

    db.all(
      `SELECT * FROM photos ${where} ORDER BY id LIMIT ? OFFSET ?`,
      [...params, limit, offset],
      (err, rows) => {
        if (err) {
          return reject(err);
        }
        db.get(
          `SELECT COUNT(*) as total FROM photos ${where}`,
          params,
          (err2, row) => {
            if (err2) {
              return reject(err2);
            }
            resolve({ rows, total: row.total });
          }
        );
      }
    );
  });
}

function insertPhoto({ rover, camera, img_src, earth_date, sol }) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO photos (rover, camera, img_src, earth_date, sol) VALUES (?, ?, ?, ?, ?)',
      [rover, camera, img_src, earth_date, sol],
      function (err) {
        if (err) {
          return reject(err);
        }
        resolve({
          id: this.lastID,
          rover,
          camera,
          img_src,
          earth_date,
          sol,
        });
      }
    );
  });
}

function logEvent({ type, message }) {
  const db = getDb();
  db.run(
    'INSERT INTO logs (type, message) VALUES (?, ?)',
    [type, message],
    (err) => {
      if (err) {
        console.error('Erro ao registrar log:', err);
      }
    }
  );
}

module.exports = {
  searchPhotos,
  insertPhoto,
  logEvent,
};
