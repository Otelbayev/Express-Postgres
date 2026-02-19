import pkg from "pg";
import { ENV } from "./env.js";

const { Pool } = pkg;

export const pool = new Pool({
  user: ENV.DB_USER,
  host: ENV.DB_HOST,
  database: ENV.DB_NAME,
  password: ENV.DB_PASSWORD,
  port: ENV.DB_PORT,
});
