const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const loadBooksBtn = document.getElementById('load-books-btn');
const getWeatherBtn = document.getElementById('get-weather-btn');
const weatherInfo = document.getElementById('weather-info');
const bookList = document.getElementById('book-list');
const cityInput = document.getElementById('city');

let token = ''; // Храним JWT токен

// Регистрация пользователя
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  alert(data.message);
});

// Вход пользователя
loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (data.token) {
    token = data.token;
    alert('Login successful');
  } else {
    alert('Invalid credentials');
  }
});

// Загрузка списка книг
loadBooksBtn.addEventListener('click', async () => {
  const response = await fetch('http://localhost:5000/books', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const books = await response.json();
  bookList.innerHTML = ''; // Очищаем список перед добавлением новых данных

  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `${book.title} by ${book.author}`;
    bookList.appendChild(li);
  });
});

// Получение погоды
getWeatherBtn.addEventListener('click', async () => {
  const city = cityInput.value;
  const response = await fetch(`http://localhost:5000/weather/${city}`);
  const data = await response.json();

  if (data.city) {
    weatherInfo.textContent = `Weather in ${data.city}: ${data.temperature}, ${data.condition}`;
  } else {
    weatherInfo.textContent = 'Error fetching weather data';
  }
});
