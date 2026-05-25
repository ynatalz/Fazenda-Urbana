//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  usuario: String,
  senha: String
});

module.exports = mongoose.model("User", UserSchema);
