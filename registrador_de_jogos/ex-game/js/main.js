async function atualizarEstatisticasInicio() {
    const elementos = {
        jogos: document.getElementById("total-games"),
        favoritos: document.getElementById("total-favorites"),
    };

    if (!elementos.jogos && !elementos.favoritos && !elementos.destaques) return;

    try {
        const jogos = await listarJogos();
        if (elementos.jogos) elementos.jogos.textContent = jogos.length;
        if (elementos.favoritos) {
            elementos.favoritos.textContent =
                jogos.filter((jogo) => Number(jogo.favorito) === 1).length;
        }
    } catch (erro) {
        console.error("Erro ao atualizar estatísticas:", erro);
    }
}

async function carregarCatalogoInicio() {
    const grade = document.getElementById("home-games-grid");
    if (!grade) return;

    try {
        const jogos = await listarJogos();
        const parametros = new URLSearchParams(window.location.search);
        const termo = (parametros.get("q") || "").trim();
        const genero = (parametros.get("genero") || "").trim();
        const campoBusca = document.querySelector(".search-box input");
        if (campoBusca) campoBusca.value = termo;

        const normalizar = (valor) =>
            String(valor || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        const catalogo = jogos.filter((jogo) =>
            Number(jogo.catalogo) === 1
        );

        const filtrados = catalogo.filter((jogo) => {
            const termoNormalizado = normalizar(termo);
            const correspondeBusca = !termoNormalizado ||
                [jogo.titulo, jogo.genero, jogo.plataforma, jogo.desenvolvedora]
                    .some((valor) => normalizar(valor).includes(termoNormalizado));
            const correspondeGenero = !genero ||
                normalizar(jogo.genero).includes(normalizar(genero));
            return correspondeBusca && correspondeGenero;
        });

        grade.innerHTML = "";
        if (filtrados.length === 0) {
            grade.innerHTML = "<p>Nenhum jogo encontrado.</p>";
            return;
        }

        filtrados.forEach((jogo) => {
            const card = document.createElement("article");
            card.className = "game-card";

            const link = document.createElement("a");
            link.href = `ex-game/pages/detalhes.html?id=${jogo.id}`;
            link.className = "game-cover-link";

            if (jogo.imagem) {
                const imagem = document.createElement("img");
                imagem.src = jogo.imagem;
                imagem.alt = `Capa de ${jogo.titulo}`;
                imagem.className = "game-cover";
                link.appendChild(imagem);
            }

            const info = document.createElement("div");
            info.className = "game-info";
            info.innerHTML = `
                <span class="game-category">${jogo.genero}</span>
                <h3>${jogo.titulo}</h3>
                <p>${jogo.plataforma} • ${jogo.desenvolvedora || "Desenvolvedora não informada"}</p>
            `;

            const rodape = document.createElement("div");
            rodape.className = "game-card-footer";
            const plataforma = document.createElement("span");
            plataforma.className = "game-platform";
            plataforma.textContent = jogo.plataforma;
            const favorito = document.createElement("button");
            favorito.type = "button";
            favorito.className = "favorite-button";
            favorito.textContent = Number(jogo.favorito) === 1 ? "♥" : "♡";
            favorito.addEventListener("click", async () => {
                await alternarFavorito(
                    jogo.id,
                    Number(jogo.favorito) === 1 ? 0 : 1
                );
                await carregarCatalogoInicio();
                await atualizarEstatisticasInicio();
            });
            rodape.appendChild(plataforma);
            rodape.appendChild(favorito);
            info.appendChild(rodape);
            card.appendChild(link);
            card.appendChild(info);
            grade.appendChild(card);
        });
    } catch (erro) {
        grade.textContent = "Não foi possível carregar os jogos.";
        console.error("Erro ao carregar catálogo:", erro);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarEstatisticasInicio();
    carregarCatalogoInicio();
});