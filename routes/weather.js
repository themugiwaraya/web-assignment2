const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();

router.get('/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.WEATHER_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ message: 'API ключ не найден' });
  }

  try {
    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric', 
        lang: 'ru', 
      },
    });

    const weatherData = {
      city: response.data.name,
      temperature: `${response.data.main.temp}°C`,
      condition: response.data.weather[0].description,
    };

    res.json(weatherData);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при получении данных погоды', error: err.message });
  }
});

module.exports = router;
