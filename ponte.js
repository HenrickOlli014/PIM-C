const { spawn } = require('node:child_process');
const path = require('node:path');
 
function salvarChamadoComC({ usuarioId, categoria, problema, email, descricao }) {
  return new Promise((resolve, reject) => {
    const exe = path.join(__dirname, 'c', process.platform === 'win32' ? 'inserir_chamado.exe' : 'inserir_chamado');
    const proc = spawn(exe, ['bd.db'], { cwd: __dirname });   // sem shell: sem injeção de comando
    let saida = '', erro = '';
    proc.stdout.on('data', d => (saida += d));
    proc.stderr.on('data', d => (erro += d));
    proc.on('error', reject);
    proc.on('close', code => code === 0
      ? resolve(Number(saida.trim()))
      : reject(new Error(erro.trim() || 'falha no programa C (código ' + code + ')')));
    proc.stdin.end(`${usuarioId}\n${categoria}\n${problema}\n${email}\n${descricao}`);
  });
}
 
module.exports = { salvarChamadoComC };