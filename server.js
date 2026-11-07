const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');


const PORTA = 3000;


const db = new DatabaseSync(path.join(__dirname, 'bd.db'));
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE NOT NULL, 
        senha_hash TEXT NOT NULL 
    );  
`);

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

function responder(res, status, mensagem) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ mensagem }));
}

const arquivos = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/page.html': 'page.html',
  '/login.js': 'login.js',
  '/script.js': 'script.js',
  '/styles.css': 'styles.css'
};

const tiposArquivos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && (req.url === '/cadastro' || req.url === '/login')) {
        let body = '';
        req.on('data', parte => (body += parte));
        req.on('end', () => {
            try {
                const {email, password} = JSON.parse(body);
                if(!email || !password) return responder(res, 400, 'Preencha email e senha');

                if(req.url === '/cadastro') {
                    const exist = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
                    if(exist) return responder(res, 409, "Email já cadastrado");

                    db.prepare('INSERT INTO usuarios (email, senha_hash) VALUES (?, ?)').run(email, criarHash(password));
                    return responder(res, 201, 'Cadastro realizado!');
                }

                const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
                if (!usuario || !conferirSenha(password, usuario.senha_hash)) {
                    return responder(res, 401, 'Email ou senha incorretos');
                }

            } catch {
               responder(res, 400, 'Dados inválidos'); 
            } 
        });
        return
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
        res.writeHead(200, { 'Content-Type': tiposArquivos[path.extname(name)] });
        return fs.createReadStream(path.join(__dirname, 'public', name)).pipe(res);
    }

    res.writeHead(404);
    res.end('Não encontrado');
});

server.listen(3000, () => console.log('Rodando em http://localhost:3000'));