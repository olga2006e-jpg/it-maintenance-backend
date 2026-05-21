import { VacancyCardComponent } from "../../components/vacancy-card/index.js";
import { VacancyDetailPage } from "../vacancy-detail/index.js";
import { HeaderComponent } from "../../components/header/index.js";

export class VacanciesPage {
    constructor(parent) {
        this.parent = parent;
        this.filterText = '';
        this.history = [];
        this.historyIndex = -1;
        this.loadData();
        this.mergeStates = {}; // Хранит состояние открыт/закрыт для каждой карточки
    }

    extractSalaryNumber(salaryString) {
        const match = salaryString.match(/\d+/g);
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
                    const pairStr = array[i] <= array[j]
                        ? `${array[i]}+${array[j]}`
                        : `${array[j]}+${array[i]}`;
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
            const salaryItem = job.accordionData.find(item => item.title === "Заработная плата");
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
        // Проверяем текущее состояние для этой карточки
        if (this.mergeStates[cardId]) {
            // Если уже открыто - закрываем (удаляем содержимое)
            const resultDiv = document.getElementById(`merge-result-${cardId}`);
            if (resultDiv) {
                resultDiv.innerHTML = '';
            }
            this.mergeStates[cardId] = false;
            return;
        }
        
        // Если закрыто - открываем (показываем содержимое)
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

    loadData() {
        this.vacanciesData = [
            {
                id: 1,
                title: "Веб-разработчик (удаленно)",
                text: "Создание и поддержка веб-сайтов, работа с современными технологиями",
                accordionData: [
                    { title: "Заработная плата", content: "90 000 руб." },
                    { title: "Необходимый опыт", content: "1-2 года коммерческой разработки" },
                    { title: "Рабочие часы", content: "20-30 часов в неделю, гибкий график" }
                ]
            },
            {
                id: 2,
                title: "Графический дизайнер",
                text: "Создание визуального контента, работа в Photoshop и Illustrator",
                accordionData: [
                    { title: "Заработная плата", content: "70 000 руб." },
                    { title: "Необходимый опыт", content: "портфолио из 5+ работ" },
                    { title: "Рабочие часы", content: "15-25 часов в неделю" }
                ]
            },
            {
                id: 3,
                title: "Менеджер по работе с клиентами",
                text: "Консультирование клиентов, обработка заявок, работа в CRM",
                accordionData: [
                    { title: "Заработная плата", content: "60 000 руб." },
                    { title: "Необходимый опыт", content: "опыт работы с клиентами от 1 года" },
                    { title: "Рабочие часы", content: "20-25 часов в неделю" }
                ]
            },
            {
                id: 4,
                title: "SMM-менеджер",
                text: "Ведение социальных сетей, создание контент-плана, анализ метрик",
                accordionData: [
                    { title: "Заработная плата", content: "50 000 руб." },
                    { title: "Необходимый опыт", content: "опыт ведения групп от 1 года" },
                    { title: "Рабочие часы", content: "15-20 часов в неделю" }
                ]
            },
            {
                id: 5,
                title: "Копирайтер / Контент-менеджер",
                text: "Написание статей, постов, работа с текстовым контентом",
                accordionData: [
                    { title: "Заработная плата", content: "60 000 руб." },
                    { title: "Необходимый опыт", content: "навыки написания текстов" },
                    { title: "Рабочие часы", content: "10-20 часов в неделю" }
                ]
            }
        ];
        
        this.saveData();
        this.saveToHistory();
    }

    saveToHistory() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(JSON.parse(JSON.stringify(this.vacanciesData)));
        this.historyIndex++;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.vacanciesData = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
            this.saveData();
            this.renderCards();
        }
    }

    saveData() {
        localStorage.setItem('vacanciesData', JSON.stringify(this.vacanciesData));
    }

    getData() {
        let data = [...this.vacanciesData];
        if (this.filterText && this.filterText.trim() !== "") {
            data = data.filter(item => 
                item.title.toLowerCase().includes(this.filterText.toLowerCase())
            );
        }
        return data;
    }

    get pageRoot() {
        return document.getElementById('vacancies-container')
    }

    getHTML() {
        return (
            `
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
                                <button id="delete-last-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Удалить последнюю</button>
                            </div>
                        </div>
                        <div id="vacancies-container" class="d-flex flex-wrap"></div>
                    </div>
                </div>
            `
        )
    }

    clickCard(e) {
        const cardId = e.target.dataset.id
        const vacancyDetailPage = new VacancyDetailPage(this.parent, cardId)
        vacancyDetailPage.render()
    }

    deleteCard(e) {
        e.stopPropagation();
        const cardId = parseInt(e.target.dataset.id);
        
        const index = this.vacanciesData.findIndex(item => item.id === cardId);
        
        if (index !== -1) {
            this.vacanciesData.splice(index, 1);
            this.saveData();
            this.saveToHistory();
            this.renderCards();
        }
    }

    deleteLastCard() {
        if (this.vacanciesData.length === 0) {
            return;
        }
        
        this.vacanciesData.pop();
        this.saveData();
        this.saveToHistory();
        this.renderCards();
    }

    analyzeSalary(cardId) {
        this.showSalaryAnalysisForCard(cardId);
    }

    showMerge(cardId) {
        this.showMergeDemoForCard(cardId);
    }

    addCard() {
        if (this.vacanciesData.length === 0) {
            return;
        }
        
        const firstCard = this.vacanciesData[0];
        const maxId = Math.max(...this.vacanciesData.map(item => item.id));
        const newId = maxId + 1;
        
        const newCard = {
            id: newId,
            title: `${firstCard.title} (копия)`,
            text: firstCard.text,
            accordionData: JSON.parse(JSON.stringify(firstCard.accordionData))
        };
        
        this.vacanciesData.push(newCard);
        this.saveData();
        this.saveToHistory();
        this.renderCards();
    }

    performSearch() {
        const searchInput = document.getElementById('search-input')
        if (searchInput) {
            this.filterText = searchInput.value
            this.renderCards()
        }
    }

    resetSearch() {
        const searchInput = document.getElementById('search-input')
        if (searchInput) {
            searchInput.value = ''
            this.filterText = ''
            this.renderCards()
        }
    }

    renderCards() {
        const cardsContainer = document.getElementById('vacancies-container')
        if (cardsContainer) {
            cardsContainer.innerHTML = ''
            const data = this.getData()
            
            data.forEach((item) => {
                const vacancyCard = new VacancyCardComponent(cardsContainer)
                vacancyCard.render(
                    item, 
                    this.clickCard.bind(this), 
                    this.deleteCard.bind(this),
                    this.analyzeSalary.bind(this),
                    this.showMerge.bind(this)
                )
            })
        }
    }

    setupEventListeners() {
        const searchButton = document.getElementById('search-button')
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch()
            })
        }

        const addButton = document.getElementById('add-button')
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.addCard()
            })
        }

        const deleteLastButton = document.getElementById('delete-last-button')
        if (deleteLastButton) {
            deleteLastButton.addEventListener('click', () => {
                this.deleteLastCard()
            })
        }

        const searchInput = document.getElementById('search-input')
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch()
                }
            })
        }
    }

    clickHome() {
        this.resetSearch()
        this.render()
    }

    render() {
        this.parent.innerHTML = ''
        
        const header = new HeaderComponent(this.parent)
        header.render(this.clickHome.bind(this))
        
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)
        
        this.renderCards()
        this.setupEventListeners()
    }
}