export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const homeBtn = document.getElementById("home-button");
        if (homeBtn) {
            homeBtn.addEventListener("click", listener);
        }
    }

    getHTML() {
        return `
            <nav class="navbar navbar-expand-lg mb-4" style="background: #BA2E3A; padding: 15px 0;">
                <div class="container-fluid">
                    <div class="d-flex align-items-center gap-3">
                        <button id="home-button" class="btn" style="background: #8c222b; color: floralwhite; border: none; border-radius: 4px; padding: 8px 20px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.3s ease;" onmouseover="this.style.background='#5a151b'" onmouseout="this.style.background='#8c222b'">Домой</button>
                        <span style="color: floralwhite; font-family: 'Segoe UI', Arial, sans-serif; font-size: 1.1rem;">Трудоустройство женщин в отпуске по уходу за ребенком</span>
                    </div>
                </div>
            </nav>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}