import "dotenv/config";
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";
import { Pool } from "pg";

const pool:any = new Pool({
  connectionString: process.env.DATABASE_URL,
});


export const db = drizzle(pool, { schema });



// const sql = neon(process.env.DATABASE_URL!);

// export const db = drizzle(sql, { schema });
