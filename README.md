# Sistema de Gerenciamento de Jogos

O **Sistema de Gerenciamento de Jogos** é uma aplicação web desenvolvida para organizar e consultar um catálogo compartilhado de jogos. O sistema permite que os usuários visualizem os títulos disponíveis, cadastrem novos jogos e gerenciem suas informações e favoritos.

## Sobre o projeto

A aplicação conta com um catálogo compartilhado, no qual os jogos cadastrados ficam disponíveis para consulta de todos os usuários.

Além da visualização dos títulos, é possível adicionar novos jogos, acessar seus detalhes, editar informações, excluir registros e marcar jogos como favoritos.

## Funcionalidades

- Listagem dos jogos cadastrados;
- Cadastro de novos jogos;
- Visualização dos detalhes de cada jogo;
- Edição das informações dos jogos;
- Exclusão de jogos do catálogo;
- Adição e remoção de favoritos;
- Armazenamento dos dados em banco de dados SQLite;
- Comunicação entre frontend e backend por meio de uma API REST.

## Tecnologias utilizadas

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- SQLite
- Fetch API para comunicação com o backend.

## Estrutura do projeto

```text
Sistema-de-Gerenciamento-de-Jogos/
│
└── registrador_de_jogos/
    │
    ├── index.html
    │
    └── ex-game/
        │
        ├── index.html
        │
        ├── pages/
        │   ├── explorar.html
        │   ├── adicionar-jogo.html
        │   └── detalhes.html
        │
        ├── css/
        │
        ├── js/
        │   ├── api.js
        │   ├── jogos.js
        │   ├── adicionar-jogo.js
        │   ├── detalhes.js
        │   └── navegacao.js
        │
        └── backend/
            ├── app.js
            ├── database.js
            ├── package.json
            └── jogos.db
```

## Como executar o projeto

### Pré-requisitos

- Node.js instalado;
- Git instalado;
- Navegador web;
- Visual Studio Code (recomendado).

### 1. Clonar o repositório

```bash
git clone https://github.com/Igor-Sousa-333/Sistema-de-Gerenciamento-de-Jogos----backend.git
```

### 2. Acessar a pasta do backend

```bash
cd Sistema-de-Gerenciamento-de-Jogos----backend/registrador_de_jogos/ex-game/backend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor

```bash
node app.js
```

O servidor será iniciado na porta `3000`.

### 5. Abrir o frontend

Abra o arquivo `registrador_de_jogos/ex-game/index.html` no navegador. Para facilitar a execução, recomenda-se utilizar a extensão Live Server do Visual Studio Code.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/jogos` | Lista todos os jogos |
| GET | `/jogos/:id` | Busca um jogo pelo ID |
| POST | `/jogos` | Cadastra um novo jogo |
| PUT | `/jogos/:id` | Atualiza os dados de um jogo |
| DELETE | `/jogos/:id` | Exclui um jogo |
| PATCH | `/jogos/:id/favorito` | Atualiza o status de favorito |

## Objetivos acadêmicos

O projeto foi desenvolvido como parte das atividades do curso de Análise e Desenvolvimento de Sistemas, com o objetivo de aplicar conhecimentos de desenvolvimento web, integração entre frontend e backend, criação de APIs REST e manipulação de banco de dados.
