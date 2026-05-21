import { VacanciesPage } from "./pages/vacancies/index.js";

const root = document.getElementById('root');

const vacanciesPage = new VacanciesPage(root);
vacanciesPage.render();