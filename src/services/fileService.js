// //Бизнес-логика (Service layer)  


// // Подключаем встроенный модуль fs для работы с файловой системой
// const fs = require('fs');

// /**
//  * Функция для чтения данных из JSON-файла
//  * @param {string} filePath - путь к файлу
//  * @returns {Array} - массив данных из файла
//  */

// const readData = (filePath) => {
//     try {
//         // Синхронно читаем файл в кодировке utf8
//         const data = fs.readFileSync(filePath, 'utf8');
//         // Парсим JSON строку в JavaScript объект
//         return JSON.parse(data);
//     } catch (err) {
//         // Если произошла ошибка, выводим её в консоль
//         console.error('Ошибка чтения файла:', err);
//         // Возвращаем пустой массив, чтобы приложение не упало
//         return [];
//     }
// };

// /**
//  * Функция для записи данных в JSON-файл
//  * @param {string} filePath - путь к файлу
//  * @param {Array} data - данные для записи
//  */
// const writeData = (filePath, data) => {
//     try {
//         // Преобразуем данные в JSON строку с отступами в 2 пробела для читаемости
//         const jsonString = JSON.stringify(data, null, 2); //*
//         // Записываем в файл
//         fs.writeFileSync(filePath, jsonString, 'utf8');
//         console.log('Данные успешно сохранены');
//     } catch (err) {
//         console.error('Ошибка записи файла:', err);
//     }
// };

// // Экспортируем функции для использования в других файлах
// module.exports = {
//     readData,
//     writeData
// };




//Бизнес-логика (Service layer)  

// Подключаем встроенный модуль fs для работы с файловой системой
const fs = require('fs');

/**
 * Функция для чтения данных из JSON-файла
 * @param {string} filePath - путь к файлу
 * @returns {Array} - массив данных из файла
 */

const readData = (filePath) => {
    console.log('=== readData ===');
    console.log('Входной путь:', filePath);
    console.log('Заканчивается на .json?', filePath ? filePath.endsWith('.json') : 'path is null');
    
    try {
        // Синхронно читаем файл в кодировке utf8
        const data = fs.readFileSync(filePath, 'utf8');
        // Парсим JSON строку в JavaScript объект
        console.log('✅ Файл прочитан успешно');
        return JSON.parse(data);
    } catch (err) {
        // Если произошла ошибка, выводим её в консоль
        console.error('❌ Ошибка чтения файла:', err.message);
        // Возвращаем пустой массив, чтобы приложение не упало
        return [];
    }
};

/**
 * Функция для записи данных в JSON-файл
 * @param {string} filePath - путь к файлу
 * @param {Array} data - данные для записи
 */
const writeData = (filePath, data) => {
    console.log('=== writeData ===');
    console.log('Входной путь:', filePath);
    console.log('Заканчивается на .json?', filePath ? filePath.endsWith('.json') : 'path is null');
    console.log('Количество записываемых элементов:', data.length);
    
    try {
        // Преобразуем данные в JSON строку с отступами в 2 пробела для читаемости
        const jsonString = JSON.stringify(data, null, 2);
        // Записываем в файл
        fs.writeFileSync(filePath, jsonString, 'utf8');
        console.log('✅ Данные успешно сохранены в:', filePath);
    } catch (err) {
        console.error('❌ Ошибка записи файла:', err.message);
    }
};

// Экспортируем функции для использования в других файлах
module.exports = {
    readData,
    writeData
};