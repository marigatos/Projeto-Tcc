const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
// Configuração da conexão com o MariaDB
const connection = mysql.createConnection({
host: "localhost",
user: "root", // ajuste se tiver usuário diferente
password: "root", // coloque a senha, se tiver
database: "banco_dados",
port: 3306 // portas padrão do MariaDB
});
// Testar conexão
connection.connect(err => {
if (err) {
console.error("Erro ao conectar no banco:", err);
return;
}
console.log("Conectado ao MariaDB!");
});
// ======================
// ROTAS
// ======================
// GET: Listar todas as tarefas
app.get("/usuario", (req, res) => {
const sql = "SELECT * FROM usuario";
connection.query(sql, (err, results) => {
if (err) {
console.error("Erro ao buscar users:", err);
return res.status(500).json({ erro: "Erro ao buscar users" });
}
res.json(results);
});
});
// POST: Adicionar nova tarefa
app.post("/usuario", (req, res) => {
const { nome_usuario, senha } = req.body;
const sql = "INSERT INTO usuario (nome_usuario, senha) VALUES (?, ?)";
connection.query(sql, [nome_usuario, senha], (err, result) => {
if (err) {
console.error("Erro ao adicionar usuario:", err);
return res.status(500).json({ erro: "Erro ao adicionar usuario" });
}
res.status(201).json({
id: result.affectedRows.id,
nome_usuario,
senha
});
});
});
//DELETE: Remover tarefa pelo ID
app.delete("/usuario/:id", (req, res) => {
const { id } = req.params;
const sql = "DELETE FROM usuario WHERE id = ?";
connection.query(sql, [id], (err, result) => {
if (err) {
console.error("Erro ao deletar usuario:", err);
return res.status(500).json({ erro: "Erro ao deletar usuario" });
}
if (result.affectedRows === 0) {
return res.status(404).json({ erro: "usuario não encontrado" });
}
res.json({ mensagem: "usuario excluída com sucesso", id });
});
});
//PATCH: Atualizar status da u
app.patch("/usuario/:id", (req, res) => {
const { id } = req.params;
const { nome_usuario } = req.body;
const sql = "UPDATE usuario SET nome_usuario = ? WHERE id = ?";
connection.query(sql, [nome_usuario, id], (err, result) => {
if (err) {
console.error("Erro ao atualizar usuario:", err);
return res.status(500).json({ erro: "Erro ao atualizar usuario" });
}
if (result.affectedRows === 0) {
return res.status(404).json({ erro: "usuario não encontrada" });
}
res.json({ id, nome_usuario});
});
});
// Servidor rodando
app.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}`);
});