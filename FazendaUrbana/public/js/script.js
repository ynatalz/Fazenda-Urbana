// Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const CHAVE_USUARIO = "usuarioLogado";

function obterUsuarioLogado() {
  let usuario = localStorage.getItem(CHAVE_USUARIO);

  // Compatibilidade com versão anterior
  if (!usuario) {
    usuario = localStorage.getItem("usuario");
    if (usuario) {
      localStorage.setItem(CHAVE_USUARIO, usuario);
      localStorage.removeItem("usuario");
    }
  }

  return usuario;
}

function fazerLogout() {
  localStorage.removeItem(CHAVE_USUARIO);
  localStorage.removeItem("usuario");
  atualizarNavbar();
  window.location.href = "/";
}

function atualizarNavbar() {
  const itemLogin = document.getElementById("item_login");

  if (!itemLogin) {
    return;
  }

  const usuarioLogado = obterUsuarioLogado();

  if (usuarioLogado) {
    itemLogin.innerHTML =
      '<span class="usuario_conectado">Conectado: ' + usuarioLogado + "</span>" +
      ' <a href="#" id="btn_sair_nav" class="nav_sair">Sair</a>';

    const btnSair = document.getElementById("btn_sair_nav");
    if (btnSair) {
      btnSair.addEventListener("click", function (evento) {
        evento.preventDefault();
        fazerLogout();
      });
    }
  } else {
    itemLogin.innerHTML = '<a href="/login">Login</a>';
  }
}

function iniciarNavbar() {
  atualizarNavbar();

  // Bloqueia /login no menu quando já está conectado (links diretos)
  if (obterUsuarioLogado() && window.location.pathname === "/login") {
    window.location.replace("/");
  }
}

document.addEventListener("DOMContentLoaded", iniciarNavbar);

window.atualizarNavbar = atualizarNavbar;
