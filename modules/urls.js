const BASE_URL = '/api';

export const apiUrls = {
    getVacancies: () => `${BASE_URL}/vacancies`,
    getVacancyById: (id) => `${BASE_URL}/vacancies/${id}`,
    createVacancy: () => `${BASE_URL}/vacancies`,
    updateVacancy: (id) => `${BASE_URL}/vacancies/${id}`,
    deleteVacancy: (id) => `${BASE_URL}/vacancies/${id}`,
};