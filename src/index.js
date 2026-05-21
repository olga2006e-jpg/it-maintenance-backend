// Точка входа (Server setup) 

// Подключаем необходимые модули
const express = require('express');
const path = require('path');

// Подключаем наши модули
const vacanciesRouter = require('./routes/vacancies');
const vacanciesService = require('./services/vacanciesService');

// Создаем экземпляр приложения Express
const app = express();

// Определяем порт, на котором будет работать сервер
const PORT = 3000;

// Определяем путь к файлу с данными
const DATA_FILE_PATH = path.join(__dirname, 'data/vacancies.json');

// Инициализируем сервис с путем к файлу данных
vacanciesService.init(DATA_FILE_PATH);

// ============= MIDDLEWARE =============

// 1. Встроенный middleware для парсинга JSON тела запроса
// Без этого req.body будет undefined
app.use(express.json());


app.use(express.text({ type: 'text/plain' }));

app.use((req, res, next) => {
    if (req.is('text/plain') && req.body && typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body);
        } catch (e) {}
    }
    next();
});

// // Обработка OPTIONS запросов (preflight) для CORS Unblock
app.options('*', (req, res) => {
    res.sendStatus(200);
});


// app.use(express.urlencoded({ extended: true }));
// 2. Простой обработчик OPTIONS запросов (preflight) - ЭТО ГЛАВНОЕ!
// app.options('*', (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.sendStatus(200);  // ← Важно: отправляем 200
// });
// app.options('*', (req, res) => {
//     res.sendStatus(200);  // Просто отвечаем, CORS Unblock добавит заголовки
// });
// 2. CORS middleware для разработки (фронтенд на 8080)
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// 3. Простой обработчик для корневого маршрута
app.get('/', (req, res) => {
    res.send('Express сервер работает! API для вакансий доступен по адресу /vacancies');
});

// 4. Middleware для логирования всех запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Передаем управление следующему middleware
});

// 5. Подключаем маршруты для работы с вакансиями
// Все маршруты будут доступны по префиксу /vacancies
app.use('/vacancies', vacanciesRouter);

// ============= ОБРАБОТКА ОШИБОК =============

// 6. Обработчик для несуществующих маршрутов (404)
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Маршрут не найден',
        message: `Маршрут ${req.method} ${req.url} не существует`
    });
});

// 7. Централизованный обработчик ошибок (500)
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера',
        message: err.message 
    });
});

// ============= ЗАПУСК СЕРВЕРА =============

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`\n🚀 Сервер успешно запущен!`);
    console.log(`📍 Адрес: http://localhost:${PORT}`);
    console.log(`📦 Данные загружены из: ${DATA_FILE_PATH}`);
    console.log(`\nДоступные эндпоинты:`);
    console.log(`  GET    /vacancies              - список всех вакансий`);
    console.log(`  GET    /vacancies?title=...    - поиск по названию`);
    console.log(`  GET    /vacancies/:id          - вакансия по ID`);
    console.log(`  POST   /vacancies              - создать вакансию`);
    console.log(`  PATCH  /vacancies/:id          - обновить вакансию`);
    console.log(`  DELETE /vacancies/:id          - удалить вакансию\n`);
});