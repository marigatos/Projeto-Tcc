const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configuração da conexão com MariaDB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",       // ajuste se tiver usuário diferente
  password: "root",   // ajuste se sua senha for diferente
  database: "banco_dados",
  port: 3306
});

// Testa conexão
connection.connect(err => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err);
    return;
  }
  console.log("✅ Conectado ao MariaDB!");
});

// ======================
// ROTAS DE USUÁRIO
// ======================

// GET - listar todos os usuários
app.get("/usuario", (req, res) => {
  const sql = "SELECT * FROM usuario";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
    res.json(results);
  });
});

// POST - cadastrar usuário
app.post("/usuario", (req, res) => {
  const { nome_usuario, senha } = req.body;
  if (!nome_usuario || !senha) {
    return res.status(400).json({ erro: "Informe nome de usuário e senha." });
  }

  const sql = "INSERT INTO usuario (nome_usuario, senha) VALUES (?, ?)";
  connection.query(sql, [nome_usuario, senha], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar usuário:", err);
      return res.status(500).json({ erro: "Erro ao adicionar usuário" });
    }
    res.status(201).json({
      id: result.insertId,
      nome_usuario,
      senha
    });
  });
});

// DELETE - remover usuário
app.delete("/usuario/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM usuario WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ mensagem: "Usuário excluído com sucesso", id });
  });
});

// PATCH - atualizar usuário
app.patch("/usuario/:id", (req, res) => {
  const { id } = req.params;
  const { nome_usuario } = req.body;

  if (!nome_usuario) {
    return res.status(400).json({ erro: "Informe o novo nome de usuário." });
  }

  const sql = "UPDATE usuario SET nome_usuario = ? WHERE id = ?";
  connection.query(sql, [nome_usuario, id], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json({ id, nome_usuario });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
