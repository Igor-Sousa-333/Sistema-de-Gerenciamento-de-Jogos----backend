const formulario = document.getElementById("game-form");

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
        window.location.href = "explorar.html";

    } catch (erro) {
        alert("Não foi possível cadastrar o jogo: " + erro.message);
        console.error("Erro ao cadastrar jogo:", erro);
    }
});
