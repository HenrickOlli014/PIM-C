#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "sqlite3.h"
 
#define MAX_CAMPO 200
#define MAX_DESC  2000
 

static int ler_linha(char *destino, size_t tamanho) {
    if (!fgets(destino, (int)tamanho, stdin)) return 0;
    size_t len = strcspn(destino, "\r\n");
    if (destino[len] == '\0') {          
        int c;
        while ((c = getchar()) != '\n' && c != EOF) { }
    }
    destino[len] = '\0';
    return 1;
}
 
int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "uso: inserir_chamado <arquivo.db>\n");
        return 2;
    }
 
    char linha_id[MAX_CAMPO];
    char categoria[MAX_CAMPO], problema[MAX_CAMPO], email[MAX_CAMPO];
    char descricao[MAX_DESC + 1];
 
    if (!ler_linha(linha_id,  sizeof linha_id)  ||
        !ler_linha(categoria, sizeof categoria) ||
        !ler_linha(problema,  sizeof problema)  ||
        !ler_linha(email,     sizeof email)) {
        fprintf(stderr, "entrada incompleta\n");
        return 3;
    }
 
    
    char *fim = NULL;
    long long usuario_id = strtoll(linha_id, &fim, 10);
    if (linha_id[0] == '\0' || *fim != '\0' || usuario_id <= 0) {
        fprintf(stderr, "usuario_id invalido\n");
        return 3;
    }
 
    size_t n = fread(descricao, 1, MAX_DESC, stdin);  
    descricao[n] = '\0';
 
    if (categoria[0] == '\0' || descricao[0] == '\0') {
        fprintf(stderr, "categoria e descricao sao obrigatorias\n");
        return 3;
    }
 
    sqlite3 *db = NULL;
    if (sqlite3_open(argv[1], &db) != SQLITE_OK) {
        fprintf(stderr, "nao abriu o banco: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 4;
    }
    sqlite3_busy_timeout(db, 3000);   
 
    const char *criar =
        "CREATE TABLE IF NOT EXISTS chamados ("
        " id INTEGER PRIMARY KEY AUTOINCREMENT,"
        " usuario_id INTEGER,"
        " categoria TEXT NOT NULL,"
        " problema TEXT,"
        " email_contato TEXT,"
        " descricao TEXT NOT NULL,"
        " status TEXT DEFAULT 'aberto',"
        " criado_em TEXT DEFAULT CURRENT_TIMESTAMP)";
    char *erro = NULL;
    if (sqlite3_exec(db, criar, NULL, NULL, &erro) != SQLITE_OK) {
        fprintf(stderr, "erro ao criar tabela: %s\n", erro);
        sqlite3_free(erro);
        sqlite3_close(db);
        return 5;
    }
 
    const char *sql =
        "INSERT INTO chamados (usuario_id, categoria, problema, email_contato, descricao) "
        "VALUES (?, ?, ?, ?, ?)";
    sqlite3_stmt *stmt = NULL;
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        fprintf(stderr, "erro no SQL: %s\n", sqlite3_errmsg(db));
        sqlite3_close(db);
        return 5;
    }
    sqlite3_bind_int64(stmt, 1, usuario_id);
    sqlite3_bind_text(stmt, 2, categoria, -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, problema,  -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, email,     -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, descricao, -1, SQLITE_TRANSIENT);
 
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        fprintf(stderr, "erro ao gravar: %s\n", sqlite3_errmsg(db));
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return 6;
    }
 
    printf("%lld\n", (long long)sqlite3_last_insert_rowid(db));  
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    return 0;
}