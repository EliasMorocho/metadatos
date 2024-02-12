// src/controllers/youtubeController.js
const express = require('express');
const youtubeController = express.Router();
const { searchVideos } = require('../useCases/youtubeUseCase');

// Función para mapear cadenas a valores numéricos
function mapPrecisionLevel(level) {
  const precisionMap = {
    'bajo': 0.2,
    'medio': 0.4,
    'alto': 0.7
  };
  return precisionMap[level.toLowerCase()] || 0.5;
}

youtubeController.get('/youtube/:inputString', async (req, res) => {
  try {
    const inputString = req.params.inputString;
    const precisionLevel = mapPrecisionLevel(req.query.precision);
    const result = await searchVideos(inputString, precisionLevel);

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = youtubeController;
