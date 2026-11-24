const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { salvarChamadoComC } = require('./ponte');
const { exec } = require('node:child_process');
 
const PORTA = 3000;
const SESSAO_MS = 2 * 60 * 60 * 1000;   // o login vale por 2 horas
 
 
// ---------- Banco ----------
const db = new DatabaseSync(path.join(__dirname, 'bd.db'));
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS chamados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        categoria TEXT NOT NULL,
        problema TEXT,
        email_contato TEXT,
        descricao TEXT NOT NULL,
        status TEXT DEFAULT 'aberto',
        criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);
 

const colunas = db.prepare('PRAGMA table_info(chamados)').all().map(c => c.name);
if (!colunas.includes('usuario_id')) {
    db.exec('ALTER TABLE chamados ADD COLUMN usuario_id INTEGER');
}
db.exec('CREATE INDEX IF NOT EXISTS idx_chamados_usuario ON chamados(usuario_id)');
if (!colunas.includes('motivo_cancelamento')) {
    db.exec('ALTER TABLE chamados ADD COLUMN motivo_cancelamento TEXT');
}
 
 
// ---------- Senha ----------
function criarHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return salt + ':' + hash;
}
 
function conferirSenha(password, guardado) {
  const [salt, hash] = guardado.split(':');
  const novoHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return novoHash === hash;
}
 
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
function senhaForte(s) {
  return typeof s === 'string' && s.length >= 8 && s.length <= 100 &&
    /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s) && /[^A-Za-z0-9]/.test(s);
}
 
 
// ---------- Sessão ----------
const sessoes = new Map();   
 
function iniciarSessao(usuarioId) {
    const token = crypto.randomBytes(32).toString('hex');
    sessoes.set(token, { usuarioId, expira: Date.now() + SESSAO_MS });
    return `sessao=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSAO_MS / 1000}`;
}
 
function sessaoDe(req) {
    const m = (req.headers.cookie || '').match(/(?:^|;\s*)sessao=([a-f0-9]{64})/);
    const s = m && sessoes.get(m[1]);
    if (!s) return null;
    if (s.expira < Date.now()) { sessoes.delete(m[1]); return null; }
    return { token: m[1], usuarioId: s.usuarioId };
}
 
 
// ---------- Limite de tentativas ao confirmar a senha ----------
const falhasSenha = new Map();  

function confirmacaoBloqueada(usuarioId) {
    const f = falhasSenha.get(usuarioId);
    return !!f && f.ate > Date.now() && f.qtd >= 5;     // 5 erros = bloqueia por 15 minutos
}

function registrarFalha(usuarioId) {
    const f = falhasSenha.get(usuarioId);
    if (!f || f.ate < Date.now()) {
        falhasSenha.set(usuarioId, { qtd: 1, ate: Date.now() + 15 * 60 * 1000 });
    } else {
        f.qtd++;
    }
}


// ---------- Utilidades ----------
function responder(res, status, mensagem, extra = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...extra });
  res.end(JSON.stringify({ mensagem }));
}
 
function lerJSON(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', parte => {
      body += parte;
      if (body.length > 20000) { reject(new Error('Corpo grande demais')); req.destroy(); }
    });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}
 
const tiposArquivos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
 
function enviarArquivo(res, nome) {
  res.writeHead(200, { 'Content-Type': tiposArquivos[path.extname(nome)] });
  fs.createReadStream(path.join(__dirname, 'public', nome)).pipe(res);
}
 

const arquivos = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/login.js': 'login.js',
  '/script.js': 'script.js',
  '/styles.css': 'styles.css'
};
 
 
// ---------- Servidor ----------
const server = http.createServer(async (req, res) => {
  try {
 
    // CADASTRO 
    if (req.method === 'POST' && req.url === '/cadastro') {
      const { email, password } = await lerJSON(req);
      if (!email || !password) return responder(res, 400, 'Preencha email e senha');
      if (typeof email !== 'string' || !regexEmail.test(email.trim()) || email.length > 100) {
        return responder(res, 400, 'Email inválido');
      }
      if (!senhaForte(password)) {
        return responder(res, 400, 'Senha fraca: mínimo 8 caracteres, com maiúscula, minúscula, número e caractere especial');
      }
 
      const emailNorm = email.trim().toLowerCase();
      const exist = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(emailNorm);
      if (exist) return responder(res, 409, 'Email já cadastrado');
 
      const r = db.prepare('INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)')
        .run(emailNorm, criarHash(password));
      return responder(res, 201, 'Cadastro realizado!', {
        'Set-Cookie': iniciarSessao(Number(r.lastInsertRowid))
      });
    }
 
    // LOGIN
    if (req.method === 'POST' && req.url === '/login') {
      const { email, password } = await lerJSON(req);
      const emailNorm = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(emailNorm);
 
      if (!usuario || typeof password !== 'string' || !conferirSenha(password, usuario.senha_hash)) {
        return responder(res, 401, 'Email ou senha incorretos');
      }
      return responder(res, 200, 'Logado!', { 'Set-Cookie': iniciarSessao(usuario.id) });
    }
 
    // LOGOUT
    if (req.method === 'POST' && req.url === '/logout') {
      const s = sessaoDe(req);
      if (s) sessoes.delete(s.token);
      return responder(res, 200, 'Saiu', {
        'Set-Cookie': 'sessao=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
      });
    }
 
    
    if (req.method === 'POST' && req.url === '/chamados') {
      const s = sessaoDe(req);
      if (!s) return responder(res, 401, 'Faça login para abrir um chamado');
 
      const { categoria, problema = '', email, descricao } = await lerJSON(req);
 
      const curtos = [categoria, problema, email];
      const invalido =
        curtos.some(c => typeof c !== 'string' || c.length > 90 || /[\r\n]/.test(c)) ||
        !categoria.trim() || !problema.trim() ||
        !regexEmail.test(email) ||
        typeof descricao !== 'string' || !descricao.trim() || descricao.length > 1000;
      if (invalido) return responder(res, 400, 'Dados do chamado inválidos');
 
      let id;
      try {
        id = await salvarChamadoComC({ usuarioId: s.usuarioId, categoria, problema, email, descricao });
      } catch (erro) {
        console.log('Erro no programa C:', erro.message);
        return responder(res, 500, 'Não foi possível salvar o chamado. Avise o administrador.');
      }
      return responder(res, 201, 'Chamado ' + id + ' aberto!');
    }
 
    
    // VER os chamados de quem está logado: pede a senha de novo
    if (req.method === 'POST' && req.url === '/meus-chamados') {
      const s = sessaoDe(req);
      if (!s) return responder(res, 401, 'Faça login');

      if (confirmacaoBloqueada(s.usuarioId)) {
        return responder(res, 429, 'Muitas tentativas. Tente de novo em alguns minutos.');
      }

      const { password } = await lerJSON(req);
      const usuario = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(s.usuarioId);

      if (!usuario || typeof password !== 'string' || !conferirSenha(password, usuario.senha_hash)) {
        registrarFalha(s.usuarioId);
        return responder(res, 403, 'Senha incorreta');
      }
      falhasSenha.delete(s.usuarioId);

      const lista = db.prepare(`
        SELECT id, categoria, problema, email_contato, descricao, status, criado_em, motivo_cancelamento
        FROM chamados WHERE usuario_id = ? ORDER BY id DESC
      `).all(s.usuarioId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(lista));
    }
 
    // ABRIR O TERMINAL DO ADMINISTRADOR 
    if (req.method === 'POST' && req.url === '/abrir-admin') {
      if (!sessaoDe(req)) return responder(res, 401, 'Faça login');
      if (process.platform !== 'win32') return responder(res, 501, 'O terminal do administrador só abre no Windows');
      const exe = path.join(__dirname, 'c', 'admin.exe');
      const banco = path.join(__dirname, 'bd.db');
      if (!fs.existsSync(exe)) return responder(res, 500, 'admin.exe não encontrado na pasta c');
      exec(`start "Painel Administrativo" "${exe}" "${banco}"`, { cwd: __dirname }, (erro) => {
        if (erro) console.log('Erro ao abrir o admin:', erro.message);
      });
      return responder(res, 200, 'Terminal aberto');
    }

    // PÁGINA PROTEGIDA
    if (req.method === 'GET' && req.url === '/page.html') {
      if (!sessaoDe(req)) {
        res.writeHead(302, { Location: '/index.html' });
        return res.end();
      }
      return enviarArquivo(res, 'page.html');
    }
 

    if (req.method === 'GET' && req.url.startsWith('/images/')) {
      const caminho = path.join(__dirname, 'public', 'images', path.basename(req.url));
      if (fs.existsSync(caminho)) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        return fs.createReadStream(caminho).pipe(res);
      }
    }
 

    const name = arquivos[req.url];
    if (req.method === 'GET' && name) {
      return enviarArquivo(res, name);
    }
 
    res.writeHead(404);
    res.end('Não encontrado');
 
  } catch (erro) {
    console.log(erro);
    if (erro instanceof SyntaxError) return responder(res, 400, 'Requisição inválida');
    responder(res, 500, 'Erro interno do servidor');
  }
});
 
server.listen(PORTA, () => console.log(`Rodando em http://localhost:${PORTA}`));