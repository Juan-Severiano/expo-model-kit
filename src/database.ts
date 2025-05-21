/**
 * Gerenciamento de conexão com o banco de dados
 */
import * as SQLite from 'expo-sqlite';
/**
 * Classe singleton para gerenciar a conexão com o banco de dados
 */
class Database {
    private static instance: Database;
    private db: SQLite.SQLiteDatabase | null = null;
    private dbName = 'modelkit_database.db';
    private initialized = false;

    /**
     * Obtém a instância singleton do Database
     */
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Inicializa a conexão com o banco de dados
     */
    public async initialize(): Promise<void> {
        if (this.initialized) return;
        try {
            console.log(`[ModelKit] Inicializando banco de dados: ${this.dbName}`);
            this.db = await SQLite.openDatabaseAsync(this.dbName);
            this.initialized = true;
            console.log('[ModelKit] Banco de dados inicializado com sucesso');
        } catch (error) {
            console.error('[ModelKit] Erro ao inicializar banco de dados:', error);
            throw error;
        }
    }

    /**
     * Executa uma consulta SQL e retorna todos os resultados
     * @param query A consulta SQL
     * @param params Parâmetros da consulta
     * @returns Resultados da consulta
     */
    public async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
        if (!this.db) {
            await this.initialize();
        }
        if (!this.db) {
            throw new Error('[ModelKit] Banco de dados não inicializado');
        }
        try {
            const result = await this.db.getAllAsync<T>(query, params);
            return result;
        } catch (error) {
            console.error(`[ModelKit] Erro ao executar consulta: ${query}`, error);
            throw error;
        }
    }

    /**
     * Executa uma consulta SQL que não retorna resultados (ex: CREATE, INSERT, UPDATE, DELETE)
     * @param query A consulta SQL
     * @param params Parâmetros da consulta
     * @returns Objeto com informações sobre a execução
     */
    public async executeNonQuery(query: string, params: any[] = []): Promise<{ lastInsertId: number | null }> {
        if (!this.db) {
            await this.initialize();
        }
        if (!this.db) {
            throw new Error('[ModelKit] Banco de dados não inicializado');
        }
        try {
            let finalQuery = query;
            if (params.length > 0) {
                params.forEach((param, index) => {
                    const placeholder = typeof param === 'string' 
                        ? `'${param.replace(/'/g, "''")}'` 
                        : param === null 
                            ? 'NULL' 
                            : String(param);
                    finalQuery = finalQuery.replace(`?`, placeholder);
                });
            }
            
            await this.db.execAsync(finalQuery);
            
            let lastInsertId: number | null = null;
            if (query.trim().toUpperCase().startsWith('INSERT')) {
                const lastIdResult = await this.executeQuery<{ last_insert_rowid: number }>('SELECT last_insert_rowid() as last_insert_rowid');
                lastInsertId = lastIdResult[0]?.last_insert_rowid || null;
            }
            return { lastInsertId };
        } catch (error) {
            console.error(`[ModelKit] Erro ao executar consulta: ${query}`, error);
            throw error;
        }
    }

    /**
     * Obtém a referência ao banco de dados
     */
    public getDatabase(): SQLite.SQLiteDatabase | null {
        return this.db;
    }

    /**
     * Define o nome do banco de dados
     * @param name Nome do banco de dados
     */
    public setDatabaseName(name: string): void {
        if (this.initialized) {
            throw new Error('[ModelKit] Não é possível alterar o nome do banco de dados após a inicialização');
        }
        this.dbName = name;
    }
}

export const database = Database.getInstance();
