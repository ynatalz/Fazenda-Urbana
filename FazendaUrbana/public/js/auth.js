// Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/
// Login, registro (mudança dos paineis)

const CHAVE_USUARIO = "usuarioLogado";

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

  painelLogin.classList.toggle("auth_painel--ativo", !mostrarRegistro);
  painelRegistro.classList.toggle("auth_painel--ativo", mostrarRegistro);

  painelLogin.hidden = mostrarRegistro;
  painelRegistro.hidden = !mostrarRegistro;

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

async function enviarLogin(evento) {
  if (evento) {
    evento.preventDefault();
    evento.stopPropagation();
  }

  const campoUsuario = document.getElementById("login_usuario");
  const campoSenha = document.getElementById("login_senha");
  const botaoEntrar = document.getElementById("btn_entrar_login");

  if (!campoUsuario || !campoSenha) {
    alert("Campos de login não encontrados. Recarregue a página.");
    return;
  }

  const usuarioDigitado = campoUsuario.value.trim();
  const senhaDigitada = campoSenha.value;

  if (!validarCampo(usuarioDigitado, "Digite seu usuário.")) return;
  if (!validarCampo(senhaDigitada, "Digite sua senha.")) return;

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

      window.location.href = "/";
      return;
    }

    alert(dados.mensagem || "Usuário ou senha incorretos!");
  } catch (erro) {
    console.error("Erro no login:", erro);
    alert("Erro ao fazer login. Abra http://localhost:3000/login com npm start e MongoDB rodando.");
  } finally {
    if (botaoEntrar) {
      botaoEntrar.disabled = false;
      botaoEntrar.textContent = "Entrar";
    }
  }
}

async function enviarRegistro(evento) {
  if (evento) {
    evento.preventDefault();
    evento.stopPropagation();
  }

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

  try {
    const resposta = await fetch("/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        nome: nome,
        usuario: usuario,
        email: email,
        senha: senha
      })
    });

    const dados = await resposta.json();

    if (!dados.sucesso) {
      alert(dados.mensagem || "Não foi possível criar a conta.");
      return;
    }

    alert("Conta criada com sucesso! Faça login com seu usuário e senha.");
    formRegistro.reset();
    alternarPainel("login");

    const campoLoginUsuario = document.getElementById("login_usuario");
    if (campoLoginUsuario) {
      campoLoginUsuario.value = usuario;
    }

    document.getElementById("login_senha")?.focus();
  } catch (erro) {
    console.error("Erro no registro:", erro);
    alert("Erro ao criar conta. Verifique se o servidor e o MongoDB estão rodando.");
  } finally {
    if (botaoEnviar) {
      botaoEnviar.disabled = false;
      botaoEnviar.textContent = textoOriginal;
    }
  }
}

function iniciarAuth() {
  alternarPainel("login");

  document.getElementById("btn_mostrar_registro")?.addEventListener("click", function (evento) {
    evento.preventDefault();
    alternarPainel("registro");
  });

  document.getElementById("btn_mostrar_login")?.addEventListener("click", function (evento) {
    evento.preventDefault();
    alternarPainel("login");
  });

  document.getElementById("login_form")?.addEventListener("submit", enviarLogin);
  document.getElementById("btn_entrar_login")?.addEventListener("click", enviarLogin);

  document.getElementById("registro_form")?.addEventListener("submit", enviarRegistro);
  document.getElementById("btn_criar_conta")?.addEventListener("click", enviarRegistro);
}

window.enviarLogin = enviarLogin;
window.alternarPainel = alternarPainel;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarAuth);
} else {
  iniciarAuth();
}
