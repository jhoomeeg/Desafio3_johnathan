# Usar a imagem base do Node.js
FROM node:16

# Criar e definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto para o contêiner
COPY . .

# Expor a porta em que a aplicação irá rodar
EXPOSE 3000

# Definir o comando para rodar a aplicação
CMD ["npm", "start"]
