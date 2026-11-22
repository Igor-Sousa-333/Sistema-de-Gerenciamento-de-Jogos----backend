const express = require("express");
const db = require("./database");

const app = express();
const PORT = 3000;

// Permite que o servidor leia dados enviados em formato JSON
app.use(express.json());

// Libera o acesso do front-end (navegador) para esta API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// 1. GET /jogos — Listar todos os jogos
app.get("/jogos", (req, res) => {
  try {
    const jogos = db.prepare("SELECT * FROM jogos").all();
    return res.status(200).json(jogos);
  } catch (erro) {
    console.error("Erro ao listar jogos:", erro);
    return res.status(500).json({ erro: "Erro interno ao listar os jogos." });
  }
});

// 2. GET /jogos/:id — Buscar um jogo pelo ID
app.get("/jogos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "O ID informado deve ser um número válido." });
    }

    const jogo = db.prepare("SELECT * FROM jogos WHERE id = ?").get(id);
    if (!jogo) {
      return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    return res.status(200).json(jogo);
  } catch (erro) {
    console.error("Erro ao buscar jogo:", erro);
    return res.status(500).json({ erro: "Erro interno ao buscar o jogo." });
  }
});

// 3. POST /jogos — Cadastrar um novo jogo
app.post("/jogos", (req, res) => {
  try {
    const {
      titulo,
      plataforma,
      genero,
      imagem = "",
      descricao = "",
      desenvolvedora = "",
      favorito = 0
    } = req.body;

    if (!titulo || !plataforma || !genero) {
      return res.status(400).json({
        erro: "Os campos titulo, plataforma e genero são obrigatórios."
      });
    }

    const favoritoValido = Number(favorito) === 1 ? 1 : 0;

    const stmt = db.prepare(`
      INSERT INTO jogos (titulo, plataforma, genero, imagem, descricao, desenvolvedora, favorito)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const resultado = stmt.run(
      String(titulo).trim(),
      String(plataforma).trim(),
      String(genero).trim(),
      String(imagem ?? "").trim(),
      String(descricao ?? "").trim(),
      String(desenvolvedora ?? "").trim(),
      favoritoValido
    );

    const novoId = Number(resultado.lastInsertRowid);
    const jogoCriado = db.prepare("SELECT * FROM jogos WHERE id = ?").get(novoId);

    return res.status(201).json(jogoCriado);
  } catch (erro) {
    console.error("Erro ao cadastrar jogo:", erro);
    return res.status(500).json({ erro: "Erro interno ao cadastrar o jogo." });
  }
});

// 4. PUT /jogos/:id — Atualizar os dados de um jogo existente
app.put("/jogos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "O ID informado deve ser um número válido." });
    }

    const jogoExistente = db.prepare("SELECT * FROM jogos WHERE id = ?").get(id);
    if (!jogoExistente) {
      return res.status(404).json({ erro: "Jogo não encontrado para atualização." });
    }

    const {
      titulo,
      plataforma,
      genero,
      imagem,
      descricao,
      desenvolvedora,
      favorito
    } = req.body;

    if (!titulo || !plataforma || !genero) {
      return res.status(400).json({
        erro: "Os campos titulo, plataforma e genero são obrigatórios."
      });
    }

    const favoritoValido =
      favorito !== undefined ? (Number(favorito) === 1 ? 1 : 0) : jogoExistente.favorito;

    const stmt = db.prepare(`
      UPDATE jogos
      SET titulo = ?,
          plataforma = ?,
          genero = ?,
          imagem = ?,
          descricao = ?,
          desenvolvedora = ?,
          favorito = ?
      WHERE id = ?
    `);

    stmt.run(
      String(titulo).trim(),
      String(plataforma).trim(),
      String(genero).trim(),
      imagem !== undefined ? String(imagem).trim() : jogoExistente.imagem,
      descricao !== undefined ? String(descricao).trim() : jogoExistente.descricao,
      desenvolvedora !== undefined ? String(desenvolvedora).trim() : jogoExistente.desenvolvedora,
      favoritoValido,
      id
    );

    const jogoAtualizado = db.prepare("SELECT * FROM jogos WHERE id = ?").get(id);
    return res.status(200).json(jogoAtualizado);
  } catch (erro) {
    console.error("Erro ao atualizar jogo:", erro);
    return res.status(500).json({ erro: "Erro interno ao atualizar o jogo." });
  }
});

// 5. DELETE /jogos/:id — Excluir um jogo
app.delete("/jogos/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "O ID informado deve ser um número válido." });
    }

    const resultado = db.prepare("DELETE FROM jogos WHERE id = ?").run(id);
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Jogo não encontrado para exclusão." });
    }

    return res.status(200).json({ mensagem: "Jogo excluído com sucesso.", id });
  } catch (erro) {
    console.error("Erro ao excluir jogo:", erro);
    return res.status(500).json({ erro: "Erro interno ao excluir o jogo." });
  }
});

// 6. PATCH /jogos/:id/favorito — Alternar ou definir favorito (0 ou 1)
app.patch("/jogos/:id/favorito", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ erro: "O ID informado deve ser um número válido." });
    }

    const jogo = db.prepare("SELECT * FROM jogos WHERE id = ?").get(id);
    if (!jogo) {
      return res.status(404).json({ erro: "Jogo não encontrado." });
    }

    let novoFavorito;
    if (req.body && req.body.favorito !== undefined) {
      if (req.body.favorito !== 0 && req.body.favorito !== 1) {
        return res.status(400).json({ erro: "O campo favorito deve ser 0 ou 1." });
      }
      novoFavorito = req.body.favorito;
    } else {
      novoFavorito = jogo.favorito === 1 ? 0 : 1;
    }

    db.prepare("UPDATE jogos SET favorito = ? WHERE id = ?").run(novoFavorito, id);

    const jogoAtualizado = db.prepare("SELECT * FROM jogos WHERE id = ?").get(id);
    return res.status(200).json(jogoAtualizado);
  } catch (erro) {
    console.error("Erro ao alterar favorito:", erro);
    return res.status(500).json({ erro: "Erro interno ao alterar favorito." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor EXGame rodando em http://localhost:${PORT}`);
});