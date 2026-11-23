// Endereço principal da API de jogos
const API = "http://localhost:3000/jogos";

// Função auxiliar para realizar as requisições
async function fazerRequisicao(url, opcoes = {}) {
    let resposta;

    try {
        // Envia a requisição e aguarda a resposta do servidor
        resposta = await fetch(url, opcoes);
    } catch (erro) {
        // Trata erros de conexão com o servidor
        throw new Error("Não foi possível conectar ao servidor.");
    }

    let dados;

    try {
        // Converte a resposta recebida para JSON
        dados = await resposta.json();
    } catch (erro) {
        // Trata respostas que não possuem JSON válido
        throw new Error("Não foi possível interpretar a resposta do servidor.");
    }

    // Verifica se o servidor retornou algum erro HTTP
    if (!resposta.ok) {
        throw new Error(dados.erro || "Ocorreu um erro na requisição.");
    }

    // Retorna os dados recebidos
    return dados;
}

// GET - Lista todos os jogos cadastrados
async function listarJogos() {
    return await fazerRequisicao(API);
}

// GET - Busca um jogo específico pelo ID
async function buscarJogo(id) {
    return await fazerRequisicao(`${API}/${id}`);
}

// POST - Cadastra um novo jogo
async function cadastrarJogo(dados) {
    return await fazerRequisicao(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
}

// PUT - Atualiza os dados de um jogo
async function atualizarJogo(id, dados) {
    return await fazerRequisicao(`${API}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    });
}

// DELETE - Exclui um jogo pelo ID
async function excluirJogo(id) {
    return await fazerRequisicao(`${API}/${id}`, {
        method: "DELETE"
    });
}

// PATCH - Altera o favorito de um jogo
async function alternarFavorito(id, favorito) {
    // Prepara a requisição PATCH
    const opcoes = {
        method: "PATCH"
    };

    // Verifica se foi informado um valor para favorito
    if (favorito !== undefined) {
        opcoes.headers = {
            "Content-Type": "application/json"
        };

        // Envia o valor 0 ou 1 para o servidor
        opcoes.body = JSON.stringify({ favorito });
    }

    // Envia a requisição e retorna o jogo atualizado
    return await fazerRequisicao(`${API}/${id}/favorito`, opcoes);
}

// Disponibiliza as funções para os outros arquivos JavaScript
window.listarJogos = listarJogos;
window.buscarJogo = buscarJogo;
window.cadastrarJogo = cadastrarJogo;
window.atualizarJogo = atualizarJogo;
window.excluirJogo = excluirJogo;
window.alternarFavorito = alternarFavorito;
window.alterarLista = async function(id, naLista) {
    return await fazerRequisicao(`${API}/${id}/lista`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ na_lista: naLista })
    });
};
window.alterarStatus = async function(id, status) {
    return await fazerRequisicao(`${API}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
};
