// export class Ajax {
//     get(url, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url);
//         xhr.send();

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     post(url, data, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', url);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.send(JSON.stringify(data));

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     patch(url, data, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('PATCH', url);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.send(JSON.stringify(data));

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     delete(url, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('DELETE', url);
//         xhr.send();

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     _handleResponse(xhr, callback) {
//         let data = null;
//         if (xhr.responseText) {
//             try {
//                 data = JSON.parse(xhr.responseText);
//             } catch (e) {
//                 console.error('Ошибка парсинга JSON:', e);
//             }
//         }
//         callback(data, xhr.status);
//     }
// }

// export const ajax = new Ajax();




// export class Ajax {
//     get(url, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url);
//         xhr.send();

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     post(url, data, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', url);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.send(JSON.stringify(data));

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     patch(url, data, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('PATCH', url);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         xhr.send(JSON.stringify(data));

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     delete(url, callback) {
//         const xhr = new XMLHttpRequest();
//         xhr.open('DELETE', url);
//         xhr.send();

//         xhr.onreadystatechange = () => {
//             if (xhr.readyState === 4) {
//                 this._handleResponse(xhr, callback);
//             }
//         };
//     }

//     _handleResponse(xhr, callback) {
//         let data = null;
//         if (xhr.responseText) {
//             try {
//                 data = JSON.parse(xhr.responseText);
//             } catch (e) {
//                 console.error('Ошибка парсинга JSON:', e);
//             }
//         }
//         callback(data, xhr.status);
//     }
// }

// export const ajax = new Ajax();



class Ajax {
    /**
     * GET запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * POST запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для отправки
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    // post(url, data, callback) {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', url);
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send(JSON.stringify(data));

    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState === 4) {
    //             this._handleResponse(xhr, callback);
    //         }
    //     };
    // }

        post(url, data, callback) {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => res.json().then(data => callback(data, res.status))).catch(err => callback(err, 0));
    }









    /**
     * PATCH запрос
     * @param {string} url - Адрес запроса
     * @param {object} data - Данные для обновления
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    // patch(url, data, callback) {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('PATCH', url);
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.send(JSON.stringify(data));

    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState === 4) {
    //             this._handleResponse(xhr, callback);
    //         }
    //     };
    // }
    patch(url, data, callback) {
        fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }).then(res => res.json().then(data => callback(data, res.status))).catch(err => callback(err, 0));
    }
    /**
     * DELETE запрос
     * @param {string} url - Адрес запроса
     * @param {function} callback - Функция обратного вызова (data, status)
     */
    // delete(url, callback) {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('DELETE', url);
    //     xhr.send();

    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState === 4) {
    //             this._handleResponse(xhr, callback);
    //         }
    //     };
    // }

        delete(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }


    /**
     * Обработчик ответа (приватный метод)
     * @param {XMLHttpRequest} xhr - Объект запроса
     * @param {function} callback - Функция обратного вызова
     */
    _handleResponse(xhr, callback) {
        try {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            callback(data, xhr.status);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            callback(null, xhr.status);
        }
    }
}

export const ajax = new Ajax();