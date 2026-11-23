const gradeMinhaLista = document.getElementById("my-games-grid");
const totalMinhaLista = document.getElementById("list-total");
const jogandoMinhaLista = document.getElementById("list-playing");
const concluidosMinhaLista = document.getElementById("list-completed");
const filtrosStatus = document.queryAll
    ? document.queryAll(".filter-tab")
    : document.querySelectorAll(".filter-tab");
let jogosDaLista = [];

function nomeStatus(status) {
    const nomes = {
        "quero-jogar": "Quero jogar",
        jogando: "Jogando",
        concluido: "Concluído",
        abandonado: "Abandonado"
    };
    return nomes[status] || "Quero jogar";
}

async function carregarMinhaLista(statusSelecionado = "todos") {
    if (!gradeMinhaLista) return;

    try {
        const jogos = await listarJogos();
        jogosDaLista = jogos.filter((jogo) => Number(jogo.na_lista) === 1);

        totalMinhaLista.textContent = jogosDaLista.length;
        jogandoMinhaLista.textContent =
            jogosDaLista.filter((jogo) => jogo.status === "jogando").length;
        concluidosMinhaLista.textContent =
            jogosDaLista.filter((jogo) => jogo.status === "concluido").length;

        const filtrados = statusSelecionado === "todos"
            ? jogosDaLista
            : jogosDaLista.filter((jogo) => jogo.status === statusSelecionado);

        gradeMinhaLista.innerHTML = "";

        if (filtrados.length === 0) {
            gradeMinhaLista.innerHTML =
                '<p>Nenhum jogo encontrado nesta categoria da sua lista.</p>';
            return;
        }

        filtrados.forEach((jogo) => {
            const card = document.createElement("article");
            card.className = "game-card";

            if (jogo.imagem) {
                const capa = document.createElement("div");
                capa.className = "game-cover";
                const imagem = document.createElement("img");
                imagem.src = jogo.imagem;
                imagem.alt = `Capa de ${jogo.titulo}`;
                capa.appendChild(imagem);
                card.appendChild(capa);
            }

            const info = document.createElement("div");
            info.className = "game-info";

            const titulo = document.createElement("h3");
            titulo.textContent = jogo.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = jogo.descricao || jogo.genero;

            const rodape = document.createElement("div");
            rodape.className = "game-card-footer";

            const status = document.createElement("select");
            status.className = "filter-select";
            status.innerHTML = `
                <option value="quero-jogar">Quero jogar</option>
                <option value="jogando">Jogando</option>
                <option value="concluido">Concluído</option>
                <option value="abandonado">Abandonado</option>
            `;
            status.value = jogo.status || "quero-jogar";
            status.addEventListener("change", async () => {
                await alterarStatus(jogo.id, status.value);
                await carregarMinhaLista(statusSelecionado);
            });

            const favorito = document.createElement("button");
            favorito.type = "button";
            favorito.className = "favorite-button";
            favorito.textContent = Number(jogo.favorito) === 1 ? "♥" : "♡";
            favorito.addEventListener("click", async () => {
                await alternarFavorito(jogo.id, Number(jogo.favorito) === 1 ? 0 : 1);
                await carregarMinhaLista(statusSelecionado);
            });

            rodape.appendChild(status);
            rodape.appendChild(favorito);
            info.appendChild(titulo);
            info.appendChild(descricao);
            info.appendChild(rodape);
            card.appendChild(info);
            gradeMinhaLista.appendChild(card);
        });
    } catch (erro) {
        gradeMinhaLista.textContent = erro.message;
    }
}

filtrosStatus.forEach((botao) => {
    botao.addEventListener("click", () => {
        filtrosStatus.forEach((item) => item.classList.remove("active"));
        botao.classList.add("active");
        carregarMinhaLista(botao.dataset.status);
    });
});

document.addEventListener("DOMContentLoaded", () => carregarMinhaLista());
