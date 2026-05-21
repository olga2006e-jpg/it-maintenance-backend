import { VacanciesPage } from './pages/vacancies/index.js';

const app = document.getElementById('app');
const vacanciesPage = new VacanciesPage(app);
vacanciesPage.render();