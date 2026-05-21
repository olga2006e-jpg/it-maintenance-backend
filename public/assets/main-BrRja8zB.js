(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();class v{constructor(e){this.parent=e}getHTML(e){var i;const o={1:"https://falconspace.ru/uploads/land/vac.jpg",2:"https://info-profi.net/wp-content/uploads/2020/06/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80.jpg",3:"https://www.gd.ru/images/articles/10680/1-54-1.png",4:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeRAiW7OxZEWzocYitLIb7Uaxv53r31u_VEg&s",5:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH1Vu2u_6pwDVwhVRvq2cNL2uSJl9MfNwPdQ&s"}[e.id]||"https://info-profi.net/wp-content/uploads/2020/06/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5%D1%80.jpg",r=(i=e.accordionData)==null?void 0:i.find(a=>a.title==="Заработная плата"),n=r?r.content:"Не указана",s=e.city?`📍 ${e.city}`:"";return`
            <div class="card" style="width: 300px; margin: 10px; background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); overflow: hidden;">
                <img src="${o}" class="card-img-top" style="height: 150px; object-fit: cover;" alt="${e.title}">
                <div class="card-body">
                    <h5 class="card-title" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; font-size: 1.2rem;">${this.escapeHtml(e.title)}</h5>
                    
                    ${s?`<p class="card-text" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0.85rem; margin-bottom: 5px;">${s}</p>`:""}
                    
                    <p class="card-text" style="color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0.9rem; margin-bottom: 5px;">${this.escapeHtml(e.text)}</p>
                    <p class="card-text" style="color: #BA2E3A; font-family: 'Segoe UI', Arial, sans-serif; font-size: 0.9rem; font-weight: bold; margin-bottom: 15px;">💰 ${n}</p>
                    
                    <div class="d-flex gap-2 mb-3">
                        <button class="btn btn-sm flex-grow-1 view-btn" data-id="${e.id}" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px;">Подробнее</button>
                        <button class="btn btn-sm flex-grow-1 delete-btn" data-id="${e.id}" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px;">Удалить</button>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm flex-grow-1 analyze-btn" data-id="${e.id}" style="background: rgb(196, 177, 158); color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px;">Анализ зарплат</button>
                        <button class="btn btn-sm flex-grow-1 merge-btn" data-id="${e.id}" style="background: rgb(196, 177, 158); color: floralwhite; border: none; border-radius: 4px; padding: 5px 12px;">Merge</button>
                    </div>
                    <div id="analysis-result-${e.id}" class="mt-2" style="font-size: 0.8rem; color: #666;"></div>
                    <div id="merge-result-${e.id}" class="mt-2" style="font-size: 0.8rem; color: #666;"></div>
                </div>
            </div>
        `}escapeHtml(e){return e?String(e).replace(/[&<>]/g,function(t){return t==="&"?"&amp;":t==="<"?"&lt;":t===">"?"&gt;":t}):""}addListeners(e,t,o,r,n){const s=document.querySelector(`.view-btn[data-id="${e.id}"]`);s&&s.addEventListener("click",()=>t(e.id));const i=document.querySelector(`.delete-btn[data-id="${e.id}"]`);i&&i.addEventListener("click",d=>{d.stopPropagation(),o(e.id)});const a=document.querySelector(`.analyze-btn[data-id="${e.id}"]`);a&&a.addEventListener("click",()=>r(e.id));const u=document.querySelector(`.merge-btn[data-id="${e.id}"]`);u&&u.addEventListener("click",()=>n(e.id))}render(e,t,o,r,n){const s=this.getHTML(e);this.parent.insertAdjacentHTML("beforeend",s),this.addListeners(e,t,o,r,n)}}const x="modulepreload",w=function(l){return"/"+l},g={},B=function(e,t,o){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),i=(s==null?void 0:s.nonce)||(s==null?void 0:s.getAttribute("nonce"));r=Promise.allSettled(t.map(a=>{if(a=w(a),a in g)return;g[a]=!0;const u=a.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${d}`))return;const c=document.createElement("link");if(c.rel=u?"stylesheet":x,u||(c.as="script"),c.crossOrigin="",c.href=a,i&&c.setAttribute("nonce",i),document.head.appendChild(c),u)return new Promise((p,h)=>{c.addEventListener("load",p),c.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${a}`)))})}))}function n(s){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=s,window.dispatchEvent(i),!i.defaultPrevented)throw s}return r.then(s=>{for(const i of s||[])i.status==="rejected"&&n(i.reason);return e().catch(n)})};class f{constructor(e){this.parent=e}addListeners(e){const t=document.getElementById("home-button");t&&t.addEventListener("click",e)}getHTML(){return`
            <nav class="navbar navbar-expand-lg mb-4" style="background: #BA2E3A; padding: 15px 0;">
                <div class="container-fluid">
                    <div class="d-flex align-items-center gap-3">
                        <button id="home-button" class="btn" style="background: #8c222b; color: floralwhite; border: none; border-radius: 4px; padding: 8px 20px; font-family: 'Segoe UI', Arial, sans-serif; transition: all 0.3s ease;" onmouseover="this.style.background='#5a151b'" onmouseout="this.style.background='#8c222b'">Домой</button>
                        <span style="color: floralwhite; font-family: 'Segoe UI', Arial, sans-serif; font-size: 1.1rem;">Трудоустройство женщин в отпуске по уходу за ребенком</span>
                    </div>
                </div>
            </nav>
        `}render(e){const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.addListeners(e)}}class ${constructor(e){this.parent=e}getHTML(e){return`
            <div class="accordion" id="accordionExample">
                ${e.map((t,o)=>{const r=`collapse${o}`,n=`heading${o}`,s=o===0?"show":"";return`
                        <div class="accordion-item" style="background: rgb(252, 247, 241); border: 1px solid #BA2E3A; border-radius: 8px; margin-bottom: 10px;">
                            <h2 class="accordion-header" id="${n}">
                                <button class="accordion-button ${o===0?"":"collapsed"}" type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#${r}"
                                    aria-expanded="${o===0?"true":"false"}"
                                    aria-controls="${r}"
                                    style="background: rgb(252, 247, 241); color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; border-radius: 8px;">
                                    ${t.title}
                                </button>
                            </h2>
                            <div id="${r}"
                                class="accordion-collapse collapse ${s}"
                                aria-labelledby="${n}"
                                data-bs-parent="#accordionExample">
                                <div class="accordion-body" style="background: rgb(252, 247, 241); color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif;">
                                    ${t.content}
                                </div>
                            </div>
                        </div>
                    `}).join("")}
            </div>
        `}render(e){const t=this.getHTML(e);this.parent.insertAdjacentHTML("beforeend",t)}}class D{constructor(e){this.parent=e}addListeners(e){const t=document.getElementById("back-button");t&&t.addEventListener("click",e)}getHTML(){return`
            <button id="back-button" class="btn mb-3" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px 20px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; font-size: 1rem; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Назад</button>
        `}render(e){const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.addListeners(e)}}const b="/api",m={getVacancies:()=>`${b}/vacancies`,getVacancyById:l=>`${b}/vacancies/${l}`,createVacancy:()=>`${b}/vacancies`,updateVacancy:l=>`${b}/vacancies/${l}`,deleteVacancy:l=>`${b}/vacancies/${l}`};class A{constructor(e,t){this.parent=e,this.id=t}async getData(){try{return await api.get(m.getVacancyById(this.id))}catch(e){return console.error("Ошибка загрузки данных вакансии:",e),null}}getHTML(e){var r;const t=(r=e.accordionData)==null?void 0:r.find(n=>n.title==="Заработная плата"),o=t?t.content:"Не указана";return`
            <div class="container mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card" style="background: rgb(252, 247, 241); border: none; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <div class="card-body">
                                <h1 class="card-title text-center mb-4" style="color: #8c222b;">${this.escapeHtml(e.title)}</h1>
                                ${e.city?`<p class="text-center mb-3" style="color: #8c222b;">📍 ${this.escapeHtml(e.city)}</p>`:""}
                                <p class="card-text" style="color: #8c222b; font-size: 1.1rem;">${this.escapeHtml(e.text)}</p>
                                <p class="card-text mt-3" style="color: #BA2E3A; font-size: 1.2rem; font-weight: bold;">💰 ${o}</p>
                                <hr style="background-color: #BA2E3A;">
                                <div id="accordion-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `}escapeHtml(e){return e?String(e).replace(/[&<>]/g,function(t){return t==="&"?"&amp;":t==="<"?"&lt;":t===">"?"&gt;":t}):""}async clickBack(){const{VacanciesPage:e}=await B(async()=>{const{VacanciesPage:o}=await Promise.resolve().then(()=>E);return{VacanciesPage:o}},void 0);new e(this.parent).render()}async render(){const e=await this.getData();if(!e){this.parent.innerHTML='<div class="alert alert-danger m-4">Вакансия не найдена</div>';return}this.parent.innerHTML="",new f(this.parent).render(this.clickBack.bind(this)),new D(this.parent).render(this.clickBack.bind(this));const r=this.getHTML(e);this.parent.insertAdjacentHTML("beforeend",r);const n=document.getElementById("accordion-container");n&&e.accordionData&&new $(n).render(e.accordionData)}}class y{constructor(e){this.parent=e,this.filterText="",this.vacanciesData=[],this.mergeStates={}}extractSalaryNumber(e){const t=e==null?void 0:e.match(/\d+/g);return t?parseInt(t.join("")):0}findCouple(e,t){const o=[],r=new Set;for(let n=0;n<e.length;n++)if(!r.has(n)){for(let s=n+1;s<e.length;s++)if(!r.has(s)&&e[n]+e[s]===t){const i=e[n]<=e[s]?`${e[n]}+${e[s]}`:`${e[s]}+${e[n]}`;o.push(i),r.add(n),r.add(s);break}}return o}analyzeSalaryPairs(e){const t=this.vacanciesData.map(i=>{var d;const a=(d=i.accordionData)==null?void 0:d.find(c=>c.title==="Заработная плата"),u=a?this.extractSalaryNumber(a.content):0;return{title:i.title,salary:u,salaryString:a?a.content:"0 руб."}}),o=t.map(i=>i.salary),r=this.findCouple(o,e),n=[],s=new Set;for(const i of r){const[a,u]=i.split("+").map(Number),d=t.find(p=>p.salary===a&&!s.has(p.title)),c=t.find(p=>p.salary===u&&p.title!==(d==null?void 0:d.title)&&!s.has(p.title));d&&c&&!s.has(d.title)&&!s.has(c.title)&&(n.push(`${d.title} (${d.salaryString}) + ${c.title} (${c.salaryString})`),s.add(d.title),s.add(c.title))}return n}showSalaryAnalysisForCard(e){const t=document.getElementById(`analysis-result-${e}`);if(!t)return;t.innerHTML=`
            <div style="margin-top: 5px;">
                <input type="number" id="sum-input-${e}" placeholder="Введите сумму" style="width: 100%; padding: 5px; margin-bottom: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px;">
                <button id="find-pairs-${e}" style="width: 100%; padding: 5px; background: #BA2E3A; color: white; border: none; border-radius: 4px; font-size: 12px;">Найти пары</button>
                <div id="pairs-output-${e}" style="margin-top: 5px;"></div>
            </div>
        `;const o=document.getElementById(`find-pairs-${e}`);o&&(o.onclick=()=>{const r=document.getElementById(`sum-input-${e}`),n=parseInt(r.value),s=document.getElementById(`pairs-output-${e}`);if(!n){s.innerHTML='<div style="color: red;">Введите число</div>';return}const i=this.analyzeSalaryPairs(n);i.length===0?s.innerHTML='<div style="color: gray;">Пары не найдены</div>':s.innerHTML=i.map(a=>`<div style="padding: 5px 0; border-bottom: 1px solid #eee;">✓ ${a}</div>`).join("")})}merge(...e){const t={},o=new Set;for(const r of e)for(const n in r){const s=r[n];o.has(s)||(t[n]=s,o.add(s))}return t}showMergeDemoForCard(e){if(this.mergeStates[e]){const c=document.getElementById(`merge-result-${e}`);c&&(c.innerHTML=""),this.mergeStates[e]=!1;return}const t={"Веб-разработчик":"90 000 руб."},o={"Графический дизайнер":"70 000 руб."},r={"Менеджер по работе с клиентами":"60 000 руб."},n={"SMM-менеджер":"50 000 руб."},s={"Копирайтер / Контент-менеджер":"60 000 руб."},i={"Аналитик данных":"85 000 руб."},a={"DevOps инженер":"110 000 руб."},u=this.merge(t,o,r,n,s,i,a),d=document.getElementById(`merge-result-${e}`);d&&(d.innerHTML=`
                <div style="background: rgb(196, 177, 158); padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <strong style="color: #8c222b;">Результат merge():</strong><br>
                    ${Object.entries(u).map(([c,p],h)=>`<span style="display: inline-block; margin: 3px 0;">${h+1}. ${c}: ${p}</span><br>`).join("")}
                </div>
            `),this.mergeStates[e]=!0}getHTML(){return`
            <div id="main-page">
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-md-4">
                            <input type="text" id="search-input" class="form-control" placeholder="Введите название профессии..." style="background: rgb(252, 247, 241); border: 1px solid #BA2E3A; border-radius: 15px; padding: 10px; color: #8c222b; font-family: 'Segoe UI', Arial, sans-serif;">
                        </div>
                        <div class="col-md-2">
                            <button id="search-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Поиск</button>
                        </div>
                        <div class="col-md-2">
                            <button id="add-button" class="btn w-100" style="background: #BA2E3A; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#8c222b'" onmouseout="this.style.background='#BA2E3A'">Добавить</button>
                        </div>
                        <div class="col-md-2">
                            <button id="reset-search-button" class="btn w-100" style="background: #8c222b; color: floralwhite; border: none; border-radius: 4px; padding: 10px; font-family: 'Segoe UI', Arial, sans-serif; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.background='#5a151b'" onmouseout="this.style.background='#8c222b'">Сброс</button>
                        </div>
                    </div>
                    <div id="vacancies-container" class="d-flex flex-wrap"></div>
                </div>
            </div>
        `}async loadVacanciesFromApi(){try{let e=m.getVacancies();this.filterText&&this.filterText.trim()!==""&&(e+=`?title=${encodeURIComponent(this.filterText)}`);const t=await api.get(e);this.vacanciesData=t,this.renderCards()}catch(e){console.error("Ошибка загрузки:",e),this.showError(e.message)}}showError(e){const t=document.getElementById("vacancies-container");t&&(t.innerHTML=`
                <div class="alert alert-danger w-100 text-center" role="alert" style="background: #f8d7da; border-color: #f5c6cb; color: #721c24;">
                    <strong>Ошибка!</strong> Не удалось загрузить вакансии.
                    <br><small>${e||"Проверьте подключение к серверу"}</small>
                </div>
            `)}renderCards(){const e=document.getElementById("vacancies-container");e&&(e.innerHTML="",this.vacanciesData.forEach(o=>{new v(e).render(o,this.clickCard.bind(this),this.deleteCard.bind(this),this.analyzeSalary.bind(this),this.showMerge.bind(this))}))}clickCard(e){new A(this.parent,e).render()}async deleteCard(e){try{await api.delete(m.deleteVacancy(e)),await this.loadVacanciesFromApi()}catch(t){console.error("Ошибка при удалении:",t),alert("Ошибка при удалении")}}async addCard(){if(this.vacanciesData.length===0){alert("Нет вакансий для копирования");return}const e=this.vacanciesData[0],r={id:Math.max(...this.vacanciesData.map(n=>n.id))+1,title:`${e.title} (копия)`,text:e.text,city:e.city||"Не указан",accordionData:JSON.parse(JSON.stringify(e.accordionData))};try{await api.post(m.createVacancy(),r),await this.loadVacanciesFromApi()}catch(n){console.error("Ошибка при добавлении:",n),alert("Ошибка при добавлении вакансии")}}analyzeSalary(e){this.showSalaryAnalysisForCard(e)}showMerge(e){this.showMergeDemoForCard(e)}performSearch(){const e=document.getElementById("search-input");e&&(this.filterText=e.value,this.loadVacanciesFromApi())}resetSearch(){const e=document.getElementById("search-input");e&&(e.value="",this.filterText="",this.loadVacanciesFromApi())}setupEventListeners(){const e=document.getElementById("search-button");e&&e.addEventListener("click",()=>this.performSearch());const t=document.getElementById("add-button");t&&t.addEventListener("click",()=>this.addCard());const o=document.getElementById("reset-search-button");o&&o.addEventListener("click",()=>this.resetSearch());const r=document.getElementById("search-input");r&&r.addEventListener("keypress",n=>{n.key==="Enter"&&this.performSearch()})}clickHome(){this.resetSearch(),this.render()}render(){this.parent.innerHTML="",new f(this.parent).render(this.clickHome.bind(this));const t=this.getHTML();this.parent.insertAdjacentHTML("beforeend",t),this.loadVacanciesFromApi(),this.setupEventListeners()}}const E=Object.freeze(Object.defineProperty({__proto__:null,VacanciesPage:y},Symbol.toStringTag,{value:"Module"})),k=document.getElementById("app"),L=new y(k);L.render();
