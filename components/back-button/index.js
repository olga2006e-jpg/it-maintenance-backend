export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const backBtn = document.getElementById("back-button");
        if (backBtn) {
            backBtn.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <button id="back-button" class="btn mb-3" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; font-size: 1rem; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Назад</button>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}