const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync("jogos.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    genero TEXT NOT NULL,
    imagem TEXT NOT NULL,
    descricao TEXT NOT NULL,
    desenvolvedora TEXT NOT NULL,
    favorito INTEGER NOT NULL DEFAULT 0
  )
`);

module.exports = db;
