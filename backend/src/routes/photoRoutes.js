const express = require('express');
const jwt = require('jsonwebtoken');
const { searchPhotos, insertPhoto, logEvent } = require('../models/photoModel');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function getCacheKey(query) {
  const { rover = '', camera = '', earth_date = '', page = '1' } = query;
  return JSON.stringify({ rover, camera, earth_date, page });
}

router.get('/', authMiddleware, async (req, res) => {
  const { rover, camera, earth_date } = req.query;
  const page = parseInt(req.query.page || '1', 10);

  const cacheKey = getCacheKey(req.query);
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return res.json(cached.data);
  }

  try {
    const { rows, total } = await searchPhotos({ rover, camera, earth_date, page });
    const limit = 20;
    const hasMore = page * limit < total;

    const response = {
      photos: rows,
      page,
      total,
      hasMore,
    };

    cache.set(cacheKey, {
      data: response,
      expiresAt: now + CACHE_TTL_MS,
    });

    logEvent({
      type: 'search',
      message: `User ${req.user.email} buscou fotos (rover=${rover || 'any'}, camera=${camera || 'any'}, earth_date=${earth_date || 'any'}, page=${page}).`,
    });

    res.json(response);
  } catch (err) {
    console.error('Erro ao buscar fotos:', err);
    logEvent({
      type: 'search_error',
      message: `Erro ao buscar fotos: ${err.message}`,
    });
    res.status(500).json({ error: 'Erro ao buscar fotos.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { rover, camera, img_src, earth_date, sol } = req.body;

  if (!rover || !camera || !img_src || !earth_date || sol === undefined) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const photo = await insertPhoto({ rover, camera, img_src, earth_date, sol });
    logEvent({
      type: 'insert',
      message: `User ${req.user.email} inseriu nova foto (id=${photo.id}, rover=${photo.rover}).`,
    });
    res.status(201).json(photo);
  } catch (err) {
    console.error('Erro ao inserir foto:', err);
    logEvent({
      type: 'insert_error',
      message: `Erro ao inserir foto: ${err.message}`,
    });
    res.status(500).json({ error: 'Erro ao inserir foto.' });
  }
});

module.exports = router;
