const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// conexão com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '10203040',
    database: 'supermercado_admin'
});

// testar conexão
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// rota de teste
app.get('/', (req, res) => {
    res.send('API funcionando!');
});


// rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND senha = ?';

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro no login:', err);
            return res.status(500).json({ erro: 'Erro no servidor' });
        }

        if (results.length > 0) {
            return res.json({
                mensagem: 'Login realizado com sucesso',
                usuario: results[0]
            });
        } else {
            return res.status(401).json({
                mensagem: 'Usuário ou senha incorretos'
            });
        }
    });
});

//CRUD de usuários
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuários' });
        }

        res.json(results);
    });
});

// rota para criar um novo usuário
app.post('/users', (req, res) => {
    const { nome, email, senha, cpf, is_admin } = req.body;

    const sql = 'INSERT INTO users (nome, email, senha, cpf, is_admin) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [nome, email, senha, cpf, is_admin], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
        }

        res.json({ mensagem: 'Usuário cadastrado com sucesso' });
    });
});

// rota para deletar um usuário
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao deletar usuário' });
        }

        res.json({ mensagem: 'Usuário removido com sucesso' });
    });
});

// rota para atualizar um usuário
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha, cpf, is_admin } = req.body;

    const sql = 'UPDATE users SET nome = ?, email = ?, senha = ?, cpf = ?, is_admin = ? WHERE id = ?';

    db.query(sql, [nome, email, senha, cpf, is_admin, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao atualizar usuário' });
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    });
});

// rota de detalhes do usuário
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json(results[0]);
    });
});

//CRUD de produtos
// rota para listar produtos
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ erro: 'Erro ao buscar produtos' });
        }

        res.json(results);
    });
});

// rota para criar um novo produto
app.post('/products', (req, res) => {
    const {
        nome,
        preco_atual,
        preco_promocional,
        tipo,
        descricao,
        validade,
        em_promocao
    } = req.body;

    const sql = `
        INSERT INTO products
        (nome, preco_atual, preco_promocional, tipo, descricao, validade, em_promocao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [nome, preco_atual, preco_promocional, tipo, descricao, validade, em_promocao],
        (err, result) => {
            if (err) {
                console.error('Erro ao cadastrar produto:', err);
                return res.status(500).json({ erro: 'Erro ao cadastrar produto' });
            }

            res.json({ mensagem: 'Produto cadastrado com sucesso' });
        }
    );
});

// rota para deletar um produto
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM products WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            return res.status(500).json({ erro: 'Erro ao deletar produto' });
        }

        res.json({ mensagem: 'Produto removido com sucesso' });
    });
});

// rota para atualizar um produto
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const {
        nome,
        preco_atual,
        preco_promocional,
        tipo,
        descricao,
        validade,
        em_promocao
    } = req.body;

    const sql = `
        UPDATE products
        SET nome = ?, preco_atual = ?, preco_promocional = ?, tipo = ?, descricao = ?, validade = ?, em_promocao = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [nome, preco_atual, preco_promocional, tipo, descricao, validade, em_promocao, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar produto:', err);
                return res.status(500).json({ erro: 'Erro ao atualizar produto' });
            }

            res.json({ mensagem: 'Produto atualizado com sucesso' });
        }
    );
});

// rota de detalhes do produto
app.get('/products/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'SELECT * FROM products WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            return res.status(500).json({ erro: 'Erro ao buscar produto' });
        }

        if (results.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }

        res.json(results[0]);
    });
});

// iniciar servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});