const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const booksRouter = require('./routes/books');
const weatherRouter = require('./routes/weather');
const { router: authRoutes, authenticateJWT } = require("./routes/auth");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const Book = require("./models/book"); // Добавляем модель

dotenv.config(); // Загружаем переменные окружения

const cache = new NodeCache({ stdTTL: 60 });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});

// Кеширование ответов
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);
  if (cachedResponse) {
    return res.json(cachedResponse);
  }
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
};

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Подключение к MongoDB успешно!'))
  .catch((err) => console.log('❌ Ошибка подключения к MongoDB:', err));

// Лимит запросов
app.use(limiter);

// Роуты
app.use('/books', authenticateJWT, booksRouter);
app.use('/weather', weatherRouter);
app.use('/auth', authRoutes);

// Кешируем `GET /books`
app.get("/books", cacheMiddleware, (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(500).json({ message: "Ошибка при получении книг" }));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер работает на порту ${PORT}`);
});
