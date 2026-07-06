import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

let instance: Database | undefined;

/** Constructs the Drizzle client lazily so a missing DATABASE_URL only fails at query time, not at build/import time. */
function getDb(): Database {
  if (!instance) {
    instance = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return instance;
}

export const db: Database = new Proxy({} as Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
