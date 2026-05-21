// import { BackButtonComponent } from "../../components/back-button/index.js";
// import { VacanciesPage } from "../vacancies/index.js";
// import { AccordionComponent } from "../../components/accordion/index.js";
// import { HeaderComponent } from "../../components/header/index.js";
// import { ajax } from "../../modules/ajax.js";
// import { apiUrls } from "../../modules/urls.js";

// export class VacancyDetailPage {
//     constructor(parent, id) {
//         this.parent = parent;
//         this.id = id;
//         this.vacancy = null;
//     }

//     get pageRoot() {
//         return document.getElementById('vacancy-detail-page');
//     }

//     getHTML() {
//         return `
//             <div id="vacancy-detail-page" class="container">
//                 <div class="row">
//                     <div class="col-md-6" id="info-column">
//                         <div class="text-center py-5">
//                             <div class="spinner-border text-danger" role="status">
//                                 <span class="visually-hidden">Загрузка...</span>
//                             </div>
//                             <p class="mt-3">Загрузка данных...</p>
//                         </div>
//                     </div>
//                     <div class="col-md-6" id="model-column">
//                         <div id="model-canvas" style="width: 100%; height: 400px; background: #f5f5f5; border-radius: 15px; overflow: hidden;"></div>
//                         <div id="model-controls" class="mt-3" style="background: rgb(252, 247, 241); border-radius: 15px; padding: 15px;">
//                             <h5 style="color: #8c222b;">Управление камерой</h5>
//                             <div class="button-group d-flex gap-2 flex-wrap">
//                                 <button id="view-front" class="btn btn-sm" style="background: #BA2E3A; color: white;">Спереди</button>
//                                 <button id="view-back" class="btn btn-sm" style="background: #BA2E3A; color: white;">Сзади</button>
//                                 <button id="view-left" class="btn btn-sm" style="background: #BA2E3A; color: white;">Слева</button>
//                                 <button id="view-right" class="btn btn-sm" style="background: #BA2E3A; color: white;">Справа</button>
//                                 <button id="zoom-in" class="btn btn-sm" style="background: #BA2E3A; color: white;">+</button>
//                                 <button id="zoom-out" class="btn btn-sm" style="background: #BA2E3A; color: white;">-</button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }

//     async loadVacancy() {
//         const url = apiUrls.getVacancyById(this.id);
//         console.log('Загрузка с URL:', url);
        
//         ajax.get(url, (data, status) => {
//             console.log('Ответ сервера:', { status, data });
            
//             if (status === 200 && data) {
//                 this.vacancy = data;
//                 this.displayVacancy();
//             } else {
//                 this.displayError();
//             }
//         });
//     }

//     displayVacancy() {
//         const infoColumn = document.getElementById('info-column');
//         if (!infoColumn) return;

//         const cityHtml = this.vacancy.city ? `<p class="text-muted">${this.escapeHtml(this.vacancy.city)}</p>` : '';
        
//         // Находим зарплату для отображения
//         const salaryItem = this.vacancy.accordionData?.find(item => item.title === "Заработная плата");
//         const salaryText = salaryItem ? salaryItem.content : "Не указана";
        
//         const html = `
//             <div class="card mb-4" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
//                 <div class="card-body">
//                     <h2 class="card-title" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">${this.escapeHtml(this.vacancy.title)}</h2>
//                     ${cityHtml}
//                     <p class="card-text fs-5" style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif;">${this.escapeHtml(this.vacancy.text)}</p>
//                     <hr style="background-color: #BA2E3A;">
//                     <h5 style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">Условия трудоустройства:</h5>
//                 </div>
//             </div>
//         `;
        
//         infoColumn.innerHTML = html;
        
//         // Добавляем аккордеон
//         if (this.vacancy.accordionData && this.vacancy.accordionData.length > 0) {
//             const accordion = new AccordionComponent(infoColumn);
//             accordion.render(this.vacancy.accordionData);
//         }
//     }

//     displayError() {
//     const infoColumn = document.getElementById('info-column');
//     if (infoColumn) {
//         infoColumn.innerHTML = `
//             <div class="alert alert-danger text-center" role="alert">
//                 <strong>❌ Ошибка!</strong><br>
//                 Не удалось загрузить данные вакансии.<br>
//                 <small>Проверьте: сервер запущен на порту 3000, CORS настроен на порт 3001</small>
//                 <br><br>
//                 <button class="btn btn-danger" onclick="window.location.reload()">🔄 Повторить</button>
//             </div>
//         `;
//     }
// }

//     escapeHtml(str) {
//         if (!str) return '';
//         return String(str).replace(/[&<>]/g, function(m) {
//             if (m === '&') return '&amp;';
//             if (m === '<') return '&lt;';
//             if (m === '>') return '&gt;';
//             return m;
//         });
//     }

//     clickBack() {
//         const vacanciesPage = new VacanciesPage(this.parent);
//         vacanciesPage.render();
//     }

//     clickHome() {
//         const vacanciesPage = new VacanciesPage(this.parent);
//         vacanciesPage.render();
//     }

//     init3DModel() {
//     import('three').then(async (THREE) => {
//         const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
//         const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        
//         const container = document.getElementById('model-canvas');
//         if (!container) return;
        
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xf5f5f5);
        
//         const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 400, 0.1, 1000);
//         camera.position.set(2, 2, 3);
        
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(container.clientWidth, 400);
//         container.innerHTML = '';
//         container.appendChild(renderer.domElement);
        
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.enableZoom = true;
//         controls.zoomSpeed = 1.2;
        
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//         scene.add(ambientLight);
        
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//         directionalLight.position.set(1, 2, 1);
//         scene.add(directionalLight);
        
//         const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         backLight.position.set(-1, 1, -1);
//         scene.add(backLight);
        
//         const fillLight = new THREE.PointLight(0xffffff, 0.3);
//         fillLight.position.set(0, 1, 0);
//         scene.add(fillLight);
        
//         const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
//         scene.add(gridHelper);
        
//         // ЗАГРУЗКА МОДЕЛИ КОМПЬЮТЕРА (без куба)
//         const loader = new GLTFLoader();
//         loader.load('./models/computer.glb', 
//             (gltf) => {
//                 const model = gltf.scene;
//                 const box = new THREE.Box3().setFromObject(model);
//                 const center = box.getCenter(new THREE.Vector3());
//                 const size = box.getSize(new THREE.Vector3());
                
//                 model.position.x -= center.x;
//                 model.position.z -= center.z;
//                 model.position.y -= box.min.y;
                
//                 scene.add(model);
                
//                 const maxDim = Math.max(size.x, size.y, size.z);
//                 const distance = maxDim * 1.5;
//                 camera.position.set(distance, distance * 0.8, distance);
//                 controls.target.set(0, size.y / 2, 0);
//                 controls.update();
//             },
//             undefined,
//             (error) => {
//                 console.error('Ошибка загрузки модели:', error);
//                 // НЕ ПОКАЗЫВАЕМ КУБ - просто выводим ошибку в консоль
//                 console.log('Проверьте: файл computer.glb должен лежать в папке models/');
//             }
//         );
        
//         function animate() {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         }
//         animate();
        
//         window.addEventListener('resize', () => {
//             const width = container.clientWidth;
//             camera.aspect = width / 400;
//             camera.updateProjectionMatrix();
//             renderer.setSize(width, 400);
//         });
        
//         const viewFront = document.getElementById('view-front');
//         if (viewFront) viewFront.addEventListener('click', () => {
//             camera.position.set(0, controls.target.y, 3);
//             controls.update();
//         });
        
//         const viewBack = document.getElementById('view-back');
//         if (viewBack) viewBack.addEventListener('click', () => {
//             camera.position.set(0, controls.target.y, -3);
//             controls.update();
//         });
        
//         const viewLeft = document.getElementById('view-left');
//         if (viewLeft) viewLeft.addEventListener('click', () => {
//             camera.position.set(-3, controls.target.y, 0);
//             controls.update();
//         });
        
//         const viewRight = document.getElementById('view-right');
//         if (viewRight) viewRight.addEventListener('click', () => {
//             camera.position.set(3, controls.target.y, 0);
//             controls.update();
//         });
        
//         const zoomIn = document.getElementById('zoom-in');
//         if (zoomIn) zoomIn.addEventListener('click', () => {
//             camera.position.multiplyScalar(0.9);
//             controls.update();
//         });
        
//         const zoomOut = document.getElementById('zoom-out');
//         if (zoomOut) zoomOut.addEventListener('click', () => {
//             camera.position.multiplyScalar(1.1);
//             controls.update();
//         });
//     });
// }

//     render() {
//         this.parent.innerHTML = '';

//         const header = new HeaderComponent(this.parent);
//         header.render(this.clickHome.bind(this));

//         const html = this.getHTML();
//         this.parent.insertAdjacentHTML('beforeend', html);

//         const backButton = new BackButtonComponent(this.pageRoot);
//         backButton.render(this.clickBack.bind(this));

//         // Загружаем данные
//         this.loadVacancy();
        
//         // Запускаем 3D модель
//         setTimeout(() => {
//             this.init3DModel();
//         }, 100);
//     }
// }




// import { BackButtonComponent } from "../../components/back-button/index.js";
// import { VacanciesPage } from "../vacancies/index.js";
// import { VacancyFormPage } from "../vacancy-form/index.js";  // ← ДОБАВИТЬ
// import { AccordionComponent } from "../../components/accordion/index.js";
// import { HeaderComponent } from "../../components/header/index.js";
// import { ajax } from "../../modules/ajax.js";
// import { apiUrls } from "../../modules/urls.js";

// export class VacancyDetailPage {
//     constructor(parent, id) {
//         this.parent = parent;
//         this.id = id;
//         this.vacancy = null;
//     }

//     get pageRoot() {
//         return document.getElementById('vacancy-detail-page');
//     }

//     loadVacancyFromApi() {
//         ajax.get(apiUrls.getVacancyById(this.id), (data, status) => {
//             if (status === 200 && data) {
//                 this.vacancy = data;
//                 this.renderData();
//             } else {
//                 console.error('Ошибка загрузки вакансии:', status);
//                 this.showError();
//             }
//         });
//     }

//     showError() {
//         const infoColumn = document.getElementById('info-column');
//         if (infoColumn) {
//             infoColumn.innerHTML = `
//                 <div class="alert alert-danger" role="alert">
//                     <strong>Ошибка!</strong> Не удалось загрузить данные вакансии.
//                 </div>
//             `;
//         }
//     }

//     renderData() {
//         if (!this.vacancy) return;

//         const infoColumn = document.getElementById('info-column');
//         if (infoColumn) {
//             const vacancyTitle = this.vacancy.title || 'Вакансия';
//             const vacancyDescription = this.vacancy.text || 'Информация о вакансии';
            
//             const infoHTML = `
//                 <div class="card mb-4" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
//                     <div class="card-body">
//                         <div class="d-flex justify-content-between align-items-start">
//                             <h2 class="card-title" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">${this.escapeHtml(vacancyTitle)}</h2>
//                             <button id="edit-vacancy-btn" class="btn" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 8px 20px;">
//                                 ✏️ Редактировать
//                             </button>
//                         </div>
//                         <p class="card-text fs-5" style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif;">${this.escapeHtml(vacancyDescription)}</p>
//                         <hr style="background-color: #BA2E3A;">
//                         <h5 style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">Условия трудоустройства:</h5>
//                     </div>
//                 </div>
//             `;
//             infoColumn.insertAdjacentHTML('beforeend', infoHTML);

//             const editBtn = document.getElementById('edit-vacancy-btn');
//             if (editBtn) {
//                 editBtn.addEventListener('click', () => this.clickEdit());
//             }

//             const accordionData = this.vacancy.accordionData || [
//                 { title: "Заработная плата", content: "Не указана" },
//                 { title: "Необходимый опыт", content: "Не указан" },
//                 { title: "Рабочие часы", content: "Не указаны" }
//             ];
//             const accordion = new AccordionComponent(infoColumn);
//             accordion.render(accordionData);
//         }
//     }

//     clickEdit() {
//         const editPage = new VacancyFormPage(this.parent, 'edit', this.vacancy);
//         editPage.render();
//     }

//     escapeHtml(str) {
//         if (!str) return '';
//         return str.replace(/[&<>]/g, function(m) {
//             if (m === '&') return '&amp;';
//             if (m === '<') return '&lt;';
//             if (m === '>') return '&gt;';
//             return m;
//         });
//     }

//     getHTML() {
//         return `<div id="vacancy-detail-page" class="container">
//             <div class="row">
//                 <div class="col-md-6" id="info-column"></div>
//                 <div class="col-md-6" id="model-column">
//                     <div id="model-canvas" style="width: 100%; height: 400px; background: #f5f5f5; border-radius: 15px; overflow: hidden;"></div>
//                     <div id="model-controls" class="mt-3" style="background: rgb(252, 247, 241); border-radius: 15px; padding: 15px;">
//                         <h5 style="color: #8c222b;">Управление камерой</h5>
//                         <div class="button-group d-flex gap-2 flex-wrap">
//                             <button id="view-front" class="btn btn-sm" style="background: #BA2E3A; color: white;">Спереди</button>
//                             <button id="view-back" class="btn btn-sm" style="background: #BA2E3A; color: white;">Сзади</button>
//                             <button id="view-left" class="btn btn-sm" style="background: #BA2E3A; color: white;">Слева</button>
//                             <button id="view-right" class="btn btn-sm" style="background: #BA2E3A; color: white;">Справа</button>
//                             <button id="zoom-in" class="btn btn-sm" style="background: #BA2E3A; color: white;">+</button>
//                             <button id="zoom-out" class="btn btn-sm" style="background: #BA2E3A; color: white;">-</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>`;
//     }

//     clickBack() {
//         const vacanciesPage = new VacanciesPage(this.parent);
//         vacanciesPage.render();
//     }

//     clickHome() {
//         const vacanciesPage = new VacanciesPage(this.parent);
//         vacanciesPage.render();
//     }

//     init3DModel() {
//         import('three').then(async (THREE) => {
//             const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
//             const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
            
//             const container = document.getElementById('model-canvas');
//             if (!container) return;
            
//             const scene = new THREE.Scene();
//             scene.background = new THREE.Color(0xf5f5f5);
            
//             const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 400, 0.1, 1000);
//             camera.position.set(2, 2, 3);
            
//             const renderer = new THREE.WebGLRenderer({ antialias: true });
//             renderer.setSize(container.clientWidth, 400);
//             container.innerHTML = '';
//             container.appendChild(renderer.domElement);
            
//             const controls = new OrbitControls(camera, renderer.domElement);
//             controls.enableDamping = true;
//             controls.enableZoom = true;
//             controls.zoomSpeed = 1.2;
            
//             const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//             scene.add(ambientLight);
            
//             const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//             directionalLight.position.set(1, 2, 1);
//             scene.add(directionalLight);
            
//             const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
//             backLight.position.set(-1, 1, -1);
//             scene.add(backLight);
            
//             const fillLight = new THREE.PointLight(0xffffff, 0.3);
//             fillLight.position.set(0, 1, 0);
//             scene.add(fillLight);
            
//             const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
//             scene.add(gridHelper);
            
//             function showPlaceholder() {
//                 const geometry = new THREE.BoxGeometry(1, 1, 1);
//                 const material = new THREE.MeshStandardMaterial({ color: 0xBA2E3A });
//                 const cube = new THREE.Mesh(geometry, material);
//                 cube.position.y = 0.5;
//                 scene.add(cube);
//             }
            
//             const loader = new GLTFLoader();
//             loader.load('./models/computer.glb', 
//                 (gltf) => {
//                     const model = gltf.scene;
//                     const box = new THREE.Box3().setFromObject(model);
//                     const center = box.getCenter(new THREE.Vector3());
//                     const size = box.getSize(new THREE.Vector3());
                    
//                     model.position.x -= center.x;
//                     model.position.z -= center.z;
//                     model.position.y -= box.min.y;
                    
//                     scene.add(model);
                    
//                     const maxDim = Math.max(size.x, size.y, size.z);
//                     const distance = maxDim * 1.5;
//                     camera.position.set(distance, distance * 0.8, distance);
//                     controls.target.set(0, size.y / 2, 0);
//                     controls.update();
//                 },
//                 undefined,
//                 (error) => {
//                     console.error('Ошибка загрузки модели:', error);
//                     showPlaceholder();
//                 }
//             );
            
//             function animate() {
//                 requestAnimationFrame(animate);
//                 controls.update();
//                 renderer.render(scene, camera);
//             }
//             animate();
            
//             window.addEventListener('resize', () => {
//                 const width = container.clientWidth;
//                 camera.aspect = width / 400;
//                 camera.updateProjectionMatrix();
//                 renderer.setSize(width, 400);
//             });
            
//             const viewFront = document.getElementById('view-front');
//             if (viewFront) viewFront.addEventListener('click', () => {
//                 camera.position.set(0, controls.target.y, 3);
//                 controls.update();
//             });
            
//             const viewBack = document.getElementById('view-back');
//             if (viewBack) viewBack.addEventListener('click', () => {
//                 camera.position.set(0, controls.target.y, -3);
//                 controls.update();
//             });
            
//             const viewLeft = document.getElementById('view-left');
//             if (viewLeft) viewLeft.addEventListener('click', () => {
//                 camera.position.set(-3, controls.target.y, 0);
//                 controls.update();
//             });
            
//             const viewRight = document.getElementById('view-right');
//             if (viewRight) viewRight.addEventListener('click', () => {
//                 camera.position.set(3, controls.target.y, 0);
//                 controls.update();
//             });
            
//             const zoomIn = document.getElementById('zoom-in');
//             if (zoomIn) zoomIn.addEventListener('click', () => {
//                 camera.position.multiplyScalar(0.9);
//                 controls.update();
//             });
            
//             const zoomOut = document.getElementById('zoom-out');
//             if (zoomOut) zoomOut.addEventListener('click', () => {
//                 camera.position.multiplyScalar(1.1);
//                 controls.update();
//             });
//         });
//     }

//     render() {
//         this.parent.innerHTML = '';

//         const header = new HeaderComponent(this.parent);
//         header.render(this.clickHome.bind(this));

//         const html = this.getHTML();
//         this.parent.insertAdjacentHTML('beforeend', html);

//         const backButton = new BackButtonComponent(this.pageRoot);
//         backButton.render(this.clickBack.bind(this));

//         this.loadVacancyFromApi();
//         this.init3DModel();
//     }
// }




import { HeaderComponent } from "../../components/header/index.js";
import { AccordionComponent } from "../../components/accordion/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { ajax } from "../../modules/ajax.js";
import { apiUrls } from "../../modules/urls.js";

export class VacancyDetailPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    async getData() {
        try {
            const data = await api.get(apiUrls.getVacancyById(this.id));
            return data;
        } catch (error) {
            console.error('Ошибка загрузки данных вакансии:', error);
            return null;
        }
    }

    getHTML(data) {
        const salaryItem = data.accordionData?.find(item => item.title === "Заработная плата");
        const salaryText = salaryItem ? salaryItem.content : "Не указана";
        
        return `
            <div class="container mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <div class="card-body">
                                <h1 class="card-title text-center mb-4" style="color: #8c222b;">${this.escapeHtml(data.title)}</h1>
                                ${data.city ? `<p class="text-center mb-3" style="color: #8c222b;">📍 ${this.escapeHtml(data.city)}</p>` : ''}
                                <p class="card-text" style="color: #8c222b; font-size: 1.1rem;">${this.escapeHtml(data.text)}</p>
                                <p class="card-text mt-3" style="color: #BA2E3A; font-size: 1.2rem; font-weight: bold;">💰 ${salaryText}</p>
                                <hr style="background-color: #BA2E3A;">
                                <div id="accordion-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    async clickBack() {
        const { VacanciesPage } = await import("../vacancies/index.js");
        const vacanciesPage = new VacanciesPage(this.parent);
        vacanciesPage.render();
    }

    async render() {
        const data = await this.getData();
        if (!data) {
            this.parent.innerHTML = '<div class="alert alert-danger m-4">Вакансия не найдена</div>';
            return;
        }
        
        this.parent.innerHTML = '';
        
        const header = new HeaderComponent(this.parent);
        header.render(this.clickBack.bind(this));
        
        const backButton = new BackButtonComponent(this.parent);
        backButton.render(this.clickBack.bind(this));
        
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        
        const accordionContainer = document.getElementById('accordion-container');
        if (accordionContainer && data.accordionData) {
            const accordion = new AccordionComponent(accordionContainer);
            accordion.render(data.accordionData);
        }
    }
}