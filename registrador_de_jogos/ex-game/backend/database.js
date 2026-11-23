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

const colunas = db.prepare("PRAGMA table_info(jogos)").all();
const nomesColunas = new Set(colunas.map((coluna) => coluna.name));

if (!nomesColunas.has("status")) {
  db.exec("ALTER TABLE jogos ADD COLUMN status TEXT NOT NULL DEFAULT 'quero-jogar'");
}
if (!nomesColunas.has("na_lista")) {
  db.exec("ALTER TABLE jogos ADD COLUMN na_lista INTEGER NOT NULL DEFAULT 0");
  db.exec("UPDATE jogos SET na_lista = 1");
}
if (!nomesColunas.has("catalogo")) {
  db.exec("ALTER TABLE jogos ADD COLUMN catalogo INTEGER NOT NULL DEFAULT 0");
}
if (!nomesColunas.has("destaque")) {
  db.exec("ALTER TABLE jogos ADD COLUMN destaque INTEGER NOT NULL DEFAULT 0");
}

const jogosPreCadastrados = [
  ["Elden Ring", "PC", "RPG", "../assets/images/EldenRing.jpg", "RPG de ação em mundo aberto.", "FromSoftware", 1],
  ["God of War", "PlayStation", "Ação", "../assets/images/GodOfWar.jpeg", "Uma aventura épica entre os deuses.", "Santa Monica Studio", 0],
  ["Hollow Knight", "PC", "Aventura", "../assets/images/HollowKnight.jpeg", "Metroidvania em um reino subterrâneo.", "Team Cherry", 0],
  ["Red Dead Redemption 2", "PC", "Aventura", "../assets/images/RedDeadRedemption2.jpeg", "Uma história no Velho Oeste.", "Rockstar Games", 1],
  ["Cyberpunk 2077", "PC", "RPG", "", "RPG de ação em Night City.", "CD Projekt Red", 0],
  ["EA Sports FC", "PlayStation", "Esportes", "", "Competição de futebol.", "EA Sports", 0],
  ["Forza Horizon", "Xbox", "Corrida", "", "Corrida em mundo aberto.", "Playground Games", 0],
  ["The Sims 4", "PC", "Simulação", "", "Simulação da vida cotidiana.", "Maxis", 0],
  ["Hades", "PC", "Indie", "", "Jogo de ação independente.", "Supergiant Games", 0]
];

const imagensPorTitulo = {
  "Elden Ring": "ex-game/assets/images/EldenRing.jpg",
  "God of War": "ex-game/assets/images/GodOfWar.jpeg",
  "Hollow Knight": "ex-game/assets/images/HollowKnight.jpeg",
  "Red Dead Redemption 2": "ex-game/assets/images/RedDeadRedemption2.jpeg"
};

for (const [titulo, imagem] of Object.entries(imagensPorTitulo)) {
  db.prepare("UPDATE jogos SET imagem = ? WHERE titulo = ?").run(imagem, titulo);
}

const inserirCatalogo = db.prepare(`
  INSERT INTO jogos (titulo, plataforma, genero, imagem, descricao, desenvolvedora, favorito, status, na_lista, catalogo, destaque)
  VALUES (?, ?, ?, ?, ?, ?, 0, 'quero-jogar', 0, 1, ?)
`);

for (const jogo of jogosPreCadastrados) {
  const existente = db.prepare("SELECT id FROM jogos WHERE titulo = ?").get(jogo[0]);
  if (!existente) {
    inserirCatalogo.run(jogo[0], jogo[1], jogo[2], jogo[3], jogo[4], jogo[5], jogo[6]);
  }
}

module.exports = db;
