//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("meu_contato");
  const botao = document.getElementById("botao_formulario");

  if (!formulario) {
    return;
  }

  async function enviarContato(evento) {
    if (evento) {
      evento.preventDefault();
      evento.stopPropagation();
    }

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const textoOriginal = botao ? botao.textContent : "Enviar";

    if (nome === "") {
      alert("Digite seu nome");
      return;
    }

    if (email === "") {
      alert("Digite seu email");
      return;
    }

    if (numero === "") {
      alert("Digite seu número");
      return;
    }

    if (botao) {
      botao.disabled = true;
      botao.textContent = "Enviando...";
    }

    try {
      const resposta = await fetch("/contato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          numero: numero
        })
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        alert("Formulário enviado com sucesso, " + nome + "!");
        formulario.reset();
        return;
      }

      alert(dados.mensagem || "Não foi possível enviar a mensagem.");
    } catch (erro) {
      console.error("Erro no contato:", erro);
      alert("Erro ao enviar. Verifique se o servidor e o MongoDB estão rodando.");
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginal;
      }
    }
  }

  formulario.addEventListener("submit", enviarContato);
});
