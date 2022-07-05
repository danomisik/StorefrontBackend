import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const { 
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  ENV,
  POSTGRES_TEST_DB,
  POSTGRES_PORT,
  POSTGRES_TEST_PORT
} = process.env;

console.log(`ENV started: ${ENV}`);
let client: Pool;

if(ENV === 'test') {
  client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_TEST_PORT)
});
} else {
  client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT)
});
}

export default client;
