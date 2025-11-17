const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const { DB_PATH } = require('../config/dbConfig');

let db;

function initDb() {
  if (db) return db;

  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Erro ao abrir o banco de dados:', err);
      return;
    }
    console.log('Banco de dados SQLite conectado em', DB_PATH);
  });

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rover TEXT NOT NULL,
      camera TEXT NOT NULL,
      img_src TEXT NOT NULL,
      earth_date TEXT NOT NULL,
      sol INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`);

    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) {
        console.error('Erro ao contar usuários:', err);
        return;
      }
      if (row.count === 0) {
        const password = '123456';
        const hash = bcrypt.hashSync(password, 10);
        db.run(
          'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
          ['Admin', 'admin@example.com', hash],
          (err) => {
            if (err) {
              console.error('Erro ao inserir usuário padrão:', err);
            } else {
              console.log('Usuário padrão criado: admin@example.com / 123456');
            }
          }
        );
      }
    });

    db.get('SELECT COUNT(*) as count FROM photos', (err, row) => {
      if (err) {
        console.error('Erro ao contar fotos:', err);
        return;
      }
      if (row.count === 0) {
        const samplePhotos = [
          ['curiosity', 'FHAZ', 'https://example.com/curiosity1.jpg', '2015-05-30', 1010],
          ['curiosity', 'RHAZ', 'https://example.com/curiosity2.jpg', '2015-06-01', 1012],
          ['opportunity', 'NAVCAM', 'https://example.com/opportunity1.jpg', '2010-03-14', 2200],
          ['spirit', 'PANCAM', 'https://example.com/spirit1.jpg', '2007-11-03', 1350],
        ];

        const stmt = db.prepare(
          'INSERT INTO photos (rover, camera, img_src, earth_date, sol) VALUES (?, ?, ?, ?, ?)'
        );

        samplePhotos.forEach((p) => stmt.run(p));
        stmt.finalize();
        console.log('Fotos de exemplo inseridas no banco.');
      }
    });
  });

  return db;
}

function getDb() {
  if (!db) {
    initDb();
  }
  return db;
}

module.exports = {
  initDb,
  getDb,
};
