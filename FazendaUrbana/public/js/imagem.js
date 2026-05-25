//Autor: Lucas Natal (Dev) https://www.linkedin.com/in/lucas-augusto-natal-a03021279/

const carrossel = document.getElementById("carrossel");
let imagens = [];

if (carrossel) {
  imagens = carrossel.querySelectorAll("img");
}

let indice = 0;

function atualizar() {
  if (carrossel === null) {
    return;
  }

  const valor = indice * 100;
  carrossel.style.transform = "translateX(-" + valor + "%)";
}

function proxima() {
  if (imagens.length === 0) {
    return;
  }
  indice = (indice + 1) % imagens.length;
  atualizar();
}

function voltar() {
  if (imagens.length === 0) {
    return;
  }

  indice = (indice - 1 + imagens.length) % imagens.length;
  atualizar();
}

const btnVoltar = document.querySelector(".carrossel_btn_voltar");
const btnAvancar = document.querySelector(".carrossel_btn_avancar");

if (btnVoltar && btnAvancar) {
  btnVoltar.addEventListener("click", voltar);
  btnAvancar.addEventListener("click", proxima);
}

atualizar();
