import { BackButtonComponent } from "../../components/back-button/index.js";
import { VacanciesPage } from "../vacancies/index.js";
import { AccordionComponent } from "../../components/accordion/index.js";
import { HeaderComponent } from "../../components/header/index.js";

export class VacancyDetailPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.loadVacancy()
    }

    loadVacancy() {
        const savedData = localStorage.getItem('vacanciesData')
        if (savedData) {
            const allVacancies = JSON.parse(savedData)
            this.vacancy = allVacancies.find(v => v.id == this.id)
        }
    }

    getVacancyTitle() {
        if (this.vacancy) return this.vacancy.title
        
        const titles = {
            "1": "Веб-разработчик (удаленно)",
            "2": "Графический дизайнер",
            "3": "Менеджер по работе с клиентами",
            "4": "SMM-менеджер",
            "5": "Копирайтер / Контент-менеджер"
        };
        return titles[this.id] || "Вакансия";
    }

    getVacancyDescription() {
        if (this.vacancy) return this.vacancy.text
        
        const descriptions = {
            "1": "Создание и поддержка веб-сайтов, работа с современными технологиями",
            "2": "Создание визуального контента, работа в Photoshop и Illustrator",
            "3": "Консультирование клиентов, обработка заявок, работа в CRM",
            "4": "Ведение социальных сетей, создание контент-плана, анализ метрик",
            "5": "Написание статей, постов, работа с текстовым контентом"
        };
        return descriptions[this.id] || "Информация о вакансии";
    }

    getAccordionData() {
        if (this.vacancy && this.vacancy.accordionData) {
            return this.vacancy.accordionData
        }
        
        const data = {
            "1": [
                { title: "Заработная плата", content: "90 000 руб." },
                { title: "Необходимый опыт", content: "1-2 года коммерческой разработки" },
                { title: "Рабочие часы", content: "20-30 часов в неделю, гибкий график" }
            ],
            "2": [
                { title: "Заработная плата", content: "70 000 руб." },
                { title: "Необходимый опыт", content: "портфолио из 5+ работ" },
                { title: "Рабочие часы", content: "15-25 часов в неделю" }
            ],
            "3": [
                { title: "Заработная плата", content: "60 000 руб." },
                { title: "Необходимый опыт", content: "опыт работы с клиентами от 1 года" },
                { title: "Рабочие часы", content: "20-25 часов в неделю" }
            ],
            "4": [
                { title: "Заработная плата", content: "50 000 руб." },
                { title: "Необходимый опыт", content: "опыт ведения групп от 1 года" },
                { title: "Рабочие часы", content: "15-20 часов в неделю" }
            ],
            "5": [
                { title: "Заработная плата", content: "60 000 руб." },
                { title: "Необходимый опыт", content: "навыки написания текстов" },
                { title: "Рабочие часы", content: "10-20 часов в неделю" }
            ]
        };
        return data[this.id] || data["1"];
    }

    get pageRoot() {
        return document.getElementById('vacancy-detail-page')
    }

    getHTML() {
        return `<div id="vacancy-detail-page" class="container">
            <div class="row">
                <div class="col-md-6" id="info-column"></div>
                <div class="col-md-6" id="model-column">
                    <div id="model-canvas" style="width: 100%; height: 400px; background: #f5f5f5; border-radius: 15px; overflow: hidden;"></div>
                    <div id="model-controls" class="mt-3" style="background: rgb(252, 247, 241); border-radius: 15px; padding: 15px;">
                        <h5 style="color: #8c222b;">Управление камерой</h5>
                        <div class="button-group d-flex gap-2 flex-wrap">
                            <button id="view-front" class="btn btn-sm" style="background: #BA2E3A; color: white;">Спереди</button>
                            <button id="view-back" class="btn btn-sm" style="background: #BA2E3A; color: white;">Сзади</button>
                            <button id="view-left" class="btn btn-sm" style="background: #BA2E3A; color: white;">Слева</button>
                            <button id="view-right" class="btn btn-sm" style="background: #BA2E3A; color: white;">Справа</button>
                            <button id="zoom-in" class="btn btn-sm" style="background: #BA2E3A; color: white;">+</button>
                            <button id="zoom-out" class="btn btn-sm" style="background: #BA2E3A; color: white;">-</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    clickBack() {
        const vacanciesPage = new VacanciesPage(this.parent)
        vacanciesPage.render()
    }

    clickHome() {
        const vacanciesPage = new VacanciesPage(this.parent)
        vacanciesPage.render()
    }

    init3DModel() {
        import('three').then(async (THREE) => {
            const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
            
            const container = document.getElementById('model-canvas');
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf5f5f5);
            
            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / 400, 0.1, 1000);
            camera.position.set(2, 2, 3);
            
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, 400);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
            
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enableZoom = true;
            controls.zoomSpeed = 1.2;
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(1, 2, 1);
            scene.add(directionalLight);
            
            const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
            backLight.position.set(-1, 1, -1);
            scene.add(backLight);
            
            const fillLight = new THREE.PointLight(0xffffff, 0.3);
            fillLight.position.set(0, 1, 0);
            scene.add(fillLight);
            
            const gridHelper = new THREE.GridHelper(5, 20, 0x888888, 0xcccccc);
            scene.add(gridHelper);
            
            function showPlaceholder() {
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshStandardMaterial({ color: 0xBA2E3A });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.y = 0.5;
                scene.add(cube);
            }
            
            const loader = new GLTFLoader();
            loader.load('./models/computer.glb', 
                (gltf) => {
                    const model = gltf.scene;
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    
                    model.position.x -= center.x;
                    model.position.z -= center.z;
                    model.position.y -= box.min.y;
                    
                    scene.add(model);
                    
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const distance = maxDim * 1.5;
                    camera.position.set(distance, distance * 0.8, distance);
                    controls.target.set(0, size.y / 2, 0);
                    controls.update();
                },
                undefined,
                (error) => {
                    console.error('Ошибка загрузки модели:', error);
                    showPlaceholder();
                }
            );
            
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
            
            window.addEventListener('resize', () => {
                const width = container.clientWidth;
                camera.aspect = width / 400;
                camera.updateProjectionMatrix();
                renderer.setSize(width, 400);
            });
            
            document.getElementById('view-front')?.addEventListener('click', () => {
                camera.position.set(0, controls.target.y, 3);
                controls.update();
            });
            document.getElementById('view-back')?.addEventListener('click', () => {
                camera.position.set(0, controls.target.y, -3);
                controls.update();
            });
            document.getElementById('view-left')?.addEventListener('click', () => {
                camera.position.set(-3, controls.target.y, 0);
                controls.update();
            });
            document.getElementById('view-right')?.addEventListener('click', () => {
                camera.position.set(3, controls.target.y, 0);
                controls.update();
            });
            document.getElementById('zoom-in')?.addEventListener('click', () => {
                camera.position.multiplyScalar(0.9);
                controls.update();
            });
            document.getElementById('zoom-out')?.addEventListener('click', () => {
                camera.position.multiplyScalar(1.1);
                controls.update();
            });
        });
    }

    render() {
        this.parent.innerHTML = ''

        const header = new HeaderComponent(this.parent)
        header.render(this.clickHome.bind(this))

        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const vacancyTitle = this.getVacancyTitle()
        const vacancyDescription = this.getVacancyDescription()
        
        const infoHTML = `
            <div class="card mb-4" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div class="card-body">
                    <h2 class="card-title" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">${vacancyTitle}</h2>
                    <p class="card-text fs-5" style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif;">${vacancyDescription}</p>
                    <hr style="background-color: #BA2E3A;">
                    <h5 style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold;">Условия трудоустройства:</h5>
                </div>
            </div>
        `
        const infoColumn = document.getElementById('info-column')
        if (infoColumn) {
            infoColumn.insertAdjacentHTML('beforeend', infoHTML)
        }

        const accordionData = this.getAccordionData()
        const accordion = new AccordionComponent(infoColumn)
        accordion.render(accordionData)

        this.init3DModel()
    }
}