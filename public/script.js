function none(object) {
  object.style.display = "none";
}
function flex(object) {
  object.style.display = "flex";
}

const emailDescricao = document.getElementById("emailDescricao");
const solicitacao = document.getElementById("solicitacao");
const descricao = document.getElementById("descricao");


function verificarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const empty = emailDescricao.value.trim();

    if (regex.test(empty)) {
        emailDescricao.style.border = "1px solid gray";   // volta ao normal quando o email fica válido
        return true
    }else {
        emailDescricao.style.border = "1px solid red";
        return false
    }
}

function validarCampo() {
    const texto = descricao.value.trim();

    if (texto === "") {
      descricao.style.border = "1px solid red"
      return false
    }else {
      descricao.style.border = "1px solid gray"
      return true 
    }
}

emailDescricao.addEventListener("input", verificarEmail);
descricao.addEventListener("input", validarCampo);

solicitacao.addEventListener("mouseenter", () => {

  const emailValid = verificarEmail();
  const campoValid = validarCampo();

  if(emailValid && campoValid) {
    solicitacao.classList.add("color");
  }

})

const pageConfig = document.getElementById("page-config");
const pageHome = document.getElementById("page-home");
const pageHistoric = document.getElementById("page-historic");
const pageChamado = document.getElementById("pageChamado");


const secoes = [pageConfig, pageHistoric, pageHome, pageChamado];

const buttonHome = document.getElementById("buttonHome");
const buttonHistoric = document.getElementById("buttonHistoric");
const buttonConfig = document.getElementById("buttonConfig");
const buttonChamado = document.getElementById("buttonChamado");

function show(section) {
    secoes.forEach ((s) => (s.style.display = "none"));
    if (section) section.style.display = "flex";
}

buttonConfig.addEventListener("click", () => show(pageConfig));
buttonHome.addEventListener("click", () => show(pageHome));
buttonHistoric.addEventListener("click", () => show(pageHistoric));
buttonChamado.addEventListener("click", () => show(pageChamado));

show(pageHome);

const boxOption = document.getElementById("boxOption");
const callOption = document.getElementById("callOption")
const contCall = document.getElementById("contCall");

const optionOne = document.getElementById("optionOne");
const optionTwo = document.getElementById("optionTwo");
const optionThree = document.getElementById("optionThree");
const optionFour = document.getElementById("optionFour");
const optionFive = document.getElementById("optionFive");

const callOne = document.getElementById("callOne");
const callTwo = document.getElementById("callTwo");
const buttonopenCall = document.getElementById("buttonopenCall");
const buttonCall = document.getElementById("buttonCall");
const emailCall = document.getElementById("emailCall");



function reset() {
    none(callOne);
    none(callTwo);
    none(emailCall);
    emailDescricao.value = "";
    none(buttonopenCall);
    flex(callboxOption);
    flex(boxOption);
    flex(question);
}

buttonCall.addEventListener("click", () => {
  reset()
  show(pageHistoric);
})

const options = [callOne];
const buttons = [optionOne, optionTwo, optionThree, optionFour, optionFive];

function showOption(section) {
    options.forEach ((s) => (s.style.display = "none"));
    if (section) section.style.display = "flex";
}

buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
        none(boxOption);
        flex(callOne);
    })
});

const question = document.getElementById("question");
const callboxOption = document.getElementById("callboxOption")


buttonHistoric.addEventListener("click", reset)



const categorias = {
  "Computador": [
    "Computador lento ou travando",
    "Computador não liga",
    "Tela azul (BSOD)",
    "Teclado ou mouse com defeito",
    "Falta de espaço em disco"
  ],
  "Software e sistemas": [
    "Programa não abre ou fecha sozinho",
    "Solicitação de instalação de software",
    "Licença expirada",
    "Suspeita de vírus ou malware"
  ],
  "Rede e internet": [
    "Sem acesso à internet",
    "Internet lenta",
    "Wi-Fi não conecta",
    "Problemas com VPN"
  ],
  "Impressoras e periféricos": [
    "Impressora não imprime",
    "Impressora offline",
    "Papel atolado ou toner acabando",
    "Webcam, microfone ou fone sem funcionar"
  ],
  "E-mail e comunicação": [
    "Não consigo enviar ou receber e-mails",
    "Caixa de e-mail cheia",
    "Problemas com Teams, Zoom ou Meet"
  ],
};

const selectProblem = document.getElementById("problem");

let categoriaAtual = '';


function preencherProblemas(categoria) {
    selectProblem.innerHTML = '<option value="">Selecione o problema</option>';

    categorias[categoria].forEach((problema) => {
    const option = document.createElement("option");
    option.value = problema;
    option.textContent = problema;
    categoriaAtual = categoria;
    selectProblem.appendChild(option);
    });
}

optionOne.addEventListener("click", () => {
    preencherProblemas("Computador");
    none(question);
});
optionTwo.addEventListener("click", () => {
    preencherProblemas("Software e sistemas");
    none(question);
});
optionThree.addEventListener("click", () => {
    preencherProblemas("Rede e internet");
    none(question);
});
optionFour.addEventListener("click", () => {
    preencherProblemas("Impressoras e periféricos");
    none(question);
});
optionFive.addEventListener("click", () => {
    preencherProblemas("E-mail e comunicação");
    none(question);
});


selectProblem.addEventListener("change", function() {
  const problemOption = selectProblem.value;
  
  

  callTwo.classList.remove("open");
  none(buttonopenCall);
  void callTwo.offsetWidth;


  if (problemOption === "Computador lento ou travando") {
    callTwo.innerHTML = "<li>Demora excessiva para ligar ou abrir programas: O sistema leva vários minutos para iniciar ou trava por longos períodos ao tentar abrir programas do dia a dia (como Word, Excel, navegadores de internet ou o sistema da empresa).</li><li>Congelamentos frequentes: A tela 'congela', a seta do mouse para de mover ou aparece a mensagem '(Não está respondendo)' na janela do programa.</li><li>Superaquecimento ou barulho excessivo: O computador esquenta muito ou faz um barulho forte e contínuo nas ventoinhas, ficando visivelmente mais lento logo em seguida.</li><li>Respostas com atraso: Você digita no teclado ou clica com o mouse, mas o computador demora alguns segundos para mostrar a ação na tela.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Computador não liga") {
    callTwo.innerHTML = "<li>Ausência total de energia: O computador não acende nenhuma luz, as ventoinhas não rodam e não emite qualquer som ao pressionar o botão de arranque.</li><li>Tela preta no arranque: O equipamento parece ligar (as luzes acendem e as ventoinhas giram), mas a tela permanece totalmente escuro sem carregar o sistema.</li><li>Reinícios em ciclo (Loop): O computador liga, exibe o logótipo inicial e reinicia sozinho repetidamente antes de chegar ao ambiente de trabalho.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Tela azul (BSOD)") {
    callTwo.innerHTML = "<li>Tela azul repentino: O computador exibe de forma inesperada uma tela totalmente azul com um código de erro ou mensagem de aviso em inglês.</li><li>Reinício automático após falha: O equipamento vai abaixo ou reinicia sozinho sem aviso prévio, podendo ou não exibir brevemente um ecrã azul antes de arrancar novamente.</li><li>Instabilidade pós-atualização: O erro ocorre logo após a instalação de novas atualizações do sistema operativo, controladores (drivers) ou novos componentes de hardware/máquina.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Teclado ou mouse com defeito") {
    callTwo.innerHTML = "<li>Teclas que não respondem ou repetem: Algumas teclas específicas deixam de funcionar, ficam bloqueadas ou escrevem carateres repetidos infinitamente sem que o utilizador continue a pressionar.</li><li>Cursor travado ou cliques falhados: O cursor do rato não se mexe no ecrã, os botões esquerdo/direito não respondem aos comandos ou a roda de deslocamento (scroll) falha.</li><li>Falha de ligação (Sem fios/Bluetooth): O teclado ou rato sem fios deixa de responder por completo, mesmo após verificar as pilhas/baterias ou reconectar o recetor USB à porta do computador.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Teclado ou mouse com defeito") {
    callTwo.innerHTML = "<li>Teclas que não respondem ou repetem: Algumas teclas específicas deixam de funcionar, ficam bloqueadas ou escrevem carateres repetidos infinitamente sem que o utilizador continue a pressionar.</li><li>Cursor travado ou cliques falhados: O cursor do rato não se mexe no ecrã, os botões esquerdo/direito não respondem aos comandos ou a roda de deslocamento (scroll) falha.</li><li>Falha de ligação (Sem fios/Bluetooth): O teclado ou rato sem fios deixa de responder por completo, mesmo após verificar as pilhas/baterias ou reconectar o recetor USB à porta do computador.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Falta de espaço em disco") {
    callTwo.innerHTML = "<li>Alertas de armazenamento cheio: O sistema operativo exibe notificações constantes a avisar que a unidade principal está lotada ou em níveis críticos de capacidade.</li><li>Impossibilidade de guardar ficheiros: Erros ao tentar descarregar anexos de e-mail, guardar novos documentos de trabalho ou concluir atualizações essenciais do sistema.</li><li>Acumulação de ficheiros temporários: O disco ficou sobrecarregado com ficheiros de cache, cópias de segurança antigas ou aplicações desnecessárias que comprometem o funcionamento geral.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Programa não abre ou fecha sozinho") {
    callTwo.innerHTML = "<li>Falha ao iniciar: O programa é selecionado (duplo clique ou atalho), o cursor indica carregamento, mas a aplicação nunca chega a abrir a interface na tela.</li><li>Encerramento abrupto (Crash): O programa abre normalmente, mas fecha-se sozinho de forma inesperada a meio de uma tarefa, sem gravar o progresso ou exibir qualquer aviso prévio.</li><li>Erros de conflito ou licença: O programa bloqueia imediatamente após o arranque devido a falhas de compatibilidade, conflitos com o sistema operativo ou bloqueios por parte da segurança interna.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Solicitação de instalação de software") {
    callTwo.innerHTML = "<li>Pedido de novo programa: Necessidade de instalar um programa de trabalho que ainda não está presente no equipamento.</li> <li>Atualização de versão (Upgrade): O programa já está instalado, mas precisa de uma versão mais recente ou de novas funcionalidades.</li> <li>Permissões de administrador: A instalação exige credenciais de administrador da rede/TI para ser concluída.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Licença expirada") {
    callTwo.innerHTML = "<li>Bloqueio de funcionalidades: O software avisa que o prazo de utilização ou subscrição terminou, limitando o uso.</li> <li>Mensagens de ativação: O sistema operativo ou pacote de escritório solicita uma chave de produto ou renovação.</li> <li>Erros de autenticação: A aplicação perdeu a ligação ao servidor de licenças da empresa e não consegue validar o acesso.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Suspeita de vírus ou malware") {
    callTwo.innerHTML = "<li>Comportamento estranho: Janelas a abrir sozinhas ou alterações não solicitadas nas definições.</li> <li>Ficheiros bloqueados: Documentos inacessíveis ou mensagens de aviso e pedido de resgate.</li> <li>Consumo anómalo: Computador extremamente lento com o disco ou CPU a trabalhar no máximo sem motivo.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Sem acesso à internet") {
    callTwo.innerHTML = "<li>Ausência total de conectividade: Ícone de rede com erro e impossibilidade absoluta de navegar ou aceder a sistemas online.</li> <li>Queda de ligação: O computador perde o sinal de Wi-Fi ou cabo de forma intermitente e não reconhece a rede.</li> <li>Falha de autenticação: O equipamento está conectado, mas a rede recusa as credenciais ou o certificado de segurança.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Internet lenta") {
    callTwo.innerHTML = "<li>Demora no carregamento: Os sites ou portais demoram demasiado tempo a abrir ou falham ao carregar elementos.</li> <li>Problemas em chamadas de vídeo: Reuniões online sofrem de cortes constantes, voz desfasada ou imagem congelada.</li> <li>Lentidão em sistemas remotos: Dificuldade e demora extrema ao aceder, guardar ou carregar ficheiros em servidores da empresa.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Wi-Fi não conecta") {
    callTwo.innerHTML = "<li>Redes não visíveis: O computador não consegue detetar o nome da rede sem fios da empresa ou do local.</li> <li>Erro de autenticação: A ligação falha repetidamente ou fica bloqueada ao tentar obter endereço de rede.</li> <li>Adaptador inativo: O Wi-Fi foi desligado por atalho físico/teclado ou o controlador de rede falhou.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Problemas com VPN") {
    callTwo.innerHTML = "<li>Falha de autenticação: O software recusa as credenciais, falha a verificação em dois passos ou o certificado expira.</li> <li>Conexão bloqueada: A aplicação tenta ligar aos servidores mas fica presa indefinidamente sem concluir o acesso.</li> <li>Quebras de sessão: A VPN conecta-se mas vai abaixo constantemente ou torna a navegação extremamente lenta.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Impressora não imprime") {
    callTwo.innerHTML = "<li>Fila de impressão travada: Os documentos são enviados, mas ficam acumulados sem que a impressora reaja.</li> <li>Falha de comunicação: O computador não consegue transmitir o trabalho devido a alterações de rede ou porta.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Impressora offline") {
    callTwo.innerHTML = "<li>Perda de ligação: O sistema indica que o equipamento está offline, mesmo estando ligado à tomada e à rede.</li> <li>Serviço travado: O gestor de impressões do Windows parou de responder, cortando a comunicação.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Papel atolado ou toner acabando") {
    callTwo.innerHTML = "<li>Bloqueio físico: Folhas encravadas nos rolos de alimentação, gaveta ou fusor da impressora.</li> <li>Consumíveis esgotados: Avisos de que o toner, tinteiro ou a caixa de resíduos precisam de substituição.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Webcam, microfone ou fone sem funcionar") {
    callTwo.innerHTML = "<li>Dispositivo não reconhecido: O computador não deteta a câmara, microfone ou auscultadores (USB/Bluetooth).</li> <li>Conflito de permissões: O hardware funciona, mas aplicativos de reunião não conseguem capturar áudio ou vídeo.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Não consigo enviar ou receber e-mails") {
    callTwo.innerHTML = "<li>Falha de sincronização: O programa de correio não consegue ligar-se ao servidor para atualizar as mensagens.</li> <li>Erros de autenticação: Problemas com as credenciais de acesso ou falha no perfil configurado.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Caixa de e-mail cheia") {
    callTwo.innerHTML = "<li>Limite excedido: A conta atingiu o espaço máximo permitido, bloqueando a receção de novos e-mails.</li> <li>Acumulação de dados: Excesso de mensagens antigas e anexos pesados armazenados na caixa postal.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else if (problemOption === "Problemas com Teams, Zoom ou Meet") {
    callTwo.innerHTML = "<li>Falha de início de sessão: Dificuldade em autenticar a conta corporativa nas plataformas de colaboração.</li> <li>Instabilidade em reuniões: Erros de partilha de tela, falhas de ligação ou bloqueio de ferramentas de vídeo.</li>"
    flex(callTwo);
    callTwo.classList.add("open");
    setTimeout(() => {
    flex(buttonopenCall);
    }, 200)
    setTimeout(() => {
      buttonopenCall.classList.add("color");
    }, 1500)
  } else {
    callTwo.innerHTML = ""
    none(callTwo);
  }

  
})

buttonopenCall.addEventListener("click", () => {
  none(question);
  none(boxOption);
  none(callboxOption);
  flex(emailCall);
  solicitacao.classList.remove("color");
})

solicitacao.addEventListener("click", async () => {
  if (!categoriaAtual || !selectProblem.value) {
    alert("Escolha a categoria e o problema antes de enviar.");
    return;
  }

  if (!verificarEmail() || !validarCampo()) {
    alert("Preencha a descrição e um email válido.");
    return;
  }
  if (descricao.value.trim().length > 1000) {
    alert("A descrição pode ter no máximo 1000 caracteres.");
    return;
  }

  try {
    const resposta = await fetch("/chamados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoria: categoriaAtual,
        problema: selectProblem.value,
        email: emailDescricao.value.trim(),
        descricao: descricao.value.trim()
      })
    });
    if (resposta.status === 401) {         
      alert("Sua sessão expirou. Entre novamente.");
      window.location.href = "/index.html";
      return;
    }
    const dados = await resposta.json();
    alert(dados.mensagem);

    if (resposta.ok) {
      descricao.value = "";
      emailDescricao.value = "";
      descricao.style.border = "1px solid gray";
      emailDescricao.style.border = "1px solid gray";
      show(pageHome);
    }
  } catch {
    alert("Não consegui falar com o servidor. Ele está rodando?");
  }
});


const deslog = document.getElementById("deslog");

deslog.addEventListener("click", async () => {
  await fetch("/logout", { method: "POST" });
  window.location.href = "/index.html";
})

/*showOption(null);*/

// ---------- Ver meus chamados (pede a senha) ----------

const formVerChamados = document.getElementById("formVerChamados");
const senhaConfirmar = document.getElementById("senhaConfirmar");
const listaChamados = document.getElementById("listaChamados");
const buttonVerChamados = document.getElementById("buttonVerChamados");

function limparChamados() {
  senhaConfirmar.value = "";
  listaChamados.textContent = "";
}

// ao sair da aba de chamados, some a lista e a senha digitada
[buttonHome, buttonHistoric, buttonConfig].forEach((botao) => {
  botao.addEventListener("click", limparChamados);
  buttonVerChamados.classList.remove("color");
});

buttonChamado.addEventListener("click", () => {
  limparChamados();
  senhaConfirmar.focus();
  setTimeout (() => {
    buttonVerChamados.classList.add("color");
  }, 200)
});

function novoElemento(tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  el.textContent = texto;          // textContent: o texto do usuário nunca vira HTML
  return el;
}

// o que aparece no lugar da descrição, conforme o status do chamado
function textoDoChamado(c) {
  if (c.status === "concluido") {
    return "Chamado concluído. Verifique a caixa de e-mail " + c.email_contato + " para mais informações.";
  }
  if (c.status === "cancelado") {
    return "Chamado cancelado. Motivo: " + (c.motivo_cancelamento || "não informado");
  }
  return c.descricao;
}

function desenharChamados(chamados) {
  listaChamados.textContent = "";

  if (chamados.length === 0) {
    listaChamados.appendChild(novoElemento("p", "chamadoVazio", "Você ainda não abriu nenhum chamado."));
    return;
  }

  chamados.forEach((c) => {
    const card = document.createElement("div");
    card.className = "chamadoCard";

    const topo = document.createElement("div");
    topo.className = "chamadoTopo";
    topo.appendChild(novoElemento("h3", "", "Chamado #" + c.id));
    topo.appendChild(novoElemento("p", "chamadoStatus", c.status));

    // o banco guarda a hora em UTC; aqui vira a hora local de quem está vendo
    const data = new Date(c.criado_em.replace(" ", "T") + "Z").toLocaleString("pt-BR");

    card.appendChild(topo);
    card.appendChild(novoElemento("strong", "", c.categoria + " — " + c.problema));
    card.appendChild(novoElemento("p", "chamadoDescricao", textoDoChamado(c)));
    card.appendChild(novoElemento("span", "chamadoRodape", " • Aberto em " + data));

    listaChamados.appendChild(card);
  });
}

formVerChamados.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (senhaConfirmar.value === "") {
    alert("Digite sua senha.");
    return;
  }

  try {
    const resposta = await fetch("/meus-chamados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: senhaConfirmar.value })
    });

    if (resposta.status === 401) {          // o login expirou
      alert("Sua sessão expirou. Entre novamente.");
      window.location.href = "/index.html";
      return;
    }

    const dados = await resposta.json();

    if (!resposta.ok) {                     // senha incorreta ou muitas tentativas
      alert(dados.mensagem);
      senhaConfirmar.value = "";
      return;
    }

    senhaConfirmar.value = "";              // a senha não fica na tela
    desenharChamados(dados);
  } catch {
    alert("Não consegui falar com o servidor. Ele está rodando?");
  }
});

// ---------- Terminal do administrador ----------
const verificarChamados = document.getElementById("verificarChamados");

verificarChamados.addEventListener("click", async () => {
  try {
    const resposta = await fetch("/abrir-admin", { method: "POST" });
    if (resposta.status === 401) {
      alert("Sua sessão expirou. Entre novamente.");
      window.location.href = "/index.html";
      return;
    }
    if (!resposta.ok) {
      const dados = await resposta.json();
      alert(dados.mensagem);
    }
  } catch {
    alert("Não consegui falar com o servidor. Ele está rodando?");
  }
});
