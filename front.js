// Nosso banco de dados na memória
let bd = { competidores: [], times: [], jogos: [], confrontos: [] };

// Função que inicia o sistema
async function iniciarSistema() {
    try {
        // Tenta ler o JSON externo
        const resposta = await fetch('dados.json');
        if (!resposta.ok) throw new Error("Não conseguiu ler o arquivo");
        bd = await resposta.json();
    } catch (erro) {
        console.warn("Bloqueio de navegador detectado. Usando dados de teste internos.");
        // Se o navegador bloquear o JSON, ele carrega estes dados para não quebrar a tela
        bd = {
            "competidores": [{"id": 1, "nome": "Alice Souza"}, {"id": 2, "nome": "Bruno Lima"}],
            "times": [{"id": 1, "nome": "Cyber Knights"}, {"id": 2, "nome": "Data Wizards"}],
            "jogos": [{"id": 1, "nome": "League of Legends"}, {"id": 2, "nome": "Valorant"}],
            "confrontos": [{"id": 1, "idTime1": 1, "idTime2": 2, "idJogo": 1, "placar": "2 x 1"}]
        };
    }
    atualizarTela();
}

// Navegação entre as abas
function mudarAba(idAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(idAba).classList.add('ativa');
}

// Atualiza todas as listas e selects da tela
function atualizarTela() {
    // Atualiza listas simples
    renderizarLista('lista-competidores', bd.competidores);
    renderizarLista('lista-times', bd.times);
    renderizarLista('lista-jogos', bd.jogos);

    // Atualiza os selects do formulário de confrontos
    preencherSelect('select-time1', bd.times);
    preencherSelect('select-time2', bd.times);
    preencherSelect('select-jogo', bd.jogos);

    // Atualiza os cards de confrontos
    const containerConfrontos = document.getElementById('lista-confrontos');
    containerConfrontos.innerHTML = bd.confrontos.map(conf => {
        const time1 = bd.times.find(t => t.id == conf.idTime1)?.nome || 'Time Removido';
        const time2 = bd.times.find(t => t.id == conf.idTime2)?.nome || 'Time Removido';
        const jogo = bd.jogos.find(j => j.id == conf.idJogo)?.nome || 'Jogo Removido';
        
        return `
            <div class="card-confronto">
                <h4>${jogo}</h4>
                <p><strong>${time1}</strong> ${conf.placar} <strong>${time2}</strong></p>
            </div>
        `;
    }).join('');
}

// Funções de ajuda para desenhar na tela
function renderizarLista(idElemento, arrayDados) {
    document.getElementById(idElemento).innerHTML = arrayDados.map(item => `<li>${item.nome}</li>`).join('');
}

function preencherSelect(idElemento, arrayDados) {
    document.getElementById(idElemento).innerHTML = arrayDados.map(item => `<option value="${item.id}">${item.nome}</option>`).join('');
}

// --- EVENTOS DE FORMULÁRIO (CADASTROS) ---

document.getElementById('form-competidor').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome-competidor').value;
    bd.competidores.push({ id: Date.now(), nome: nome });
    this.reset();
    atualizarTela();
});

document.getElementById('form-time').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome-time').value;
    bd.times.push({ id: Date.now(), nome: nome });
    this.reset();
    atualizarTela();
});

document.getElementById('form-jogo').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome-jogo').value;
    bd.jogos.push({ id: Date.now(), nome: nome });
    this.reset();
    atualizarTela();
});

document.getElementById('form-confronto').addEventListener('submit', function(e) {
    e.preventDefault();
    bd.confrontos.push({
        id: Date.now(),
        idTime1: document.getElementById('select-time1').value,
        idTime2: document.getElementById('select-time2').value,
        idJogo: document.getElementById('select-jogo').value,
        placar: document.getElementById('placar').value
    });
    this.reset();
    atualizarTela();
});

// Roda a função principal quando a página carrega
iniciarSistema();
