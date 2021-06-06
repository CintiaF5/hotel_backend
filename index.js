const express = require("express");

// Carrega as variáveis de ambiente
require("dotenv").config();

// Inicializa o MongoDB
const InicializaMongoServer = require("./config/db");
InicializaMongoServer();

//Define as rotas do backend
const rotasQuarto = require("./routes/Quarto");

// Inicializa o app a partir da biblioteca express
const app = express();

//Removendo o x-powered-by por segurança
app.disable("x-powered-by");

// Porta default do backend
const PORT = process.env.PORT || 3001;

// Middleware do Express
app.use(function (req, res, next) {
  // Em produção, remova o * e atualize com o domínio/ip da app
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Cabeçalhos que serão permitidos
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Métodos que serão permitidos
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );

  next();
});

// Definimos que o backend fará o parse do JSON
app.use(express.json());

// Definimos a nossa primeira rota
app.get("/", (req, res) => {
  res.json({
    mensagem: "API CRUD BOOKHOTEL",
    versao: "1.0.0",
  });
});

// Rotas do Quarto
app.use("/quartos", rotasQuarto);

// Rota para tratar erros 404
app.use(function (req, res) {
  res.status(404).json({
    mensagem: `A rota ${req.originalUrl} não existe!`,
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Servidor Web rodando na porta ${PORT}`);
});
