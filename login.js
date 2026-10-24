const buttonForm = document.getElementById("buttonForm");
const password = document.getElementById('passwordInput');
const email = document.getElementById('emailInput');

function verificarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const empty = email.value.trim();
    
    
    if (regex.test(empty)) {
        email.style.border = "1px solid green";
        return true
    }else {
        email.style.border = "1px solid red";
        return false
    }
}

function validarSenha() {
    const passwordValue = password.value;

    const regexMaiuscula = /[A-Z]/;
    const regexMinuscula = /[a-z]/;
    const regexNumero = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=;'/\\[\]]/;

    const valid =
        passwordValue.length >= 8 &&
        regexMaiuscula.test(passwordValue) &&
        regexMinuscula.test(passwordValue) &&
        regexNumero.test(passwordValue) &&
        regexEspecial.test(passwordValue);

    if (valid) {
        password.style.border = "1px solid green";
        return true;
    } else {
        password.style.border = "1px solid red";
        return false;
    }
}

buttonForm.addEventListener("mouseenter", () => {
    verificarEmail();
    validarSenha();
})

const form = document.getElementById("formLogin");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const emailValid = verificarEmail();
    const passwordValid = validarSenha();

    if (emailValid && passwordValid) {
        window.location.href = "page.html";
    }
})

email.addEventListener("input", verificarEmail);
password.addEventListener("input", validarSenha);


const seePassword = document.getElementById("seePassword");
const passwordInput = document.getElementById("passwordInput");

seePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});