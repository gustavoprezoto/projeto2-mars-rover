const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../models/db');
const { logEvent } = require('../models/photoModel');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const db = getDb();
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
    if (!user) {
      logEvent({ type: 'auth_error', message: `Login falhou para email ${email}: usuário não encontrado` });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      logEvent({ type: 'auth_error', message: `Login falhou para email ${email}: senha incorreta` });
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    logEvent({ type: 'auth_success', message: `Login bem-sucedido para usuário ${email}` });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});

router.post('/logout', (req, res) => {
  logEvent({ type: 'auth_logout', message: 'Logout solicitado pelo cliente' });
  return res.json({ message: 'Logout efetuado no cliente. Remova o token armazenado.' });
});

module.exports = router;
