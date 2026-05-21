// // Бизнес-логика (Service layer) для вакансий

// // Подключаем наш fileService
// const fileService = require('./fileService');

// // Переменная для хранения пути к файлу с данными
// let dataFilePath;

// /**
//  * Функция инициализации сервиса
//  * Вызывается один раз при запуске приложения
//  * @param {string} filePath - путь к файлу vacancies.json
//  */
// const init = (filePath) => {
//     dataFilePath = filePath;
//     console.log('VacanciesService инициализирован с путем:', dataFilePath);
// };

// /**
//  * Получение всех вакансий с возможностью фильтрации по названию и городу
//  * @param {string} title - опциональный параметр для фильтрации по названию
//  * @param {string} city - опциональный параметр для фильтрации по городу
//  * @returns {Array} - массив вакансий
//  */
// const findAll = (title, city) => {
//     // Читаем все данные из файла
//     let vacancies = fileService.readData(dataFilePath);
    
//     // Фильтрация по названию (если передан параметр title)
//     if (title && title.trim() !== "") {
//         vacancies = vacancies.filter(vacancy => 
//             vacancy.title.toLowerCase().includes(title.toLowerCase())
//         );
//     }
    
//     // Фильтрация по городу (если передан параметр city)
//     if (city && city.trim() !== "") {
//         vacancies = vacancies.filter(vacancy => 
//             vacancy.city && vacancy.city.toLowerCase().includes(city.toLowerCase())
//         );
//     }
    
//     return vacancies;
// };

// /**
//  * Поиск одной вакансии по ID
//  * @param {number} id - идентификатор вакансии
//  * @returns {Object|null} - найденная вакансия или null
//  */
// const findOne = (id) => {
//     const vacancies = fileService.readData(dataFilePath);
//     const vacancy = vacancies.find(vacancy => vacancy.id === id);
//     return vacancy || null;
// };

// /**
//  * Создание новой вакансии
//  * @param {Object} vacancyData - данные новой вакансии (title, text, city, accordionData)
//  * @returns {Object} - созданная вакансия с присвоенным id
//  */
// const create = (vacancyData) => {
//     const vacancies = fileService.readData(dataFilePath);
    
//     // Валидация: проверяем наличие обязательных полей
//     if (!vacancyData.title || !vacancyData.text || !vacancyData.accordionData) {
//         throw new Error('Missing required fields: title, text, or accordionData');
//     }
    
//     // Проверяем, что accordionData - массив
//     if (!Array.isArray(vacancyData.accordionData)) {
//         throw new Error('accordionData must be an array');
//     }
    
//     // Генерируем новый ID
//     let newId;
//     if (vacancies.length === 0) {
//         newId = 1;
//     } else {
//         const maxId = Math.max(...vacancies.map(v => v.id));
//         newId = maxId + 1;
//     }
    
//     // Создаем новую вакансию
//     const newVacancy = {
//         id: newId,
//         city: vacancyData.city || "Не указан", // Если город не указан, ставим "Не указан"
//         ...vacancyData
//     };
    
//     vacancies.push(newVacancy);
//     fileService.writeData(dataFilePath, vacancies);
    
//     return newVacancy;
// };

// /**
//  * Обновление существующей вакансии
//  * @param {number} id - ID вакансии для обновления
//  * @param {Object} vacancyData - новые данные (title, text, city, accordionData)
//  * @returns {Object|null} - обновленная вакансия или null, если не найдена
//  */
// const update = (id, vacancyData) => {
//     const vacancies = fileService.readData(dataFilePath);
//     const index = vacancies.findIndex(v => v.id === id);
    
//     if (index === -1) return null;
    
//     vacancies[index] = {
//         ...vacancies[index],
//         ...vacancyData
//     };
    
//     fileService.writeData(dataFilePath, vacancies);
//     return vacancies[index];
// };

// /**
//  * Удаление вакансии
//  * @param {number} id - ID вакансии для удаления
//  * @returns {boolean} - true если удаление успешно, false если вакансия не найдена
//  */
// const remove = (id) => {
//     const vacancies = fileService.readData(dataFilePath);
//     const originalLength = vacancies.length;
//     const filteredVacancies = vacancies.filter(v => v.id !== id);
    
//     if (filteredVacancies.length === originalLength) {
//         return false;
//     }
    
//     fileService.writeData(dataFilePath, filteredVacancies);
//     return true;
// };

// // Экспортируем все функции
// module.exports = { init, findAll, findOne, create, update, remove };


// Бизнес-логика (Service layer) для вакансий

// Подключаем наш fileService
const fileService = require('./fileService');

// Переменная для хранения пути к файлу с данными
let dataFilePath;

/**
 * Функция инициализации сервиса
 * Вызывается один раз при запуске приложения
 * @param {string} filePath - путь к файлу vacancies.json
 */
const init = (filePath) => {
    dataFilePath = filePath;
    console.log('🟢 VacanciesService инициализирован с путем:', dataFilePath);
    console.log('🟢 Путь заканчивается на .json?', dataFilePath.endsWith('.json'));
};

/**
 * Получение всех вакансий с возможностью фильтрации по названию и городу
 * @param {string} title - опциональный параметр для фильтрации по названию
 * @param {string} city - опциональный параметр для фильтрации по городу
 * @returns {Array} - массив вакансий
 */
const findAll = (title, city) => {
    console.log('🔍 findAll вызван, фильтр title:', title, 'city:', city);
    // Читаем все данные из файла
    let vacancies = fileService.readData(dataFilePath);
    
    // Фильтрация по названию (если передан параметр title)
    if (title && title.trim() !== "") {
        vacancies = vacancies.filter(vacancy => 
            vacancy.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    
    // Фильтрация по городу (если передан параметр city)
    if (city && city.trim() !== "") {
        vacancies = vacancies.filter(vacancy => 
            vacancy.city && vacancy.city.toLowerCase().includes(city.toLowerCase())
        );
    }
    
    console.log('🔍 Найдено вакансий:', vacancies.length);
    return vacancies;
};

/**
 * Поиск одной вакансии по ID
 * @param {number} id - идентификатор вакансии
 * @returns {Object|null} - найденная вакансия или null
 */
const findOne = (id) => {
    console.log('🔍 findOne вызван для id:', id);
    const vacancies = fileService.readData(dataFilePath);
    const vacancy = vacancies.find(vacancy => vacancy.id === id);
    console.log('🔍 Вакансия найдена:', vacancy ? 'да' : 'нет');
    return vacancy || null;
};

/**
 * Создание новой вакансии
 * @param {Object} vacancyData - данные новой вакансии (title, text, city, accordionData)
 * @returns {Object} - созданная вакансия с присвоенным id
 */
const create = (vacancyData) => {
    console.log('🆕 CREATE вызван');
    console.log('🆕 Данные вакансии:', JSON.stringify(vacancyData, null, 2));
    console.log('🆕 Текущий dataFilePath:', dataFilePath);
    
    const vacancies = fileService.readData(dataFilePath);
    console.log('🆕 Текущее количество вакансий:', vacancies.length);
    
    // Валидация: проверяем наличие обязательных полей
    if (!vacancyData.title || !vacancyData.text || !vacancyData.accordionData) {
        throw new Error('Missing required fields: title, text, or accordionData');
    }
    
    // Проверяем, что accordionData - массив
    if (!Array.isArray(vacancyData.accordionData)) {
        throw new Error('accordionData must be an array');
    }
    
    // Генерируем новый ID
    let newId;
    if (vacancies.length === 0) {
        newId = 1;
    } else {
        const maxId = Math.max(...vacancies.map(v => v.id));
        newId = maxId + 1;
    }
    console.log('🆕 Сгенерирован новый ID:', newId);
    
    // Создаем новую вакансию
    const newVacancy = {
        id: newId,
        city: vacancyData.city || "Не указан", // Если город не указан, ставим "Не указан"
        ...vacancyData
    };
    
    vacancies.push(newVacancy);
    console.log('🆕 Сохраняем', vacancies.length, 'вакансий в файл');
    fileService.writeData(dataFilePath, vacancies);
    
    console.log('🆕 CREATE завершён, создана вакансия с id:', newId);
    return newVacancy;
};

/**
 * Обновление существующей вакансии
 * @param {number} id - ID вакансии для обновления
 * @param {Object} vacancyData - новые данные (title, text, city, accordionData)
 * @returns {Object|null} - обновленная вакансия или null, если не найдена
 */
const update = (id, vacancyData) => {
    console.log('✏️ UPDATE вызван для id:', id);
    console.log('✏️ Данные для обновления:', JSON.stringify(vacancyData, null, 2));
    
    const vacancies = fileService.readData(dataFilePath);
    const index = vacancies.findIndex(v => v.id === id);
    
    if (index === -1) {
        console.log('✏️ Вакансия с id', id, 'не найдена');
        return null;
    }
    
    vacancies[index] = {
        ...vacancies[index],
        ...vacancyData
    };
    
    console.log('✏️ Сохраняем обновлённые данные');
    fileService.writeData(dataFilePath, vacancies);
    console.log('✏️ UPDATE завершён');
    return vacancies[index];
};

/**
 * Удаление вакансии
 * @param {number} id - ID вакансии для удаления
 * @returns {boolean} - true если удаление успешно, false если вакансия не найдена
 */
const remove = (id) => {
    console.log('🗑️ REMOVE вызван для id:', id);
    
    const vacancies = fileService.readData(dataFilePath);
    const originalLength = vacancies.length;
    const filteredVacancies = vacancies.filter(v => v.id !== id);
    
    if (filteredVacancies.length === originalLength) {
        console.log('🗑️ Вакансия с id', id, 'не найдена');
        return false;
    }
    
    console.log('🗑️ Сохраняем', filteredVacancies.length, 'вакансий');
    fileService.writeData(dataFilePath, filteredVacancies);
    console.log('🗑️ REMOVE завершён');
    return true;
};

// Экспортируем все функции
module.exports = { init, findAll, findOne, create, update, remove };
