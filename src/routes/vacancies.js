// Маршруты (Router layer) для вакансий

// Подключаем Router из Express
const express = require('express');
const router = express.Router();

// Подключаем контроллер
const vacanciesController = require('../controllers/vacanciesController');

// Определяем маршруты
// GET /vacancies - получение всех вакансий (с фильтрацией)
router.get('/', vacanciesController.getAllVacancies);

// GET /vacancies/:id - получение одной вакансии
router.get('/:id', vacanciesController.getVacancyById);

// POST /vacancies - создание новой вакансии
router.post('/', vacanciesController.createVacancy);

// PATCH /vacancies/:id - обновление вакансии
router.patch('/:id', vacanciesController.updateVacancy);

// DELETE /vacancies/:id - удаление вакансии
router.delete('/:id', vacanciesController.deleteVacancy);

// Экспортируем роутер
module.exports = router;