//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const conectarBanco = require("./database/connection");
const User = require("./models/User");
const Contato = require("./models/Contato");

const app = express();
const PORT = 3000;

function bancoConectado() {
  return mongoose.connection.readyState === 1;
}

function pediuJson(req) {
  return req.headers["content-type"]?.includes("application/json");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ROTAS POST */

app.post("/registro", async (req, res) => {
  try {
    if (!bancoConectado()) {
      if (pediuJson(req)) {
        return res.status(503).json({ sucesso: false, mensagem: "MongoDB desligado. Inicie o MongoDB." });
      }
      return res.redirect("/login?erro=mongo");
    }

    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim();
    const usuario = (req.body.usuario || "").trim();
    const senha = req.body.senha || "";

    if (!nome || !email || !usuario || !senha) {
      if (pediuJson(req)) {
        return res.json({ sucesso: false, mensagem: "Preencha todos os campos." });
      }
      return res.redirect("/login?erro=campos");
    }

    const jaExiste = await User.findOne({ usuario: usuario });
    if (jaExiste) {
      if (pediuJson(req)) {
        return res.json({ sucesso: false, mensagem: "Usuário já existe." });
      }
      return res.redirect("/login?erro=usuario");
    }

    await User.create({ nome, email, usuario, senha });
    console.log("Usuário Criado:", usuario);

    if (pediuJson(req)) {
      return res.json({ sucesso: true, mensagem: "Conta criada!" });
    }
    return res.redirect("/login?cadastro=ok");
  } catch (erro) {
    console.log("Erro registro:", erro.message);
    if (pediuJson(req)) {
      return res.json({ sucesso: false, mensagem: "Erro ao criar conta." });
    }
    return res.redirect("/login?erro=servidor");
  }
});

app.post("/login", async (req, res) => {
  try {
    if (!bancoConectado()) {
      return res.status(503).json({ sucesso: false, mensagem: "MongoDB desligado. Inicie o MongoDB." });
    }

    const usuario = (req.body.usuario || "").trim();
    const senha = req.body.senha || "";

    if (!usuario || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: "Preencha usuário e senha." });
    }

    const encontrado = await User.findOne({ usuario: usuario, senha: senha });

    if (encontrado) {
      console.log("Login OK:", usuario);
      return res.json({ sucesso: true, mensagem: "Login OK!", usuario: usuario });
    }

    return res.status(401).json({ sucesso: false, mensagem: "Usuário ou senha incorretos." });
  } catch (erro) {
    console.log("Erro login:", erro.message);
    return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
  }
});

app.post("/contato", async (req, res) => {
  try {
    if (!bancoConectado()) {
      if (pediuJson(req)) {
        return res.status(503).json({ sucesso: false, mensagem: "MongoDB desligado. Inicie o MongoDB." });
      }
      return res.redirect("/contato?erro=mongo");
    }

    const nome = (req.body.nome || "").trim();
    const email = (req.body.email || "").trim();
    const numero = (req.body.numero || "").trim();

    if (!nome || !email || !numero) {
      if (pediuJson(req)) {
        return res.status(400).json({ sucesso: false, mensagem: "Preencha todos os campos." });
      }
      return res.redirect("/contato?erro=campos");
    }

    await Contato.create({ nome, email, numero });
    console.log("Contato enviado:", nome);

    if (pediuJson(req)) {
      return res.json({ sucesso: true, mensagem: "Enviado com sucesso!" });
    }
    return res.redirect("/contato?enviado=ok");
  } catch (erro) {
    console.log("Erro contato:", erro.message);
    if (pediuJson(req)) {
      return res.json({ sucesso: false, mensagem: "Erro ao salvar." });
    }
    return res.redirect("/contato?erro=servidor");
  }
});

/* ROTAS GET */

app.get("/", (req, res) => res.render("index"));
app.get("/login", (req, res) => res.render("login", { query: req.query }));
app.get("/etapas", (req, res) => res.render("etapas"));
app.get("/impactos", (req, res) => res.render("impactos"));
app.get("/parceiros", (req, res) => res.render("parceiros"));
app.get("/contato", (req, res) => res.render("contato", { query: req.query }));

app.get("/api/status", (req, res) => {
  res.json({
    mongo: bancoConectado(),
    banco: "fazendaurbana",
    colecoes: ["users", "contatos"]
  });
});

app.use(express.static(path.join(__dirname, "public")));

/* ROTAS PUT */

app.put("/contato/:id", async (req, res) => {
  try {

    await Contato.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        email: req.body.email,
        numero: req.body.numero
      }
    );

    res.json({
      sucesso: true,
      mensagem: "Contato atualizado!"
    });

  } catch (erro) {

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar contato."
    });

  }
});

/* ROTAS DELETE */

app.delete("/usuario/:id", async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      sucesso: true,
      mensagem: "Usuário removido!"
    });

  } catch (erro) {

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao remover usuário."
    });

  }
});

/*INICIAR*/

async function iniciar() {
  const ok = await conectarBanco();

  if (!ok) {
    console.log("");
    console.log("--- ATENÇÃO: MongoDB NÃO conectou! ---");
    console.log("--- Inicie o MongoDB de novo ---");
    console.log("");
  } else {
    console.log("MongoDB OK -> banco: fazendaurbana | users - para ver login | contatos - para ver pedidos de contato");
  }

  app.listen(PORT, () => {
    console.log("Servidor: http://localhost:" + PORT);
  });
}

iniciar();
