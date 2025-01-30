const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const booksRouter = require('./routes/books');
const weatherRouter = require('./routes/weather'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Подключение к MongoDB'))
  .catch((err) => console.log(err));

app.use('/books', booksRouter);
app.use('/weather', weatherRouter); 

app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
});
