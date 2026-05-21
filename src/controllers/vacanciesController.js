
const vacanciesService = require('../services/vacanciesService');


const getAllVacancies = (req, res) => {
    try {
        const { title, city } = req.query;
        
        const vacancies = vacanciesService.findAll(title, city);
        
        res.json(vacancies);
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


const getVacancyById = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Некорректный ID' });
        }
        
        const vacancy = vacanciesService.findOne(id);
        
        if (!vacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }
        
        res.json(vacancy);
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


const createVacancy = (req, res) => {
    try {
        const { title, text, city, accordionData } = req.body;
        
        if (!title || !text || !accordionData) {
            return res.status(400).json({ 
                error: 'Не все поля заполнены. Требуются: title, text, accordionData'
            });
        }
        
        if (!Array.isArray(accordionData)) {
            return res.status(400).json({ 
                error: 'accordionData должен быть массивом объектов с полями title и content'
            });
        }
        
        const newVacancy = vacanciesService.create({ title, text, city, accordionData });
        res.status(201).json(newVacancy);
    } catch (error) {
        if (error.message === 'Missing required fields: title, text, or accordionData' ||
            error.message === 'accordionData must be an array') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


const updateVacancy = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Некорректный ID' });
        }
        
        const updateData = req.body;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'Нет данных для обновления' });
        }
        
        const updatedVacancy = vacanciesService.update(id, updateData);
        
        if (!updatedVacancy) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }
        
        res.json(updatedVacancy);
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};


const deleteVacancy = (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Некорректный ID' });
        }
        
        const success = vacanciesService.remove(id);
        
        if (!success) {
            return res.status(404).json({ error: 'Вакансия не найдена' });
        }
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};

module.exports = {
    getAllVacancies,
    getVacancyById,
    createVacancy,
    updateVacancy,
    deleteVacancy
};