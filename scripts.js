// Ela vai até o seu servidor Node.js pedir os livros
console.log("Script scripts.js carregado com sucesso.");

async function carregarLivrosDoBackEnd() {
    console.log("Tentando carregar livros do back-end...");
    try {
        // Pede os dados para o back-end (que está rodando no terminal CMD na porta 3000)
        const response = await fetch('http://localhost:3000/api/livros');
        
        if (!response.ok) {
            throw new Error('Erro ao carregar dados do back-end: ' + response.statusText);
        }
        
        // Transforma a resposta em um objeto JavaScript (JSON)
        const data = await response.json();
        console.log("Dados do back-end recebidos com sucesso:", data);
        return data; // Retorna a lista de livros real
    } catch (error) {
        console.error("Erro na integração:", error);
        return []; // Retorna lista vazia em caso de erro
    }
}


function scrollToLivros() {
    const livrosSection = document.getElementById('livros');
    if (livrosSection) {
        livrosSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function criarElementoLivro(livro) {
    const livroDiv = document.createElement('div');
    livroDiv.className = 'livro';
    livroDiv.innerHTML = `
        <img src="${livro.imagem}" alt="${livro.titulo}">
        <h4>${livro.titulo}</h4>
        <button onclick="abrirModal('${livro.titulo}', '${livro.imagem}', '${livro.descricao}')"></button>
    `;
    return livroDiv;
}

function abrirModal(titulo, imagem, descricao) {
    const modalTitulo = document.getElementById('modal-titulo');
    const modalImagem = document.getElementById('modal-imagem');
    const modalDescricao = document.getElementById('modal-descricao');
    const mascaraModal = document.getElementById('mascara-modal');
    const modal = document.getElementById('modal');

    if (modalTitulo && modalImagem && modalDescricao && mascaraModal && modal) {
        modalTitulo.textContent = titulo;
        modalImagem.src = imagem;
        modalDescricao.textContent = descricao;
        mascaraModal.style.display = 'block';
        modal.style.display = 'block';
    }
}

function fecharModal() {
    const mascaraModal = document.getElementById('mascara-modal');
    const modal = document.getElementById('modal');
    if (mascaraModal && modal) {
        mascaraModal.style.display = 'none';
        modal.style.display = 'none';
    }
}

// FUNÇÃO RENDERLIVROS AGORA É ASYNC PARA ESPERAR O FETCH()
async function renderLivros(tabName) {
    // AQUI USAMOS O FETCH:
    const livrosData = await carregarLivrosDoBackEnd(); 

    const container = document.querySelector(`#${tabName} .livros-container`);
    if (!container) return; 

    container.innerHTML = ''; 
    let livrosFiltrados;

    if (tabName === 'todos') {
        livrosFiltrados = livrosData; // Usa os dados do fetch
    } else {
        // Filtra os dados que vieram do back-end
        livrosFiltrados = livrosData.filter(livro => livro.categoria === tabName);
    }

    livrosFiltrados.forEach(livro => {
        container.appendChild(criarElementoLivro(livro));
    });
}

function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) selectedTab.classList.add('active');

    const selectedButton = document.querySelector(`[aria-controls="${tabName}"]`);
    if (selectedButton) selectedButton.classList.add('active');

    renderLivros(tabName);
}

// Função para renderizar todos os livros em uma página de catálogo (também adaptada para async)
async function renderAllBooksInPage(container) {
    console.log("Iniciando renderização de todos os livros na página.");
    const livrosData = await carregarLivrosDoBackEnd(); // Pega a lista real

    if (!container) return;
    container.innerHTML = '';

    if (livrosData.length === 0) {
        container.innerHTML = '<p>Nenhum livro encontrado no catálogo.</p>';
        console.log("Nenhum livro para renderizar.");
        return;
    }

    livrosData.forEach(livro => {
        container.appendChild(criarElementoLivro(livro));
    });
    console.log(`Renderização completa. Total de livros: ${livrosData.length}`);
}

// Evento que inicia o carregamento quando a página é aberta
document.addEventListener('DOMContentLoaded', async () => { 
    console.log("Evento DOMContentLoaded disparado.");

    // Tenta encontrar o container da página de catálogo
    const catalogoPageContainer = document.getElementById('catalogo-pagina');

    if (catalogoPageContainer) {
        console.log("Modo Catálogo Página detectado.");

        // Encontra o container específico para os livros DENTRO da seção principal
        const containerDiv = catalogoPageContainer.querySelector('.livros-container');
        
        if (containerDiv) {
            console.log("Container de livros encontrado. Carregando dados...");
            // Remove "Carregando livros..." temporário
            const tempP = catalogoPageContainer.querySelector('p');
            if(tempP && tempP.textContent === 'Carregando livros...') {
                tempP.remove();
            }
            await renderAllBooksInPage(containerDiv); // Isso inicia o FETCH da API
        } else {
            console.error("ERRO CRÍTICO: Elemento .livros-container não encontrado dentro de #catalogo-pagina!");
        }
    } else {
        console.log("Página inicial ou outra página detectada. Carregamento de catálogo não iniciado.");
        
        // Lógica para a página inicial com abas, se necessário
        const mainTabsContainer = document.getElementById('todos');
        if (mainTabsContainer) {
            openTab('todos');
        }
    }
});