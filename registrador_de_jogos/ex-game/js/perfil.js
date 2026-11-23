async function atualizarEstatisticasPerfil() {
    const total = document.getElementById("profile-total-games");
    const favoritos = document.getElementById("profile-total-favorites");
    const concluidos = document.getElementById("profile-total-completed");

    if (!total && !favoritos && !concluidos) return;

    try {
        const jogos = await listarJogos();
        if (total) total.textContent = jogos.filter((jogo) => Number(jogo.na_lista) === 1).length;
        if (favoritos) {
            favoritos.textContent =
                jogos.filter((jogo) => Number(jogo.favorito) === 1).length;
        }
        if (concluidos) {
            concluidos.textContent =
                jogos.filter((jogo) =>
                    Number(jogo.na_lista) === 1 && jogo.status === "concluido"
                ).length;
        }
    } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro);
    }
}

document.addEventListener("DOMContentLoaded", atualizarEstatisticasPerfil);
