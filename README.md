
# CompassCar API - Documentação

## Descrição

Este projeto foi desenvolvido como parte da trilha de Node.js do programa de bolsas da **Compass UOL**. O objetivo principal é criar uma API simulando o sistema **CompassCar**, que oferece funcionalidades como cadastramento de usuários, clientes, carros, e o gerenciamento de pedidos.

---

## Como executar o projeto?

1. **Clone o repositório**  
   Execute o comando abaixo no terminal para clonar o repositório do GitHub:  
   ```bash
   git clone https://github.com/RickM19/AWS_NODE_SET24_DESAFIO_02_THE_BIG_NODE_THEORY
   ```
   Em seguida, acesse o diretório do projeto:  
   ```bash
   cd AWS_NODE_SET24_DESAFIO_02_THE_BIG_NODE_THEORY
   ```

2. **Instale as dependências**  
   Execute o comando abaixo no terminal para instalar todas as dependências do projeto:  
   ```bash
   npm install
   ```

3. **Configure o banco de dados MySQL**  
   - Certifique-se de que o MySQL está ativo em sua máquina.  
   - Abra o arquivo `config/config.json` e atualize as credenciais do seu banco de dados local.  

4. **Execute as etapas do Sequelize**  
   Siga a sequência abaixo para configurar o banco de dados:  
   - Crie o banco de dados:  
     ```bash
     npx sequelize db:create
     ```
   - Execute as migrações:  
     ```bash
     npx sequelize db:migrate
     ```
   - Popule o banco com dados iniciais:  
     ```bash
     npx sequelize-cli db:seed:all
     ```

5. **Inicie o servidor**  
   Execute o comando abaixo no terminal para iniciar o servidor em ambiente de desenvolvimento:  
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**  
   O servidor estará disponível em:  
   - **Base URL:** `http://localhost:3000`  

---

## Como executar os testes unitários?

O projeto possui testes unitários configurados para validar as funcionalidades implementadas. Para executar os testes:

1. Certifique-se de que todas as dependências do projeto foram instaladas:  
   ```bash
   npm install
   ```

2. Execute o comando abaixo no terminal para rodar os testes:  
   ```bash
   npm test
   ```

3. Verifique o resultado dos testes exibido no terminal.

Os testes utilizam **Jest** como framework de testes.

---

## Tecnologias utilizadas

As seguintes tecnologias foram utilizadas no desenvolvimento deste projeto:

- **Node.js**
- **Express**
- **Sequelize**
- **MySQL**
- **TypeScript**
- **Axios**
- **Jsonwebtoken**
- **Celebrate**
- **Bcrypt**
- **ESLint**
- **Jest, Mock**

---

## Rotas principais

Abaixo estão listadas as principais rotas disponíveis na API:

### **Login**
- **POST /api/v1/login**  
  Autentica um usuário no sistema.

### **Usuários**
- **GET /api/v1/users**  
  Retorna a lista de usuários cadastrados.  

### **Clientes**
- **GET /api/v1/customers**  
  Retorna os dados de todos os clientes cadastrados.

### **Carros**
- **GET /api/v1/cars**  
  Lista os carros disponíveis no sistema.  

### **Pedidos**
- **POST /api/v1/orders**  
  Cria um novo pedido para um cliente.

---
