import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT } = process.env;

// Verificar se as variáveis de ambiente estão presentes
if (!MYSQL_DATABASE || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_HOST || !MYSQL_PORT) {
  throw new Error("Missing environment variables for database connection.");
}

const sequelize = new Sequelize(MYSQL_DATABASE as string, MYSQL_USER as string, MYSQL_PASSWORD as string, {
  host: MYSQL_HOST,
  dialect: "mysql",
  port: parseInt(MYSQL_PORT as string, 10),
});

export default sequelize;
