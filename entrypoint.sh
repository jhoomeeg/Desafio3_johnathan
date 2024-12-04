#!/bin/bash

# Aguardar até que o banco de dados esteja disponível
echo "Aguardando o banco de dados estar disponível..."
/wait-for-it.sh db:3306 --timeout=30 --strict -- echo "Banco de dados disponível!"

# Rodar os comandos do Sequelize
echo "Criando banco de dados..."
npx sequelize db:create

echo "Rodando migrações..."
npx sequelize db:migrate

echo "Populando o banco de dados com dados de seed..."
npx sequelize-cli db:seed:all

# Iniciar o servidor Node.js
echo "Iniciando a aplicação..."
npm start
