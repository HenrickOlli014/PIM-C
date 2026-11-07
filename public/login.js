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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!verificarEmail() || !validarSenha()) {
        alert('Email inválido ou senha fraca: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial');
        return;
    }

    try {
        const r = await send('/cadastro');
        alert(r.mensagem);
        if (r.ok) {
            window.location.href = '/page.html'; // só vai depois de gravar no banco
        }
    } catch {
        alert('Não consegui falar com o servidor. Ele está rodando?');
    }
});

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


async function send(rota) {
    const resposta = await fetch(rota, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: document.getElementById('emailInput').value,
            password: document.getElementById('passwordInput').value,
        })
    });
    const dados = await resposta.json();
    return { ok: resposta.ok, mensagem: dados.mensagem };
}

async function enter() {
    const r = await send('/login');
    if (r.ok) {
        window.location.href = '/page.html';
    } else {
        alert(r.mensagem);
    }
}
