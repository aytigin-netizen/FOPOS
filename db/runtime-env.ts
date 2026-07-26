import { AsyncLocalStorage } from "node:async_hooks";

const databaseContext = new AsyncLocalStorage<D1Database>();

export function runWithDatabase<T>(
  database: D1Database,
  operation: () => T,
): T {
  return databaseContext.run(database, operation);
}

export function getDatabase(): D1Database {
  const database = databaseContext.getStore();
  if (!database) throw new Error("FOPOS veri alanı kullanıma hazır değil.");
  return database;
}
