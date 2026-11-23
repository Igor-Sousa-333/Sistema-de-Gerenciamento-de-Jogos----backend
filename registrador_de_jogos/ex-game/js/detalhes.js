
const imagemJogo = document.getElementById("details-image");
const tituloJogo = document.getElementById("details-title");
const descricaoJogo = document.getElementById("details-description");
const generoJogo = document.getElementById("details-genre");
const plataformaJogo = document.getElementById("details-platform");
const desenvolvedoraJogo = document.getElementById("details-developer");
const categoriaJogo = document.getElementById("details-category");

const formularioEdicao = document.getElementById("edit-game-form");
const botaoEditar = document.getElementById("edit-game-button");
const botaoCancelar = document.getElementById("cancel-edit-button");
const botaoExcluir = document.getElementById("delete-game-button");
const botaoFavorito = document.getElementById("details-favorite-button");
const botaoLista = document.getElementById("details-list-button");

let jogoAtual;

// Obtém o ID do jogo pela URL
const parametros = new URLSearchParams(window.location.search);
const idJogo = parametros.get("id");

// Carrega os dados do jogo pela API
async function carregarDetalhes() {
    try {
        if (!idJogo) {
            throw new Error("ID do jogo não informado na URL.");
        }

        jogoAtual = await buscarJogo(idJogo);

        exibirDetalhes();
        
    } catch (erro) {
        tituloJogo.textContent = "Não foi possível carregar o jogo.";
        descricaoJogo.textContent = erro.message;
        console.error("Erro ao carregar detalhes:", erro);
    }
}

// Exibe os dados na página
function exibirDetalhes() {
    tituloJogo.textContent = jogoAtual.titulo;
    descricaoJogo.textContent = jogoAtual.descricao || "Sem descrição.";
    generoJogo.textContent = jogoAtual.genero;
    plataformaJogo.textContent = jogoAtual.plataforma;
    desenvolvedoraJogo.textContent =
        jogoAtual.desenvolvedora || "Não informado";

    categoriaJogo.textContent = jogoAtual.genero;

    imagemJogo.src = jogoAtual.imagem || "";
    imagemJogo.alt = `Capa de ${jogoAtual.titulo}`;

    atualizarBotaoFavorito();
    atualizarBotaoLista();
}

function atualizarBotaoLista() {
    if (!botaoLista) return;
    botaoLista.textContent = Number(jogoAtual.na_lista) === 1
        ? "✓ Na minha lista"
        : "+ Adicionar à minha lista";
}

// Atualiza o botão de favorito
function atualizarBotaoFavorito() {
    if (!botaoFavorito) return;
    botaoFavorito.textContent =
        jogoAtual.favorito === 1
            ? "♥ Remover dos favoritos"
            : "♡ Adicionar aos favoritos";
}

// Preenche o formulário com os dados atuais
function preencherFormulario() {
    document.getElementById("edit-title").value = jogoAtual.titulo;
    document.getElementById("edit-platform").value = jogoAtual.plataforma;
    document.getElementById("edit-genre").value = jogoAtual.genero;
    document.getElementById("edit-image").value = jogoAtual.imagem || "";
    document.getElementById("edit-description").value = jogoAtual.descricao || "";
    document.getElementById("edit-developer").value =
        jogoAtual.desenvolvedora || "";
}

// Abre o formulário de edição
if (botaoEditar) {
    botaoEditar.addEventListener("click", () => {
        preencherFormulario();
        formularioEdicao.hidden = false;
    });
}

// Cancela a edição
if (botaoCancelar) {
    botaoCancelar.addEventListener("click", () => {
        formularioEdicao.hidden = true;
    });
}

// Envia as alterações para a API
if (formularioEdicao) formularioEdicao.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dadosAtualizados = {
        titulo: document.getElementById("edit-title").value.trim(),
        plataforma: document.getElementById("edit-platform").value.trim(),
        genero: document.getElementById("edit-genre").value.trim(),
        imagem: document.getElementById("edit-image").value.trim(),
        descricao: document.getElementById("edit-description").value.trim(),
        desenvolvedora: document.getElementById("edit-developer").value.trim(),
        favorito: jogoAtual.favorito
    };

    try {
        jogoAtual = await atualizarJogo(idJogo, dadosAtualizados);

        exibirDetalhes();
        formularioEdicao.hidden = true;

        alert("Jogo atualizado com sucesso!");

    } catch (erro) {
        alert("Erro ao atualizar jogo: " + erro.message);
        console.error("Erro na atualização:", erro);
    }
});

// Alterna o favorito
if (botaoFavorito) botaoFavorito.addEventListener("click", async () => {
    try {
        const novoValor = jogoAtual.favorito === 1 ? 0 : 1;

        jogoAtual = await alternarFavorito(idJogo, novoValor);

        atualizarBotaoFavorito();

    } catch (erro) {
        alert("Erro ao atualizar favorito: " + erro.message);
        console.error("Erro no favorito:", erro);
    }
});

if (botaoLista) {
    botaoLista.addEventListener("click", async () => {
        try {
            const novoValor = Number(jogoAtual.na_lista) === 1 ? 0 : 1;
            jogoAtual = await alterarLista(idJogo, novoValor);
            atualizarBotaoLista();
        } catch (erro) {
            alert("Erro ao atualizar minha lista: " + erro.message);
        }
    });
}

// Exclui o jogo
if (botaoExcluir) botaoExcluir.addEventListener("click", async () => {
    const confirmacao = confirm(
        `Deseja realmente excluir "${jogoAtual.titulo}"?`
    );

    if (!confirmacao) return;

    try {
        await excluirJogo(idJogo);

        alert("Jogo excluído com sucesso!");

        window.location.href = "../../index.html";

    } catch (erro) {
        alert("Erro ao excluir jogo: " + erro.message);
        console.error("Erro na exclusão:", erro);
    }
});

// Inicia a página
document.addEventListener("DOMContentLoaded", carregarDetalhes);
