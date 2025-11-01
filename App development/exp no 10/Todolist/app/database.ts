import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

export interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const DATABASE_NAME = 'todo.db';
const TABLE_NAME = 'todos';

export const getDBConnection = () => {
  return openDatabaseSync(DATABASE_NAME);
};

export const createTable = async (db: SQLiteDatabase) => {
  const statement = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        completed INTEGER NOT NULL CHECK(completed IN (0, 1))
    );`;
  await db.execAsync(statement);
};

// --- CRUD Operations ---

// Helper type for reading from the database
type RawTodo = { id: number; task: string; completed: number };

// Get only PENDING todos (for Tab 1)
export const getPendingTodos = async (db: SQLiteDatabase): Promise<Todo[]> => {
  const results = await db.getAllAsync<RawTodo>(`SELECT * FROM ${TABLE_NAME} WHERE completed = 0`);
  return results.map(row => ({ ...row, completed: row.completed === 1 }));
};

// Get only COMPLETED todos (for Tab 2 - History)
export const getCompletedTodos = async (db: SQLiteDatabase): Promise<Todo[]> => {
  const results = await db.getAllAsync<RawTodo>(`SELECT * FROM ${TABLE_NAME} WHERE completed = 1 ORDER BY id DESC`);
  return results.map(row => ({ ...row, completed: row.completed === 1 }));
};

export const addTodo = async (db: SQLiteDatabase, task: string) => {
  const statement = `INSERT INTO ${TABLE_NAME} (task, completed) VALUES (?, 0)`;
  return db.runAsync(statement, task);
};

// This function now effectively "moves" a task to history
export const completeTodo = async (db: SQLiteDatabase, id: number) => {
  const statement = `UPDATE ${TABLE_NAME} SET completed = 1 WHERE id = ?`;
  return db.runAsync(statement, id);
};

// Clears all COMPLETED tasks from the database (for the "Clear History" button)
export const clearHistory = async (db: SQLiteDatabase) => {
  const statement = `DELETE FROM ${TABLE_NAME} WHERE completed = 1`;
  return db.runAsync(statement);
};