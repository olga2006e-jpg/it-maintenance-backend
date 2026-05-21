
import { VacancyFormComponent } from "../../components/vacancy-form/index.js";
import { VacanciesPage } from "../vacancies/index.js";
import { HeaderComponent } from "../../components/header/index.js";
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
        return `<div id="vacancy-form-page" style="position: relative;"></div>`;
    }

    // handleSubmit(formData) {
    //     if (this.mode === 'create') {
    //         ajax.post(apiUrls.createVacancy(), formData, (data, status) => {
    //             if (status === 201) {
    //                 alert('Вакансия успешно создана!');
    //                 this.goBack();
    //             } else {
    //                 alert('Ошибка при создании вакансии');
    //             }
    //         });
    //     } else if (this.mode === 'edit' && this.vacancyData) {
    //         ajax.patch(apiUrls.updateVacancy(this.vacancyData.id), formData, (data, status) => {
    //             if (status === 200) {
    //                 alert('Вакансия успешно обновлена!');
    //                 this.goBack();
    //             } else {
    //                 alert('Ошибка при обновлении вакансии');
    //             }
    //         });
    //     }
    // }
    handleSubmit(formData, isAutoSave = false) {
        if (this.mode === 'create') {
            ajax.post(apiUrls.createVacancy(), formData, (data, status) => {
                if (status === 201) {
                    console.log('Вакансия успешно создана!', data);
                    this.goBack();
                } else {
                    console.error('Ошибка при создании вакансии. Статус:', status, data);
                }
            });
        } else if (this.mode === 'edit' && this.vacancyData) {
            ajax.patch(apiUrls.updateVacancy(this.vacancyData.id), formData, (data, status) => {
                if (status === 200) {
                    if (!isAutoSave) {
                        console.log('Вакансия успешно обновлена!', data);
                        this.goBack();
                    } else {
                        console.log('Автосохранение: вакансия обновлена', data);
                    }
                } else {
                    if (!isAutoSave) {
                        console.error('Ошибка при обновлении вакансии. Статус:', status, data);
                    } else {
                        console.error('Ошибка автосохранения. Статус:', status, data);
                    }
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
        
        const customBackButtonHTML = `
            <div style="padding: 0 20px; margin-top: 10px;">
                <button id="back-button" class="btn" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 8px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; font-size: 0.9rem; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Назад</button>
            </div>
        `;
        this.pageRoot.insertAdjacentHTML('afterbegin', customBackButtonHTML);
        
        const backBtn = document.getElementById("back-button");
        if (backBtn) {
            backBtn.addEventListener("click", this.goBack.bind(this));
        }
        
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