let db = { competidores: [], times: [], jogos: [], confrontos: [] };

// Simula o fetch do JSON inicial
async function init() {
    try {
        const response = await fetch('dados.json');
        db = await response.json();
        renderAll();
    } catch (e) {
        console.error("Erro ao carregar JSON. Verifique se está usando um servidor local.", e);
    }
}

// Navegação de Abas
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Renderização Geral
function renderAll() {
    renderList('lista-competidores', db.competidores, (c) => `<span>${c.nome}</span>`);
    renderList('lista-times', db.times, (t) => `<span>${t.nome}</span>`);
    renderList('lista-jogos', db.jogos, (j) => `<span>${j.nome}</span>`);
    
    // Renderiza Confrontos
    const containerConf = document.getElementById('lista-confrontos');
    containerConf.innerHTML = db.confrontos.map(c => {
        const t1 = db.times.find(t => t.id == c.idTime1)?.nome;
        const t2 = db.times.find(t => t.id == c.idTime2)?.nome;
        const jogo = db.jogos.find(j => j.id == c.idJogo)?.nome;
        return `<div class="confronto-card">
            <strong>${jogo}</strong><br>
            ${t1} <small>${c.placar}</small> ${t2}
        </div>`;
    }).join('');

    updateSelects();
}

function renderList(id, data, template) {
    const el = document.getElementById(id);
    el.innerHTML = data.map(item => `<li>${template(item)}</li>`).join('');
}

function updateSelects() {
    const fill = (id, data) => {
        const sel = document.getElementById(id);
        sel.innerHTML = data.map(i => `<option value="${i.id}">${i.nome}</option>`).join('');
    };
    fill('select-time1', db.times);
    fill('select-time2', db.times);
    fill('select-jogo', db.jogos);
}

// Handlers de Formulário
document.getElementById('form-competidor').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-comp').value;
    db.competidores.push({ id: Date.now(), nome });
    e.target.reset();
    renderAll();
};

document.getElementById('form-time').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-time').value;
    db.times.push({ id: Date.now(), nome, membros: [] });
    e.target.reset();
    renderAll();
};

document.getElementById('form-jogo').onsubmit = (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-jogo').value;
    db.jogos.push({ id: Date.now(), nome });
    e.target.reset();
    renderAll();
};

document.getElementById('form-confronto').onsubmit = (e) => {
    e.preventDefault();
    db.confrontos.push({
        id: Date.now(),
        idTime1: document.getElementById('select-time1').value,
        idTime2: document.getElementById('select-time2').value,
        idJogo: document.getElementById('select-jogo').value,
        placar: document.getElementById('placar').value
    });
    renderAll();
};

init();