export class VacancyFormComponent {
    constructor(parent) {
        this.parent = parent;
        this.mode = 'create'; // 'create' or 'edit'
        this.vacancyId = null;
    }

    setMode(mode, vacancyData = null) {
        this.mode = mode;
        if (mode === 'edit' && vacancyData) {
            this.vacancyId = vacancyData.id;
            this.vacancyData = vacancyData;
        } else {
            this.vacancyId = null;
            this.vacancyData = null;
        }
    }

    getHTML() {
        const title = this.mode === 'edit' ? 'Редактирование вакансии' : 'Добавление новой вакансии';
        const buttonText = this.mode === 'edit' ? 'Сохранить изменения' : 'Добавить вакансию';
        
        const titleValue = this.vacancyData?.title || '';
        const textValue = this.vacancyData?.text || '';
        const salaryValue = this.vacancyData?.accordionData?.find(i => i.title === 'Заработная плата')?.content || '';
        const experienceValue = this.vacancyData?.accordionData?.find(i => i.title === 'Необходимый опыт')?.content || '';
        const hoursValue = this.vacancyData?.accordionData?.find(i => i.title === 'Рабочие часы')?.content || '';
        
        return `
            <div class="container mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <div class="card-body">
                                <h2 class="card-title text-center mb-4" style="color: #8c222b;">${title}</h2>
                                
                                <form id="vacancy-form">
                                    <div class="mb-3">
                                        <label for="vacancy-title" class="form-label" style="color: #8c222b; font-weight: bold;">Название вакансии *</label>
                                        <input type="text" class="form-control" id="vacancy-title" value="${this.escapeHtml(titleValue)}" required style="border-color: #BA2E3A;">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="vacancy-text" class="form-label" style="color: #8c222b; font-weight: bold;">Краткое описание</label>
                                        <textarea class="form-control" id="vacancy-text" rows="2" style="border-color: #BA2E3A;">${this.escapeHtml(textValue)}</textarea>
                                    </div>
                                    
                                    <hr style="background-color: #BA2E3A;">
                                    <h5 style="color: #BA2E3A;">Условия трудоустройства</h5>
                                    
                                    <div class="mb-3">
                                        <label for="vacancy-salary" class="form-label" style="color: #8c222b;">Заработная плата *</label>
                                        <input type="text" class="form-control" id="vacancy-salary" value="${this.escapeHtml(salaryValue)}" placeholder="например: 90 000 руб." required style="border-color: #BA2E3A;">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="vacancy-experience" class="form-label" style="color: #8c222b;">Необходимый опыт</label>
                                        <input type="text" class="form-control" id="vacancy-experience" value="${this.escapeHtml(experienceValue)}" style="border-color: #BA2E3A;">
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="vacancy-hours" class="form-label" style="color: #8c222b;">Рабочие часы</label>
                                        <input type="text" class="form-control" id="vacancy-hours" value="${this.escapeHtml(hoursValue)}" style="border-color: #BA2E3A;">
                                    </div>
                                    
                                    <div class="d-flex gap-2 mt-4">
                                        <button type="submit" class="btn flex-grow-1" style="background: #BA2E3A; color: floralwhite; border: none; padding: 10px;">${buttonText}</button>
                                        <button type="button" id="cancel-form" class="btn flex-grow-1" style="background: #8c222b; color: floralwhite; border: none; padding: 10px;">Отмена</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    getFormData() {
        const title = document.getElementById('vacancy-title').value;
        const text = document.getElementById('vacancy-text').value;
        const salary = document.getElementById('vacancy-salary').value;
        const experience = document.getElementById('vacancy-experience').value;
        const hours = document.getElementById('vacancy-hours').value;
        
        return {
            title: title,
            text: text,
            accordionData: [
                { title: "Заработная плата", content: salary },
                { title: "Необходимый опыт", content: experience },
                { title: "Рабочие часы", content: hours }
            ]
        };
    }

    addListeners(submitListener, cancelListener) {
        const form = document.getElementById('vacancy-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = this.getFormData();
                submitListener(formData);
            });
        }
        
        const cancelBtn = document.getElementById('cancel-form');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', cancelListener);
        }
    }

    render(submitListener, cancelListener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(submitListener, cancelListener);
    }
}