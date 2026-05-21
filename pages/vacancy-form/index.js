import { VacancyFormComponent } from "../../components/vacancy-form/index.js";
import { VacanciesPage } from "../vacancies/index.js";
import { HeaderComponent } from "../../components/header/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { ajax } from "../../modules/ajax.js";
import { apiUrls } from "../../modules/urls.js";

export class VacancyFormPage {
    constructor(parent, mode = 'create', vacancyData = null) {
        this.parent = parent;
        this.mode = mode;
        this.vacancyData = vacancyData;
    }

    get pageRoot() {
        return document.getElementById('vacancy-form-page');
    }

    getHTML() {
        return `<div id="vacancy-form-page"></div>`;
    }

    handleSubmit(formData) {
        if (this.mode === 'create') {
            ajax.post(apiUrls.createVacancy(), formData, (data, status) => {
                if (status === 201) {
                    alert('Вакансия успешно создана!');
                    this.goBack();
                } else {
                    alert('Ошибка при создании вакансии');
                }
            });
        } else if (this.mode === 'edit' && this.vacancyData) {
            ajax.patch(apiUrls.updateVacancy(this.vacancyData.id), formData, (data, status) => {
                if (status === 200) {
                    alert('Вакансия успешно обновлена!');
                    this.goBack();
                } else {
                    alert('Ошибка при обновлении вакансии');
                }
            });
        }
    }

    handleCancel() {
        this.goBack();
    }

    goBack() {
        const vacanciesPage = new VacanciesPage(this.parent);
        vacanciesPage.render();
    }

    clickHome() {
        const vacanciesPage = new VacanciesPage(this.parent);
        vacanciesPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        
        const header = new HeaderComponent(this.parent);
        header.render(this.clickHome.bind(this));
        
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        
        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.goBack.bind(this));
        
        const formComponent = new VacancyFormComponent(this.pageRoot);
        if (this.mode === 'edit' && this.vacancyData) {
            formComponent.setMode('edit', this.vacancyData);
        } else {
            formComponent.setMode('create');
        }
        formComponent.render(
            this.handleSubmit.bind(this),
            this.handleCancel.bind(this)
        );
    }
}