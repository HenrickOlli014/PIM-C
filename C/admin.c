#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "sqlite3.h"

#ifdef _WIN32
#include <windows.h>
#include <conio.h>
#endif

sqlite3 *db;

/* ---------- Dados de acesso ---------- */
#define QTD_ADMINS 6
const char *ADMINS[QTD_ADMINS] = {
    "pedroC.adm", "gabriel.adm", "cris.adm", "hary.adm", "pedroH.adm", "guto.adm"
};
const char *SENHA_ADMIN = "nig.gen.2026";

/* mesmos nomes que o script.js grava no banco (categoriaAtual) */
#define QTD_CATEGORIAS 5
const char *CATEGORIAS[QTD_CATEGORIAS] = {
    "Computador",
    "Software e sistemas",
    "Rede e internet",
    "Impressoras e periféricos",
    "E-mail e comunicação"
};

/* ---------- Funcoes de apoio ---------- */
void limpar_tela(void) {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void ler_texto(const char *aviso, char *destino, int tamanho) {
    printf("%s", aviso);
    if (!fgets(destino, tamanho, stdin)) {
        destino[0] = '\0';
        return;
    }
    size_t len = strcspn(destino, "\r\n");
    if (destino[len] == '\0') {            /* linha maior que o buffer: descarta o resto */
        int c;
        while ((c = getchar()) != '\n' && c != EOF) { }
    }
    destino[len] = '\0';
}

void ler_senha(char *destino, int tamanho) {
#ifdef _WIN32
    int i = 0, c;
    printf("Senha: ");
    while ((c = _getch()) != '\r' && c != '\n') {
        if (c == 0 || c == 224) { _getch(); continue; }       /* teclas especiais */
        if (c == 8) {                                         /* backspace */
            if (i > 0) { i--; printf("\b \b"); }
        } else if (c >= 32 && i < tamanho - 1) {
            destino[i++] = (char)c;
            printf("*");
        }
    }
    destino[i] = '\0';
    printf("\n");
#else
    ler_texto("Senha: ", destino, tamanho);
#endif
}

void pausa(void) {
    char lixo[10];
    ler_texto("\nPressione Enter para continuar...", lixo, sizeof lixo);
}

/* sqlite3_column_text pode devolver NULL */
const char *texto(sqlite3_stmt *stmt, int coluna) {
    const char *t = (const char *)sqlite3_column_text(stmt, coluna);
    return t ? t : "";
}

/* ---------- Login ---------- */
int fazer_login(void) {
    for (int tentativa = 1; tentativa <= 3; tentativa++) {
        char usuario[60], senha[60];
        int usuario_ok = 0;

        printf("=== NextGen Solutions - Area Administrativa ===\n\n");
        ler_texto("Login: ", usuario, sizeof usuario);
        ler_senha(senha, sizeof senha);

        for (int i = 0; i < QTD_ADMINS; i++) {
            if (strcmp(usuario, ADMINS[i]) == 0) usuario_ok = 1;
        }
        if (usuario_ok && strcmp(senha, SENHA_ADMIN) == 0) return 1;

        printf("\nLogin ou senha incorretos (%d de 3).\n\n", tentativa);
    }
    return 0;
}

/* ---------- Fechar / Cancelar ---------- */
void fechar_chamado(long long id) {
    sqlite3_stmt *stmt;
    const char *sql = "UPDATE chamados SET status = 'concluido' WHERE id = ? AND status = 'aberto'";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
        return;
    }
    sqlite3_bind_int64(stmt, 1, id);
    if (sqlite3_step(stmt) == SQLITE_DONE && sqlite3_changes(db) > 0)
        printf("\nChamado %lld concluido!\n", id);
    else
        printf("\nNao foi possivel fechar o chamado.\n");
    sqlite3_finalize(stmt);
}

void cancelar_chamado(long long id) {
    char motivo[501];
    ler_texto("\nEscreva o motivo do cancelamento: ", motivo, sizeof motivo);
    if (motivo[0] == '\0') {
        printf("O motivo e obrigatorio. Chamado nao cancelado.\n");
        return;
    }

    sqlite3_stmt *stmt;
    const char *sql = "UPDATE chamados SET status = 'cancelado', motivo_cancelamento = ? "
                      "WHERE id = ? AND status = 'aberto'";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
        return;
    }
    sqlite3_bind_text(stmt, 1, motivo, -1, SQLITE_TRANSIENT);
    sqlite3_bind_int64(stmt, 2, id);
    if (sqlite3_step(stmt) == SQLITE_DONE && sqlite3_changes(db) > 0)
        printf("\nChamado %lld cancelado!\n", id);
    else
        printf("\nNao foi possivel cancelar o chamado.\n");
    sqlite3_finalize(stmt);
}

/* ---------- Detalhe de um chamado ---------- */
void abrir_chamado(long long id) {
    sqlite3_stmt *stmt;
    const char *sql =
        "SELECT categoria, problema, email_contato, descricao, status, "
        "strftime('%d/%m/%Y %H:%M', criado_em, 'localtime') FROM chamados WHERE id = ?";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
        pausa();
        return;
    }
    sqlite3_bind_int64(stmt, 1, id);

    if (sqlite3_step(stmt) != SQLITE_ROW) {
        printf("\nChamado %lld nao encontrado.\n", id);
        sqlite3_finalize(stmt);
        pausa();
        return;
    }

    char status[30];
    snprintf(status, sizeof status, "%s", texto(stmt, 4));

    printf("\n===== Chamado %lld =====\n", id);
    printf("Categoria : %s\n", texto(stmt, 0));
    printf("Problema  : %s\n", texto(stmt, 1));
    printf("Email     : %s\n", texto(stmt, 2));
    printf("Status    : %s\n", status);
    printf("Aberto em : %s\n", texto(stmt, 5));
    printf("Descricao : %s\n", texto(stmt, 3));
    sqlite3_finalize(stmt);

    if (strcmp(status, "aberto") != 0) {
        printf("\nEste chamado ja esta %s e nao pode mais ser alterado.\n", status);
        pausa();
        return;
    }

    printf("\n1 - Fechar chamado\n2 - Cancelar chamado\n3 - Voltar\n");
    char opcao[10];
    ler_texto("Escolha: ", opcao, sizeof opcao);

    if (opcao[0] == '1') {
        fechar_chamado(id);
        pausa();
    } else if (opcao[0] == '2') {
        cancelar_chamado(id);
        pausa();
    }
    /* qualquer outra coisa (inclusive 3) volta para a lista */
}

/* ---------- Opcao 1: verificar todos ---------- */
void verificar_todos(void) {
    while (1) {
        limpar_tela();
        printf("===== Todos os chamados =====\n\n");

        sqlite3_stmt *stmt;
        const char *sql =
            "SELECT id, categoria, problema, status, datetime(criado_em, 'localtime') "
            "FROM chamados ORDER BY criado_em DESC, id DESC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
            printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
            pausa();
            return;
        }

        int total = 0;
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            printf("#%d | %s | %s | %s - %s\n",
                   sqlite3_column_int(stmt, 0), texto(stmt, 3), texto(stmt, 4),
                   texto(stmt, 1), texto(stmt, 2));
            total++;
        }
        sqlite3_finalize(stmt);

        if (total == 0) {
            printf("Nenhum chamado cadastrado.\n");
            pausa();
            return;
        }

        char entrada[30];
        ler_texto("\nDigite o numero do chamado (0 para voltar): ", entrada, sizeof entrada);

        char *fim = NULL;
        long long id = strtoll(entrada, &fim, 10);
        if (entrada[0] == '\0' || *fim != '\0' || id < 0) {
            printf("Numero invalido.\n");
            pausa();
            continue;
        }
        if (id == 0) return;

        abrir_chamado(id);
    }
}

/* ---------- Opcao 2: quantidade por tipo ---------- */
void consultar_quantidade(void) {
    limpar_tela();
    printf("===== Quantidade de chamados por tipo =====\n\n");

    sqlite3_stmt *stmt;
    const char *sql = "SELECT COUNT(*) FROM chamados WHERE categoria = ?";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
        pausa();
        return;
    }
    for (int i = 0; i < QTD_CATEGORIAS; i++) {
        sqlite3_reset(stmt);
        sqlite3_bind_text(stmt, 1, CATEGORIAS[i], -1, SQLITE_STATIC);
        int qtd = 0;
        if (sqlite3_step(stmt) == SQLITE_ROW) qtd = sqlite3_column_int(stmt, 0);
        printf("%s: %d\n", CATEGORIAS[i], qtd);
    }
    sqlite3_finalize(stmt);

    if (sqlite3_prepare_v2(db, "SELECT COUNT(*) FROM chamados", -1, &stmt, NULL) == SQLITE_OK) {
        if (sqlite3_step(stmt) == SQLITE_ROW)
            printf("\nTOTAL: %d\n", sqlite3_column_int(stmt, 0));
        sqlite3_finalize(stmt);
    }
    pausa();
}

/* ---------- Opcao 3: data limite (mais de 7 dias abertos) ---------- */
void data_limite(void) {
    limpar_tela();
    printf("===== Chamados em atraso (abertos ha mais de 7 dias) =====\n\n");

    sqlite3_stmt *stmt;
    const char *sql =
        "SELECT id, categoria, problema, datetime(criado_em, 'localtime'), "
        "CAST(julianday('now') - julianday(criado_em) AS INTEGER) "
        "FROM chamados WHERE status = 'aberto' AND criado_em < datetime('now', '-7 days') "
        "ORDER BY criado_em ASC";
    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK) {
        printf("Erro no SQL: %s\n", sqlite3_errmsg(db));
        pausa();
        return;
    }

    int total = 0;
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        printf("#%d | %s (%d dias) | %s - %s\n",
               sqlite3_column_int(stmt, 0), texto(stmt, 3), sqlite3_column_int(stmt, 4),
               texto(stmt, 1), texto(stmt, 2));
        total++;
    }
    sqlite3_finalize(stmt);

    if (total == 0) printf("Nao ha chamados em atraso.\n");
    pausa();
}

/* ---------- Programa principal ---------- */
int main(int argc, char *argv[]) {
#ifdef _WIN32
    SetConsoleOutputCP(65001);   /* acentos (UTF-8) no terminal */
    SetConsoleCP(65001);
#endif

    const char *arquivo = (argc >= 2) ? argv[1] : "bd.db";
    if (sqlite3_open(arquivo, &db) != SQLITE_OK) {
        printf("Nao abriu o banco: %s\n", sqlite3_errmsg(db));
        pausa();
        return 1;
    }
    sqlite3_busy_timeout(db, 3000);

    /* coluna do motivo de cancelamento (se ja existir, o erro e ignorado) */
    sqlite3_exec(db, "ALTER TABLE chamados ADD COLUMN motivo_cancelamento TEXT", NULL, NULL, NULL);

    if (!fazer_login()) {
        printf("\nAcesso negado.\n");
        pausa();
        sqlite3_close(db);
        return 1;
    }

    char opcao[10];
    do {
        limpar_tela();
        printf("===== Painel Administrativo =====\n\n");
        printf("1 - Verificar todos os chamados\n");
        printf("2 - Consultar quantidade de chamados\n");
        printf("3 - Data limite\n");
        printf("4 - Sair\n\n");
        ler_texto("Escolha: ", opcao, sizeof opcao);

        if (opcao[0] == '1')      verificar_todos();
        else if (opcao[0] == '2') consultar_quantidade();
        else if (opcao[0] == '3') data_limite();
    } while (opcao[0] != '4');

    sqlite3_close(db);
    return 0;
}
