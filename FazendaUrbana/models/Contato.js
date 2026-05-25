//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const mongoose = require("mongoose");

const ContatoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  numero: String,
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Contato", ContatoSchema);
