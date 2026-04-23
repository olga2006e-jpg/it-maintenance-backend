export class ApiUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getVacancies() {
        return `${this.baseUrl}/vacancies`;
    }

    getVacancyById(id) {
        return `${this.baseUrl}/vacancies/${id}`;
    }

    createVacancy() {
        return `${this.baseUrl}/vacancies`;
    }

    updateVacancy(id) {
        return `${this.baseUrl}/vacancies/${id}`;
    }

    deleteVacancy(id) {
        return `${this.baseUrl}/vacancies/${id}`;
    }
}

export const apiUrls = new ApiUrls();