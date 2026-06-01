import dotenv from "dotenv";
import {Pool} from "pg";
 dotenv.config();

export const db = new Pool({
    user : process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME
})