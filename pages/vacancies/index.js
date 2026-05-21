// import { VacancyCardComponent } from "../../components/vacancy-card/index.js";
// import { VacancyDetailPage } from "../vacancy-detail/index.js";
// import { HeaderComponent } from "../../components/header/index.js";
// import { ajax } from "../../modules/ajax.js";
// import { apiUrls } from "../../modules/urls.js";

// export class VacanciesPage {
//     constructor(parent) {
//         this.parent = parent;
//         this.filterText = '';
//         this.vacanciesData = [];
//         this.mergeStates = {};
//     }

//     // ========== ФУНКЦИИ АНАЛИЗА ЗАРПЛАТ ==========
//     extractSalaryNumber(salaryString) {
//         const match = salaryString?.match(/\d+/g);
//         if (match) {
//             return parseInt(match.join(''));
//         }
//         return 0;
//     }

//     findCouple(array, number) {
//         const result = [];
//         const usedIndices = new Set();

//         for (let i = 0; i < array.length; i++) {
//             if (usedIndices.has(i)) continue;
//             for (let j = i + 1; j < array.length; j++) {
//                 if (usedIndices.has(j)) continue;
//                 if (array[i] + array[j] === number) {
//                     const pairStr = array[i] <= array[j] ? `${array[i]}+${array[j]}` : `${array[j]}+${array[i]}`;
//                     result.push(pairStr);
//                     usedIndices.add(i);
//                     usedIndices.add(j);
//                     break;
//                 }
//             }
//         }
//         return result;
//     }

//     analyzeSalaryPairs(targetSum) {
//         const jobsWithSalaries = this.vacanciesData.map(job => {
//             const salaryItem = job.accordionData?.find(item => item.title === "Заработная плата");
//             const salaryNumber = salaryItem ? this.extractSalaryNumber(salaryItem.content) : 0;
//             return {
//                 title: job.title,
//                 salary: salaryNumber,
//                 salaryString: salaryItem ? salaryItem.content : "0 руб."
//             };
//         });

//         const salaries = jobsWithSalaries.map(job => job.salary);
//         const numberPairs = this.findCouple(salaries, targetSum);
        
//         const result = [];
//         const usedJobs = new Set();
        
//         for (const pair of numberPairs) {
//             const [salary1, salary2] = pair.split('+').map(Number);
//             const job1 = jobsWithSalaries.find(job => job.salary === salary1 && !usedJobs.has(job.title));
//             const job2 = jobsWithSalaries.find(job => job.salary === salary2 && job.title !== job1?.title && !usedJobs.has(job.title));
            
//             if (job1 && job2 && !usedJobs.has(job1.title) && !usedJobs.has(job2.title)) {
//                 result.push(`${job1.title} (${job1.salaryString}) + ${job2.title} (${job2.salaryString})`);
//                 usedJobs.add(job1.title);
//                 usedJobs.add(job2.title);
//             }
//         }
//         return result;
//     }

//     showSalaryAnalysisForCard(cardId) {
//         const resultDiv = document.getElementById(`analysis-result-${cardId}`);
//         if (!resultDiv) return;
        
//         resultDiv.innerHTML = `
//             <div style="margin-top: 5px;">
//                 <input type="number" id="sum-input-${cardId}" placeholder="Введите сумму" style="width: 100%; padding: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
//                 <button id="find-pairs-${cardId}" style="width: 100%; padding: 5px; background: #BA2E3A; color: white; border: none; border-radius: 4px; font-size: 12px;">Найти пары</button>
//                 <div id="pairs-output-${cardId}" style="margin-top: 5px;"></div>
//             </div>
//         `;
        
//         const findBtn = document.getElementById(`find-pairs-${cardId}`);
//         if (findBtn) {
//             findBtn.onclick = () => {
//                 const sumInput = document.getElementById(`sum-input-${cardId}`);
//                 const sum = parseInt(sumInput.value);
//                 const outputDiv = document.getElementById(`pairs-output-${cardId}`);
                
//                 if (!sum) {
//                     outputDiv.innerHTML = '<div style="color: red;">Введите число</div>';
//                     return;
//                 }
                
//                 const pairs = this.analyzeSalaryPairs(sum);
//                 if (pairs.length === 0) {
//                     outputDiv.innerHTML = '<div style="color: gray;">Пары не найдены</div>';
//                 } else {
//                     outputDiv.innerHTML = pairs.map(p => `<div style="padding: 5px 0; border-bottom: 1px solid #eee;">✓ ${p}</div>`).join('');
//                 }
//             };
//         }
//     }

//     // ========== ФУНКЦИЯ MERGE ==========
//     merge(...objects) {
//         const result = {};
//         const usedSalaries = new Set();
//         for (const obj of objects) {
//             for (const key in obj) {
//                 const salary = obj[key];
//                 if (!usedSalaries.has(salary)) {
//                     result[key] = salary;
//                     usedSalaries.add(salary);
//                 }
//             }
//         }
//         return result;
//     }

//     showMergeDemoForCard(cardId) {
//         if (this.mergeStates[cardId]) {
//             const resultDiv = document.getElementById(`merge-result-${cardId}`);
//             if (resultDiv) resultDiv.innerHTML = '';
//             this.mergeStates[cardId] = false;
//             return;
//         }
        
//         const webDeveloper = { "Веб-разработчик": "90 000 руб." };
//         const graphicDesigner = { "Графический дизайнер": "70 000 руб." };
//         const manager = { "Менеджер по работе с клиентами": "60 000 руб." };
//         const smmManager = { "SMM-менеджер": "50 000 руб." };
//         const copywriter = { "Копирайтер / Контент-менеджер": "60 000 руб." };
//         const analyst = { "Аналитик данных": "85 000 руб." };
//         const devops = { "DevOps инженер": "110 000 руб." };

//         const allSalaries = this.merge(webDeveloper, graphicDesigner, manager, smmManager, copywriter, analyst, devops);
        
//         const resultDiv = document.getElementById(`merge-result-${cardId}`);
//         if (resultDiv) {
//             resultDiv.innerHTML = `
//                 <div style="background: rgb(196, 177, 158); padding: 10px; border-radius: 8px; margin-top: 10px;">
//                     <strong style="color: #8c222b;">Результат merge():</strong><br>
//                     ${Object.entries(allSalaries).map(([key, value], index) => 
//                         `<span style="display: inline-block; margin: 3px 0;">${index + 1}. ${key}: ${value}</span><br>`
//                     ).join('')}
//                 </div>
//             `;
//         }
//         this.mergeStates[cardId] = true;
//     }

//     // ========== РАБОТА С API ==========
//     get pageRoot() {
//         return document.getElementById('vacancies-container');
//     }

//     getHTML() {
//         return `
//             <div id="main-page">
//                 <div class="container">
//                     <div class="row mb-4">
//                         <div class="col-md-4">
//                             <input type="text" id="search-input" class="form-control" placeholder="Введите название профессии..." style="background: rgb(252, 247, 241); border: 1px solid #BA2E3A; border-radius: 15px; padding: 10px; color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif;">
//                         </div>
//                         <div class="col-md-2">
//                             <button id="search-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Поиск</button>
//                         </div>
//                         <div class="col-md-2">
//                             <button id="add-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Добавить</button>
//                         </div>
//                         <div class="col-md-2">
                            
//                         </div>
//                     </div>
//                     <div id="vacancies-container" class="d-flex flex-wrap"></div>
//                 </div>
//             </div>
//         `;
//     }
// //<button id="delete-last-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Удалить последнюю</button>
//     loadVacanciesFromApi() {
//         let url = apiUrls.getVacancies();
//         if (this.filterText && this.filterText.trim() !== "") {
//             url += `?title=${encodeURIComponent(this.filterText)}`;
//         }
        
//         ajax.get(url, (data, status) => {
//             if (status === 200 && data) {
//                 this.vacanciesData = data;
//                 this.renderCards();
//             } else {
//                 console.error('Ошибка загрузки:', status);
//                 this.showError();
//             }
//         });
//     }

//     // showError() {
//     //     const container = document.getElementById('vacancies-container');
//     //     if (container) {
//     //         container.innerHTML = `
//     //             <div class="alert alert-danger w-100 text-center" role="alert" style="background: #f8d7da; border-color: #f5c6cb; color: #721c24;">
//     //                 <strong>Ошибка!</strong> Не удалось загрузить вакансии.
//     //                 <br><small>Проверьте: 1) Запущен ли сервер на порту 3000, 2) Настроен ли CORS (порт 3001)</small>
//     //             </div>
//     //         `;
//     //     }
//     // }

//     renderCards() {
//         const cardsContainer = document.getElementById('vacancies-container');
//         if (cardsContainer) {
//             cardsContainer.innerHTML = '';
//             const data = this.vacanciesData;
            
//             data.forEach((item) => {
//                 const vacancyCard = new VacancyCardComponent(cardsContainer);
//                 vacancyCard.render(
//                     item, 
//                     this.clickCard.bind(this), 
//                     this.deleteCard.bind(this),
//                     this.analyzeSalary.bind(this),
//                     this.showMerge.bind(this)
//                 );
//             });
//         }
//     }

//     clickCard(id) {
//         const vacancyDetailPage = new VacancyDetailPage(this.parent, id);
//         vacancyDetailPage.render();
//     }

//     deleteCard(id) {
//     ajax.delete(apiUrls.deleteVacancy(id), (data, status) => {
//         if (status === 204 || status === 200) {
//             this.loadVacanciesFromApi();
//         } else {
//             // alert('Ошибка при удалении');
//         }
//     });
// }

//     // ДОБАВЛЕНИЕ НОВОЙ КАРТОЧКИ (копия первой)
//     addCard() {
//         if (this.vacanciesData.length === 0) {
//             // alert('Нет вакансий для копирования');
//             return;
//         }
        
//         const firstCard = this.vacanciesData[0];
//         const maxId = Math.max(...this.vacanciesData.map(item => item.id));
//         const newId = maxId + 1;
        
//         const newCard = {
//             id: newId,
//             title: `${firstCard.title} (копия)`,
//             text: firstCard.text,
//             city: firstCard.city || "Не указан",
//             accordionData: JSON.parse(JSON.stringify(firstCard.accordionData))
//         };
        
//         ajax.post(apiUrls.createVacancy(), newCard, (data, status) => {
//             if (status === 201) {
//                 this.loadVacanciesFromApi();
//             } else {
//                 // alert('Ошибка при добавлении вакансии');
//             }
//         });
//     }

//     // УДАЛЕНИЕ ПОСЛЕДНЕЙ КАРТОЧКИ
//     deleteLastCard() {
//         if (this.vacanciesData.length === 0) {
//             // alert('Нет вакансий для удаления');
//             return;
//         }
        
//         const lastCard = this.vacanciesData[this.vacanciesData.length - 1];
        
//         // if (confirm(`Удалить последнюю вакансию "${lastCard.title}"?`)) {
//         //     ajax.delete(apiUrls.deleteVacancy(lastCard.id), (data, status) => {
//         //         if (status === 204 || status === 200) {
//         //             this.loadVacanciesFromApi();
//         //         } else {
//         //             alert('Ошибка при удалении');
//         //         }
//         //     });
//         // }
//     }

//     analyzeSalary(cardId) {
//         this.showSalaryAnalysisForCard(cardId);
//     }

//     showMerge(cardId) {
//         this.showMergeDemoForCard(cardId);
//     }

//     performSearch() {
//         const searchInput = document.getElementById('search-input');
//         if (searchInput) {
//             this.filterText = searchInput.value;
//             this.loadVacanciesFromApi();
//         }
//     }

//     resetSearch() {
//         const searchInput = document.getElementById('search-input');
//         if (searchInput) {
//             searchInput.value = '';
//             this.filterText = '';
//             this.loadVacanciesFromApi();
//         }
//     }

//     setupEventListeners() {
//         const searchButton = document.getElementById('search-button');
//         if (searchButton) {
//             searchButton.addEventListener('click', () => this.performSearch());
//         }

//         const addButton = document.getElementById('add-button');
//         if (addButton) {
//             addButton.addEventListener('click', () => this.addCard());
//         }

//         const deleteLastButton = document.getElementById('delete-last-button');
//         if (deleteLastButton) {
//             deleteLastButton.addEventListener('click', () => this.deleteLastCard());
//         }

//         const searchInput = document.getElementById('search-input');
//         if (searchInput) {
//             searchInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') this.performSearch();
//             });
//         }
//     }

//     clickHome() {
//         this.resetSearch();
//         this.render();
//     }

//     render() {
//         this.parent.innerHTML = '';
        
//         const header = new HeaderComponent(this.parent);
//         header.render(this.clickHome.bind(this));
        
//         const html = this.getHTML();
//         this.parent.insertAdjacentHTML('beforeend', html);
        
//         this.loadVacanciesFromApi();
//         this.setupEventListeners();
//     }
// }



import { VacancyCardComponent } from "../../components/vacancy-card/index.js";
import { VacancyDetailPage } from "../vacancy-detail/index.js";
import { HeaderComponent } from "../../components/header/index.js";
import { ajax } from "../../modules/ajax.js";
import { apiUrls } from "../../modules/urls.js";
import { VacancyFormPage } from "../vacancy-form/index.js";

export class VacanciesPage {
    constructor(parent) {
        this.parent = parent;
        this.filterText = '';
        this.vacanciesData = [];
        this.mergeStates = {};
    }

    // ========== ФУНКЦИИ АНАЛИЗА ЗАРПЛАТ ==========
    extractSalaryNumber(salaryString) {
        const match = salaryString?.match(/\d+/g);
        if (match) {
            return parseInt(match.join(''));
        }
        return 0;
    }

    findCouple(array, number) {
        const result = [];
        const usedIndices = new Set();

        for (let i = 0; i < array.length; i++) {
            if (usedIndices.has(i)) continue;
            for (let j = i + 1; j < array.length; j++) {
                if (usedIndices.has(j)) continue;
                if (array[i] + array[j] === number) {
                    const pairStr = array[i] <= array[j] ? `${array[i]}+${array[j]}` : `${array[j]}+${array[i]}`;
                    result.push(pairStr);
                    usedIndices.add(i);
                    usedIndices.add(j);
                    break;
                }
            }
        }
        return result;
    }

    analyzeSalaryPairs(targetSum) {
        const jobsWithSalaries = this.vacanciesData.map(job => {
            const salaryItem = job.accordionData?.find(item => item.title === "Заработная плата");
            const salaryNumber = salaryItem ? this.extractSalaryNumber(salaryItem.content) : 0;
            return {
                title: job.title,
                salary: salaryNumber,
                salaryString: salaryItem ? salaryItem.content : "0 руб."
            };
        });

        const salaries = jobsWithSalaries.map(job => job.salary);
        const numberPairs = this.findCouple(salaries, targetSum);
        
        const result = [];
        const usedJobs = new Set();
        
        for (const pair of numberPairs) {
            const [salary1, salary2] = pair.split('+').map(Number);
            const job1 = jobsWithSalaries.find(job => job.salary === salary1 && !usedJobs.has(job.title));
            const job2 = jobsWithSalaries.find(job => job.salary === salary2 && job.title !== job1?.title && !usedJobs.has(job.title));
            
            if (job1 && job2 && !usedJobs.has(job1.title) && !usedJobs.has(job2.title)) {
                result.push(`${job1.title} (${job1.salaryString}) + ${job2.title} (${job2.salaryString})`);
                usedJobs.add(job1.title);
                usedJobs.add(job2.title);
            }
        }
        return result;
    }

    showSalaryAnalysisForCard(cardId) {
        const resultDiv = document.getElementById(`analysis-result-${cardId}`);
        if (!resultDiv) return;
        
        resultDiv.innerHTML = `
            <div style="margin-top: 5px;">
                <input type="number" id="sum-input-${cardId}" placeholder="Введите сумму" style="width: 100%; padding: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
                <button id="find-pairs-${cardId}" style="width: 100%; padding: 5px; background: #BA2E3A; color: white; border: none; border-radius: 4px; font-size: 12px;">Найти пары</button>
                <div id="pairs-output-${cardId}" style="margin-top: 5px;"></div>
            </div>
        `;
        
        const findBtn = document.getElementById(`find-pairs-${cardId}`);
        if (findBtn) {
            findBtn.onclick = () => {
                const sumInput = document.getElementById(`sum-input-${cardId}`);
                const sum = parseInt(sumInput.value);
                const outputDiv = document.getElementById(`pairs-output-${cardId}`);
                
                if (!sum) {
                    outputDiv.innerHTML = '<div style="color: red;">Введите число</div>';
                    return;
                }
                
                const pairs = this.analyzeSalaryPairs(sum);
                if (pairs.length === 0) {
                    outputDiv.innerHTML = '<div style="color: gray;">Пары не найдены</div>';
                } else {
                    outputDiv.innerHTML = pairs.map(p => `<div style="padding: 5px 0; border-bottom: 1px solid #eee;">✓ ${p}</div>`).join('');
                }
            };
        }
    }

    // ========== ФУНКЦИЯ MERGE ==========
    merge(...objects) {
        const result = {};
        const usedSalaries = new Set();
        for (const obj of objects) {
            for (const key in obj) {
                const salary = obj[key];
                if (!usedSalaries.has(salary)) {
                    result[key] = salary;
                    usedSalaries.add(salary);
                }
            }
        }
        return result;
    }

    showMergeDemoForCard(cardId) {
        if (this.mergeStates[cardId]) {
            const resultDiv = document.getElementById(`merge-result-${cardId}`);
            if (resultDiv) resultDiv.innerHTML = '';
            this.mergeStates[cardId] = false;
            return;
        }
        
        const webDeveloper = { "Веб-разработчик": "90 000 руб." };
        const graphicDesigner = { "Графический дизайнер": "70 000 руб." };
        const manager = { "Менеджер по работе с клиентами": "60 000 руб." };
        const smmManager = { "SMM-менеджер": "50 000 руб." };
        const copywriter = { "Копирайтер / Контент-менеджер": "60 000 руб." };
        const analyst = { "Аналитик данных": "85 000 руб." };
        const devops = { "DevOps инженер": "110 000 руб." };

        const allSalaries = this.merge(webDeveloper, graphicDesigner, manager, smmManager, copywriter, analyst, devops);
        
        const resultDiv = document.getElementById(`merge-result-${cardId}`);
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div style="background: rgb(196, 177, 158); padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <strong style="color: #8c222b;">Результат merge():</strong><br>
                    ${Object.entries(allSalaries).map(([key, value], index) => 
                        `<span style="display: inline-block; margin: 3px 0;">${index + 1}. ${key}: ${value}</span><br>`
                    ).join('')}
                </div>
            `;
        }
        this.mergeStates[cardId] = true;
    }

    // ========== РАБОТА С API ==========
    get pageRoot() {
        return document.getElementById('vacancies-container');
    }

    getHTML() {
        return `
            <div id="main-page">
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <input type="text" id="search-input" class="form-control" placeholder="Введите название профессии..." style="background: rgb(252, 247, 241); border: 1px solid #BA2E3A; border-radius: 15px; padding: 10px; color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif;">
                        </div>
                        <div class="col-md-2">
                            <button id="search-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Поиск</button>
                        </div>
                        <div class="col-md-2">
                            <button id="add-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Добавить</button>
                        </div>
                        <div class="col-md-2">
                            
                        </div>
                    </div>
                    <div id="vacancies-container" class="d-flex flex-wrap"></div>
                </div>
            </div>
        `;
    }

    loadVacanciesFromApi() {
        let url = apiUrls.getVacancies();
        if (this.filterText && this.filterText.trim() !== "") {
            url += `?title=${encodeURIComponent(this.filterText)}`;
        }
        
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.vacanciesData = data;
                this.renderCards();
            } else {
                console.error('Ошибка загрузки:', status);
                this.showError();
            }
        });
    }

    showError() {
        const container = document.getElementById('vacancies-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger w-100 text-center" role="alert" style="background: #f8d7da; border-color: #f5c6cb; color: #721c24;">
                    <strong>Ошибка!</strong> Не удалось загрузить вакансии.
                    <br><small>Проверьте: 1) Запущен ли сервер на порту 3000, 2) Настроен ли CORS (порт 3001)</small>
                </div>
            `;
        }
    }

    renderCards() {
        const cardsContainer = document.getElementById('vacancies-container');
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
            const data = this.vacanciesData;
            
            data.forEach((item) => {
                const vacancyCard = new VacancyCardComponent(cardsContainer);
                vacancyCard.render(
                    item, 
                    this.clickCard.bind(this), 
                    this.deleteCard.bind(this),
                    this.analyzeSalary.bind(this),
                    this.showMerge.bind(this),
                    this.editCard.bind(this)
                );
            });
        }
    }

    clickCard(id) {
        const vacancyDetailPage = new VacancyDetailPage(this.parent, id);
        vacancyDetailPage.render();
    }
    
    editCard(id) {
        const vacancyToEdit = this.vacanciesData.find(v => v.id === id);
        if (vacancyToEdit) {
            const editPage = new VacancyFormPage(this.parent, 'edit', vacancyToEdit);
            editPage.render();
        }
    }

    deleteCard(id) {
        ajax.delete(apiUrls.deleteVacancy(id), (data, status) => {
            if (status === 204 || status === 200) {
                this.loadVacanciesFromApi();
            } else {
                alert('Ошибка при удалении');
            }
        });
    }

    addCard() {
        const createPage = new VacancyFormPage(this.parent, 'create', null);
        createPage.render();
    }

    deleteLastCard() {
        if (this.vacanciesData.length === 0) {
            alert('Нет вакансий для удаления');
            return;
        }
        
        const lastCard = this.vacanciesData[this.vacanciesData.length - 1];
        
        if (confirm(`Удалить последнюю вакансию "${lastCard.title}"?`)) {
            ajax.delete(apiUrls.deleteVacancy(lastCard.id), (data, status) => {
                if (status === 204 || status === 200) {
                    this.loadVacanciesFromApi();
                } else {
                    alert('Ошибка при удалении');
                }
            });
        }
    }

    analyzeSalary(cardId) {
        this.showSalaryAnalysisForCard(cardId);
    }

    showMerge(cardId) {
        this.showMergeDemoForCard(cardId);
    }

    performSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            this.filterText = searchInput.value;
            this.loadVacanciesFromApi();
        }
    }

    resetSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
            this.filterText = '';
            this.loadVacanciesFromApi();
        }
    }

    setupEventListeners() {
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.performSearch());
        }

        const addButton = document.getElementById('add-button');
        if (addButton) {
            addButton.addEventListener('click', () => this.addCard());
        }

        const deleteLastButton = document.getElementById('delete-last-button');
        if (deleteLastButton) {
            deleteLastButton.addEventListener('click', () => this.deleteLastCard());
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }
    }

    clickHome() {
        this.resetSearch();
        this.render();
    }

    render() {
        this.parent.innerHTML = '';
        
        const header = new HeaderComponent(this.parent);
        header.render(this.clickHome.bind(this));
        
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        
        this.loadVacanciesFromApi();
        this.setupEventListeners();
    }
}