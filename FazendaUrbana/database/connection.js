//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const mongoose = require("mongoose");

async function conectarBanco() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/fazendaurbana");
    console.log("MongoDB conectado!");
    return true;
  } catch (erro) {
    console.log("Erro MongoDB:", erro.message);
    return false;
  }
}

module.exports = conectarBanco;
