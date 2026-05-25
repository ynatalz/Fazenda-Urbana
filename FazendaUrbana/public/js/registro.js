// Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/
// Registro de usuário e alternância entre painéis login/registro

const textosAuth = {
  login: {
    titulo: "Entrar",
    subtitulo: "Acesse sua conta e acompanhe o projeto Fazenda Urbana"
  },
  registro: {
    titulo: "Criar conta",
    subtitulo: "Cadastre-se e faça parte da Fazenda Urbana"
  }
};

function alternarPainel(modo) {
  const painelLogin = document.getElementById("painel_login");
  const painelRegistro = document.getElementById("painel_registro");
  const tituloAuth = document.getElementById("titulo_auth");
  const subtituloAuth = document.getElementById("subtitulo_auth");

  if (!painelLogin || !painelRegistro || !tituloAuth || !subtituloAuth) {
    return;
  }

  const mostrarRegistro = modo === "registro";
  const painelAtivo = mostrarRegistro ? painelRegistro : painelLogin;
  const painelInativo = mostrarRegistro ? painelLogin : painelRegistro;

  painelInativo.classList.remove("auth_painel--ativo");
  painelInativo.style.display = "none";
  painelInativo.hidden = true;
  painelInativo.style.pointerEvents = "none";

  painelAtivo.hidden = false;
  painelAtivo.style.display = "grid";
  painelAtivo.style.pointerEvents = "auto";

  requestAnimationFrame(function () {
    painelAtivo.classList.add("auth_painel--ativo");
  });

  tituloAuth.textContent = textosAuth[modo].titulo;
  subtituloAuth.textContent = textosAuth[modo].subtitulo;
}

function validarCampo(valor, mensagem) {
  if (!valor || !String(valor).trim()) {
    alert(mensagem);
    return false;
  }
  return true;
}

function validarEmail(email) {
  const padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!padrao.test(email)) {
    alert("Digite um e-mail válido.");
    return false;
  }
  return true;
}

function enviarRegistro() {

  const formRegistro = document.getElementById("registro_form");
  const campoNome = document.getElementById("reg_nome");
  const campoUsuario = document.getElementById("reg_usuario");
  const campoEmail = document.getElementById("reg_email");
  const campoSenha = document.getElementById("reg_senha");
  const campoConfirmar = document.getElementById("reg_confirmar_senha");

  if (!formRegistro || !campoNome || !campoUsuario || !campoEmail || !campoSenha || !campoConfirmar) {
    alert("Erro no formulário. Recarregue a página.");
    return;
  }

  const nome = campoNome.value.trim();
  const usuario = campoUsuario.value.trim();
  const email = campoEmail.value.trim();
  const senha = campoSenha.value;
  const confirmarSenha = campoConfirmar.value;

  if (!validarCampo(nome, "Digite seu nome completo.")) return;
  if (!validarCampo(usuario, "Digite seu usuário.")) return;
  if (!validarCampo(email, "Digite seu e-mail.")) return;
  if (!validarEmail(email)) return;
  if (!validarCampo(senha, "Digite sua senha.")) return;
  if (!validarCampo(confirmarSenha, "Confirme sua senha.")) return;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem. Verifique e tente novamente.");
    return;
  }

  const botaoEnviar = document.getElementById("btn_criar_conta");
  const textoOriginal = botaoEnviar ? botaoEnviar.textContent : "Criar conta";

  if (botaoEnviar) {
    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Criando conta...";
  }

  fetch("/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome: nome,
      usuario: usuario,
      email: email,
      senha: senha
    })
  })
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      if (!dados.sucesso) {
        alert(dados.mensagem || "Não foi possível criar a conta.");
        return;
      }

      alert("Conta criada com sucesso!");
      formRegistro.reset();
      alternarPainel("login");

      const campoLoginUsuario = document.getElementById("login_usuario");
      if (campoLoginUsuario) {
        campoLoginUsuario.value = usuario;
      }

      const campoLoginSenha = document.getElementById("login_senha");
      if (campoLoginSenha) {
        campoLoginSenha.focus();
      }
    })
    .catch(function (erro) {
      console.error("Erro no registro:", erro);
      alert("Erro ao criar conta. Verifique se o servidor e o MongoDB estão rodando.");
    })
    .finally(function () {
      if (botaoEnviar) {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginal;
      }
    });
}

function iniciarRegistro() {
  const painelLogin = document.getElementById("painel_login");
  const painelRegistro = document.getElementById("painel_registro");
  const btnMostrarRegistro = document.getElementById("btn_mostrar_registro");
  const btnMostrarLogin = document.getElementById("btn_mostrar_login");
  const formRegistro = document.getElementById("registro_form");

  if (painelLogin) {
    painelLogin.hidden = false;
    painelLogin.style.display = "grid";
    painelLogin.style.pointerEvents = "auto";
  }

  if (painelRegistro) {
    painelRegistro.hidden = true;
    painelRegistro.style.display = "none";
    painelRegistro.style.pointerEvents = "none";
  }

  if (btnMostrarRegistro) {
    btnMostrarRegistro.addEventListener("click", function (evento) {
      evento.preventDefault();
      alternarPainel("registro");
    });
  }

  if (btnMostrarLogin) {
    btnMostrarLogin.addEventListener("click", function (evento) {
      evento.preventDefault();
      alternarPainel("login");
    });
  }

  const botaoCriarConta = document.getElementById("btn_criar_conta");

  if (formRegistro) {
    formRegistro.addEventListener("submit", function (evento) {
      evento.preventDefault();
      enviarRegistro();
    });
  }

  if (botaoCriarConta) {
    botaoCriarConta.addEventListener("click", enviarRegistro);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarRegistro);
} else {
  iniciarRegistro();
}

window.alternarPainel = alternarPainel;
