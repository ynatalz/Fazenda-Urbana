// Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const CHAVE_USUARIO = "usuarioLogado";

function validarCampoLogin(valor, mensagem) {
  if (!valor || !String(valor).trim()) {
    alert(mensagem);
    return false;
  }
  return true;
}

async function enviarLogin() {
  const campoUsuario = document.getElementById("login_usuario");
  const campoSenha = document.getElementById("login_senha");
  const botaoEntrar = document.getElementById("btn_entrar_login");

  if (!campoUsuario || !campoSenha) {
    alert("Campos de login não encontrados. Recarregue a página.");
    return;
  }

  const usuarioDigitado = campoUsuario.value.trim();
  const senhaDigitada = campoSenha.value;

  if (!validarCampoLogin(usuarioDigitado, "Digite seu usuário.")) return;
  if (!validarCampoLogin(senhaDigitada, "Digite sua senha.")) return;

  if (botaoEntrar) {
    botaoEntrar.disabled = true;
    botaoEntrar.textContent = "Entrando...";
  }

  try {
    const resposta = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        usuario: usuarioDigitado,
        senha: senhaDigitada
      })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
      localStorage.setItem(CHAVE_USUARIO, usuarioDigitado);
      localStorage.removeItem("usuario");

      if (typeof window.atualizarNavbar === "function") {
        window.atualizarNavbar();
      }

      window.location.replace("/");
      return;
    }

    alert(dados.mensagem || "Usuário ou senha incorretos!");
  } catch (erro) {
    console.error("Erro no login:", erro);
    alert("Erro ao fazer login. Use http://localhost:3000/login com npm start rodando.");
  } finally {
    if (botaoEntrar) {
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = "Entrar";
    }
  }
}

function configurarLogin() {
  const formLogin = document.getElementById("login_form");
  const botaoEntrar = document.getElementById("btn_entrar_login");

  if (formLogin) {
    formLogin.addEventListener("submit", function (evento) {
      evento.preventDefault();
      evento.stopPropagation();
      enviarLogin();
    });
  }

  if (botaoEntrar) {
    botaoEntrar.addEventListener("click", function (evento) {
      evento.preventDefault();
      enviarLogin();
    });
  }
}

window.enviarLogin = enviarLogin;

document.addEventListener("DOMContentLoaded", configurarLogin);
