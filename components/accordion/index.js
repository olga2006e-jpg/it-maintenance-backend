export class AccordionComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="accordion" id="accordionExample">
                ${data.map((item, index) => {
            const collapseId = `collapse${index}`;
            const headingId = `heading${index}`;
            const isShow = index === 0 ? 'show' : '';
            const buttonClass = index === 0 ? '' : 'collapsed';

            return `
                        <div class="accordion-item" style="background: rgb(252, 247, 241); border: 1px solid #BA2E3A; border-radius: 8px; margin-bottom: 10px;">
                            <h2 class="accordion-header" id="${headingId}">
                                <button class="accordion-button ${buttonClass}" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${collapseId}"
                                    aria-expanded="${index === 0 ? 'true' : 'false'}"
                                    aria-controls="${collapseId}"
                                    style="background: rgb(252, 247, 241); color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; border-radius: 8px;">
                                    ${item.title}
                                </button>
                            </h2>
                            <div id="${collapseId}"
                                class="accordion-collapse collapse ${isShow}"
                                aria-labelledby="${headingId}"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body" style="background: rgb(252, 247, 241); color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif;">
                                    ${item.content}
                                </div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}