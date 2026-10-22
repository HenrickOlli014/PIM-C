const tema = document.getElementById("tema");
const icon = document.querySelectorAll(".img-option");

function aplicarTema(valor) {
    document.querySelectorAll(".back-color").forEach((el) => {
        el.classList.toggle("light", valor === "light");});


    document.querySelectorAll(".img-option").forEach((img) => {
        img.src = valor === "light" ? img.dataset.light : img.dataset.dark;
    });

}

tema.addEventListener("change", () => {
    aplicarTema(tema.value);
    localStorage.setItem("tema", tema.value);
});

const salvo = localStorage.getItem("tema");
if (salvo) {
    tema.value = salvo;
}
aplicarTema(tema.value);


const pageConfig = document.getElementById("page-config");
const pageHome = document.getElementById("page-home");
const pageHistoric = document.getElementById("page-historic");

const secoes = [pageConfig, pageHistoric, pageHome];

const buttonHome = document.getElementById("buttonHome");
const buttonHistoric = document.getElementById("buttonHistoric");
const buttonConfig = document.getElementById("buttonConfig");

function show(section) {
    secoes.forEach ((s) => (s.style.display = "none"));
    if (section) section.style.display = "flex";
}

buttonConfig.addEventListener("click", () => show(pageConfig));
buttonHome.addEventListener("click", () => show(pageHome));
buttonHistoric.addEventListener("click", () => show(pageHistoric));

show(pageHome);


const seePassword = document.getElementById("seePassword");
const passwordInput = document.getElementById("passwordInput");

seePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});





