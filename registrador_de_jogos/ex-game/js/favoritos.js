const gradeFavoritos = document.getElementById("favorites-grid");
const contadorFavoritos = document.getElementById("favorites-count");

async function carregarFavoritos() {
    if (!gradeFavoritos) return;

    try {
        const jogos = await listarJogos();
        const favoritos = jogos.filter((jogo) => Number(jogo.favorito) === 1);

        contadorFavoritos.textContent =
            `${favoritos.length} ${favoritos.length === 1 ? "jogo" : "jogos"}`;

        gradeFavoritos.innerHTML = "";

        if (favoritos.length === 0) {
            const vazio = document.createElement("div");
            vazio.className = "empty-state";
            vazio.innerHTML = `
                <span class="empty-icon">♡</span>
                <h2>Nenhum jogo favorito</h2>
                <p>Marque jogos como favoritos para vê-los aqui.</p>
                <a href="../../index.html" class="primary-button">Ver jogos</a>
            `;
            gradeFavoritos.appendChild(vazio);
            return;
        }

        favoritos.forEach((jogo) => {
            const card = document.createElement("article");
            card.className = "favorite-card";

            if (jogo.imagem) {
                const imagem = document.createElement("img");
                imagem.src = jogo.imagem;
                imagem.alt = `Capa do jogo ${jogo.titulo}`;
                card.appendChild(imagem);
            }

            const conteudo = document.createElement("div");
            conteudo.className = "favorite-card-content";

            const titulo = document.createElement("h3");
            titulo.textContent = jogo.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = jogo.descricao || jogo.genero;

            const rodape = document.createElement("div");
            rodape.className = "favorite-card-footer";

            const genero = document.createElement("span");
            genero.className = "game-status";
            genero.textContent = jogo.genero;

            const remover = document.createElement("button");
            remover.type = "button";
            remover.className = "remove-favorite";
            remover.textContent = "♥ Remover";
            remover.setAttribute(
                "aria-label",
                `Remover ${jogo.titulo} dos favoritos`
            );

            remover.addEventListener("click", async () => {
                try {
                    await alternarFavorito(jogo.id, 0);
                    await carregarFavoritos();
                } catch (erro) {
                    alert(erro.message);
                }
            });

            rodape.appendChild(genero);
            rodape.appendChild(remover);
            conteudo.appendChild(titulo);
            conteudo.appendChild(descricao);
            conteudo.appendChild(rodape);
            card.appendChild(conteudo);
            gradeFavoritos.appendChild(card);
        });
    } catch (erro) {
        contadorFavoritos.textContent = "Erro ao carregar";
        gradeFavoritos.textContent = erro.message;
    }
}

document.addEventListener("DOMContentLoaded", carregarFavoritos);
