function none(object) {
  object.style.display = "none";
}
function flex(object) {
  object.style.display = "flex";
}

const buttonEntrar = document.getElementById('buttonEntrar');
const buttonCadastrar = document.getElementById('buttonCadastrar');
const possuiLogin = document.getElementById('entrarLogin');
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

buttonCadastrar.addEventListener("mouseenter", () => {
    verificarEmail();
    validarSenha();
})
buttonEntrar.addEventListener("mouseenter", () => {
    verificarEmail();
    validarSenha();
})

let modoCadastro = true;   // a tela começa no modo "Cadastrar"

possuiLogin.addEventListener("click", () => {
  modoCadastro = !modoCadastro;

  if (modoCadastro) {
    possuiLogin.textContent = 'Já possui uma conta?';
    flex(buttonCadastrar);
    none(buttonEntrar);
  } else {
    possuiLogin.textContent = 'Não possui uma conta?';
    flex(buttonEntrar);
    none(buttonCadastrar);
  }
})

const form = document.getElementById("formLogin");

const MSG_INVALIDO = 'Email inválido ou senha fraca: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial';

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!verificarEmail() || !validarSenha()) { alert(MSG_INVALIDO); return; }

    try {
        // o modo da tela escolhe a rota (vale também quando a pessoa aperta Enter)
        const r = await send(modoCadastro ? '/cadastro' : '/login');
        if (r.ok) {
            window.location.href = '/page.html';   // cadastro e login deixam a pessoa logada
        } else {
            alert(r.mensagem);
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
    const oculto = passwordInput.type === "password";
    passwordInput.type = oculto ? "text" : "password";
    seePassword.src = oculto ? "images/olho-revelado.png" : "images/olho-revelar.png"; 
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