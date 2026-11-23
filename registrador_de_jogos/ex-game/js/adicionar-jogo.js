const formulario = document.getElementById("game-form");

const campoTitulo = document.getElementById("game-title");
const campoPlataforma = document.getElementById("game-platform");
const campoGenero = document.getElementById("game-genre");
const campoImagem = document.getElementById("game-image");
const campoFavorito = document.getElementById("game-favorite");

const previewTitulo = document.getElementById("preview-title");
const previewGenero = document.getElementById("preview-genre");
const previewPlataforma = document.getElementById("preview-platform");
const previewPlataformaTag = document.getElementById("preview-platform-tag");
const previewFavorito = document.getElementById("preview-favorite");
const previewCapa = document.getElementById("game-preview-cover");
const previewPlaceholder = document.getElementById("preview-placeholder");

function atualizarPrevia() {
    const titulo = campoTitulo.value.trim();
    const plataforma = campoPlataforma.value;
    const genero = campoGenero.value;
    const favorito = Number(campoFavorito.value) === 1;

    previewTitulo.textContent = titulo || "Nome do jogo";
    previewGenero.textContent = genero || "Gênero";
    previewPlataforma.textContent = plataforma || "Plataforma";
    previewPlataformaTag.textContent = plataforma || "Plataforma";
    previewFavorito.textContent = favorito ? "♥" : "♡";
    previewFavorito.setAttribute(
        "aria-label",
        favorito ? "Jogo marcado como favorito" : "Jogo não favoritado"
    );

    const imagem = campoImagem.value.trim();
    if (imagem) {
        let img = previewCapa.querySelector("img");
        if (!img) {
            img = document.createElement("img");
            previewCapa.appendChild(img);
        }
        img.src = imagem;
        img.alt = titulo ? `Prévia da capa de ${titulo}` : "Prévia da capa";
        if (previewPlaceholder) previewPlaceholder.hidden = true;
    } else {
        const img = previewCapa.querySelector("img");
        if (img) img.remove();
        if (previewPlaceholder) previewPlaceholder.hidden = false;
    }
}

[campoTitulo, campoPlataforma, campoGenero, campoImagem, campoFavorito]
    .forEach((campo) => campo.addEventListener("input", atualizarPrevia));
campoFavorito.addEventListener("change", atualizarPrevia);

atualizarPrevia();

// Cadastra um jogo quando o formulário é enviado
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Obtém os valores preenchidos no formulário
    const jogo = {
        titulo: document.getElementById("game-title").value.trim(),
        plataforma: document.getElementById("game-platform").value,
        genero: document.getElementById("game-genre").value,
        imagem: document.getElementById("game-image").value.trim(),
        favorito: Number(document.getElementById("game-favorite").value)
    };

    try {
        // Envia os dados para o backend
        await cadastrarJogo(jogo);

        alert("Jogo cadastrado com sucesso!");

        // Limpa o formulário
        formulario.reset();

        // Retorna para o catálogo
        window.location.href = "../../index.html";

    } catch (erro) {
        alert("Não foi possível cadastrar o jogo: " + erro.message);
        console.error("Erro ao cadastrar jogo:", erro);
    }
});
