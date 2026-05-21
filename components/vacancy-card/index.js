export class VacancyCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        // Фотографии для разных вакансий
        const images = {
            1: "https://falconspace.ru/uploads/land/vac.jpg",
            2: "https://info-profi.net/wp-content/uploads/2020/06/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80.jpg",
            3: "https://www.gd.ru/images/articles/10680/1-54-1.png",
            4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRAiW7OxZEWzocYitLIb7Uaxv53r31u_VEg&s",
            5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH1Vu2u_6pwDVwhVRvq2cNL2uSJl9MfNwPdQ&s"
        };
        const imageUrl = images[data.id] || "https://falconspace.ru/uploads/land/vac.jpg";
        
        // Получаем зарплату из данных вакансии
        const salaryItem = data.accordionData.find(item => item.title === "Заработная плата");
        const salaryText = salaryItem ? salaryItem.content : "Не указана";
        
        return (
            `
                <div class="card" style="width: 300px; margin: 10px; background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); overflow: hidden;" data-card-id="${data.id}">
                    <img src="${imageUrl}" class="card-img-top" style="height: 150px; object-fit: cover;" alt="${data.title}">
                    <div class="card-body">
                        <h5 class="card-title" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; font-size: 1.2rem;">${data.title}</h5>
                        <p class="card-text" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0.9rem; margin-bottom: 5px;">${data.text}</p>
                        <p class="card-text" style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0.9rem; font-weight: bold; margin-bottom: 15px;">${salaryText}</p>
                        <div class="d-flex gap-2 mb-3">
                            <button class="btn btn-sm flex-grow-1" id="view-vacancy-${data.id}" data-id="${data.id}" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.2s;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Подробнее</button>
                            <button class="btn btn-sm flex-grow-1" id="delete-vacancy-${data.id}" data-id="${data.id}" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.2s;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Удалить</button>
                        </div>
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm flex-grow-1" id="analyze-salary-${data.id}" data-id="${data.id}" style="background: rgb(196, 177, 158); color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.2s;" onmouseover="this.style.background='#6d6d6d'" onmouseout="this.style.background='rgb(196, 177, 158)'">Анализ зарплат</button>
                            <button class="btn btn-sm flex-grow-1" id="merge-demo-${data.id}" data-id="${data.id}" style="background: rgb(196, 177, 158); color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.2s;" onmouseover="this.style.background='#6d6d6d'" onmouseout="this.style.background='rgb(196, 177, 158)'">Merge</button>
                        </div>
                        <div id="analysis-result-${data.id}" class="mt-2" style="font-size: 0.8rem; color: #666;"></div>
                        <div id="merge-result-${data.id}" class="mt-2" style="font-size: 0.8rem; color: #666;"></div>
                    </div>
                </div>
            `
        )
    }

    addListeners(data, clickListener, deleteListener, analyzeListener, mergeListener) {
        const viewBtn = document.getElementById(`view-vacancy-${data.id}`);
        if (viewBtn) {
            viewBtn.addEventListener("click", clickListener);
        }
        
        const deleteBtn = document.getElementById(`delete-vacancy-${data.id}`);
        if (deleteBtn) {
            deleteBtn.addEventListener("click", deleteListener);
        }
        
        const analyzeBtn = document.getElementById(`analyze-salary-${data.id}`);
        if (analyzeBtn) {
            analyzeBtn.addEventListener("click", () => analyzeListener(data.id));
        }

        const mergeBtn = document.getElementById(`merge-demo-${data.id}`);
        if (mergeBtn) {
            mergeBtn.addEventListener("click", () => mergeListener(data.id));
        }
    }

    render(data, clickListener, deleteListener, analyzeListener, mergeListener) {
        const html = this.getHTML(data)
        this.parent.insertAdjacentHTML('beforeend', html)
        this.addListeners(data, clickListener, deleteListener, analyzeListener, mergeListener)
    }
}