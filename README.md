🛒 Sistema de Gerenciamento de Supermercado

Sistema web desenvolvido para gerenciamento de produtos e usuários de um supermercado, com controle de acesso baseado em permissões (administrador e usuário comum).

📌 Sobre o projeto

O sistema permite que funcionários realizem o gerenciamento de produtos e usuários de forma segura e organizada.

Possui controle de acesso, onde apenas administradores podem realizar operações críticas como cadastro, edição e exclusão de usuários.

🚀 Tecnologias utilizadas

🔹 Frontend
React
Vite
Axios

🔹 Backend
Node.js
Express

🔹 Banco de Dados
MySQL

⚙️ Funcionalidades

🔐 Autenticação
Login de usuários
Validação no backend
Controle de sessão com localStorage

👤 Usuários
Para todos os usuários:
Visualizar lista de usuários
Apenas administradores:
Cadastrar novos usuários
Editar usuários existentes
Remover usuários
Definir permissão (admin ou comum)

🔑 Controle de acesso

O sistema possui dois níveis de usuário:

👤 Administrador
Acesso total ao sistema
Pode gerenciar usuários e produtos

👤 Usuário comum
Pode acessar o sistema
Pode visualizar usuários
Não pode alterar dados de usuários


🛒 Produtos
Listar produtos
Cadastrar produtos
Editar produtos
Remover produtos
Controle de promoção:
preço normal
preço promocional
status de promoção


🗄️ Banco de Dados
🔹 Configuração inicial

Para executar o sistema, é necessário criar o banco de dados no MySQL e executar os comandos abaixo:

🔹 Criar banco de dados
CREATE DATABASE supermercado_admin;
🔹 Selecionar banco
USE supermercado_admin;
🔹 Criar tabela de usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100),
    cpf VARCHAR(14),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🔹 Criar tabela de produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    preco_atual DECIMAL(10,2),
    preco_promocional DECIMAL(10,2),
    tipo VARCHAR(50),
    descricao TEXT,
    validade DATE,
    em_promocao BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
🔹 Criar usuário administrador

INSERT INTO users (nome, email, senha, cpf, is_admin)
VALUES ('Administrador', 'admin@supermercado.com', '123456', '000.000.000-00', 1);


▶️ Como executar o projeto
🔹 1. Backend
cd backend
npm install
node server.js

Servidor rodará em:
http://localhost:3000

🔹 2. Frontend
cd frontend
npm install
npm run dev

Aplicação rodará em:
http://localhost:5173

🔐 Usuário para teste

Email: admin@supermercado.com
Senha: 123456

📌 Observações
O MySQL deve estar em execução
O backend deve ser iniciado antes do frontend
Caso ocorra erro, execute novamente:
npm install

🎯 Objetivo do projeto

Este projeto foi desenvolvido com o objetivo de demonstrar:

Integração entre frontend e backend
Manipulação de banco de dados MySQL
Implementação de CRUD completo
Controle de acesso baseado em permissões
Boas práticas de desenvolvimento web

🧠 Diferenciais do projeto
Sistema com autenticação funcional
Controle de permissões (admin x usuário comum)
Interface organizada e responsiva
Integração completa entre frontend, backend e banco de dados


👨‍💻 Autor
Desenvolvido por:

Mauricio Cardozo.