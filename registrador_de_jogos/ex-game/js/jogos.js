
// Elementos da página Explorar
const gradeJogos = document.getElementById("explore-games-grid");
const contadorJogos = document.getElementById("explore-results-count");

// Carrega os jogos cadastrados no banco de dados
async function carregarJogos() {
    if (!gradeJogos) return;

    try {
        const jogos = await listarJogos();
        const parametros = new URLSearchParams(window.location.search);
        const termoPesquisa = (parametros.get("q") || "").trim();
        const generoPesquisa = (parametros.get("genero") || "").trim();
        const campoPesquisa = document.getElementById("game-search");

        if (campoPesquisa && termoPesquisa) {
            campoPesquisa.value = termoPesquisa;
        }

        const filtroGenero = document.getElementById("genre-filter");
        if (filtroGenero) {
            if (generoPesquisa) {
                filtroGenero.value = generoPesquisa;
            }

            filtroGenero.addEventListener("change", () => {
                const parametros = new URLSearchParams(window.location.search);
                if (filtroGenero.value === "todos") {
                    parametros.delete("genero");
                } else {
                    parametros.set("genero", filtroGenero.value);
                }
                window.location.search = parametros.toString();
            });
        }

        const normalizar = (valor) =>
            String(valor || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

        const termoNormalizado = normalizar(termoPesquisa);
        const generoNormalizado = normalizar(generoPesquisa);

        const jogosFiltrados = jogos.filter((jogo) => {
            const pertenceAoCatalogo = Number(jogo.catalogo) === 1 ||
                Number(jogo.na_lista) === 1;

            if (!pertenceAoCatalogo) return false;
            const correspondePesquisa = !termoNormalizado ||
                [
                    jogo.titulo,
                    jogo.genero,
                    jogo.plataforma,
                    jogo.descricao,
                    jogo.desenvolvedora
                ].some((valor) => normalizar(valor).includes(termoNormalizado));

            const correspondeGenero = !generoNormalizado ||
                normalizar(jogo.genero).includes(generoNormalizado);

            return correspondePesquisa && correspondeGenero;
        });

        // Limpa os cartões anteriores
        gradeJogos.innerHTML = "";

        // Atualiza a quantidade de jogos
        contadorJogos.textContent =
            `${jogosFiltrados.length} ${jogosFiltrados.length === 1 ? "jogo encontrado" : "jogos encontrados"}`;

        // Exibe uma mensagem quando não existem jogos
        if (jogosFiltrados.length === 0) {
            gradeJogos.textContent = termoPesquisa
                ? `Nenhum jogo encontrado para "${termoPesquisa}".`
                : generoPesquisa
                    ? "Nenhum jogo encontrado nesta categoria."
                    : "Nenhum jogo cadastrado ainda.";
            return;
        }

        // Cria um cartão para cada jogo recebido da API
        jogosFiltrados.forEach(jogo => {
            const cartao = document.createElement("article");
            cartao.className = "game-card";

            const capa = document.createElement("div");
            capa.className = "game-cover";

            if (jogo.imagem) {
                const imagem = document.createElement("img");
                imagem.src = jogo.imagem;
                imagem.alt = `Capa de ${jogo.titulo}`;
                capa.appendChild(imagem);
            }

            const informacoes = document.createElement("div");
            informacoes.className = "game-info";

            const titulo = document.createElement("h3");
            titulo.textContent = jogo.titulo;

            const descricao = document.createElement("p");
            descricao.textContent = jogo.descricao || jogo.genero;

            const rodape = document.createElement("div");
            rodape.className = "game-card-footer";

            const categoria = document.createElement("span");
            categoria.className = "game-category";
            categoria.textContent = jogo.genero;

            const favorito = document.createElement("button");
            favorito.className = "favorite-button";
            favorito.type = "button";

            // Atualiza a aparência do botão de favorito
            function atualizarBotaoFavorito() {
                favorito.textContent = jogo.favorito === 1 ? "♥" : "♡";
                favorito.setAttribute(
                    "aria-label",
                    jogo.favorito === 1
                        ? `Remover ${jogo.titulo} dos favoritos`
                        : `Adicionar ${jogo.titulo} aos favoritos`
                );
            }

            atualizarBotaoFavorito();

            // Altera o favorito no banco de dados
            favorito.addEventListener("click", async () => {
                try {
                    const novoValor = jogo.favorito === 1 ? 0 : 1;

                    const jogoAtualizado = await alternarFavorito(
                        jogo.id,
                        novoValor
                    );

                    jogo.favorito = jogoAtualizado.favorito;
                    atualizarBotaoFavorito();

                } catch (erro) {
                    alert(erro.message);
                }
            });

            rodape.appendChild(categoria);
            rodape.appendChild(favorito);

            const detalhes = document.createElement("a");
            detalhes.href = `detalhes.html?id=${jogo.id}`;
            detalhes.className = "details-link";
            detalhes.textContent = "Ver detalhes";

            informacoes.appendChild(titulo);
            informacoes.appendChild(descricao);
            informacoes.appendChild(rodape);
            informacoes.appendChild(detalhes);

            cartao.appendChild(capa);
            cartao.appendChild(informacoes);

            gradeJogos.appendChild(cartao);
        });

    } catch (erro) {
        contadorJogos.textContent = "Erro ao carregar jogos.";
        gradeJogos.textContent = erro.message;
        console.error("Erro ao carregar catálogo:", erro);
    }
}

// Executa o carregamento quando a página estiver pronta
document.addEventListener("DOMContentLoaded", carregarJogos);
