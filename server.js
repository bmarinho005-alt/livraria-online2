// Importa as bibliotecas necessárias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
// Usa a porta fornecida pelo Render (process.env.PORT) ou 3000 se rodando localmente
const port = process.env.PORT || 3000; 

// --- DEFINIÇÃO DO MODELO (SCHEMA) DO LIVRO ---
const livroSchema = new mongoose.Schema({
  titulo: String,
  imagem: String,
  descricao: String,
  categoria: String,
});
const Livro = mongoose.model('Livro', livroSchema);
// --------------------------------------------------------------------------------------------------

// --- CONFIGURAÇÃO DO BANCO DE DADOS ---
// Sua string de conexão com a senha correta (teste12345678)
const mongoUrl = 'mongodb+srv://bmarinho005_db_user:teste12345678@cluster0.jv2degl.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB Atlas com sucesso!'))
.catch(err => console.error('❌ Erro de conexão com o MongoDB:', err));
// -------------------------------------

// --- CONFIGURAÇÕES DO SERVIDOR (Middleware) ---
app.use(cors()); 
app.use(express.json()); 
// Quando hospedado no Render, não usamos express.static aqui, pois o front-end está no GitHub Pages.
//app.use(express.static('C:/projeto livros')); 

// --- ROTAS (Endpoints da API) ---
// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('O back-end está rodando no Render e conectado ao MongoDB! Use /api/livros para a integração.');
});

// Rota para obter livros (PUXA OS DADOS DO MONGODB REAL)
app.get('/api/livros', async (req, res) => {
    try {
        const livrosDoBD = await Livro.find(); // Busca todos os livros no MongoDB
        res.json(livrosDoBD); 
    } catch (error) {
        console.error('Erro ao buscar livros no DB:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Exemplo de rota para ADICIONAR dados (salva no DB)
app.post('/api/items', async (req, res) => {
    try {
        const novoLivro = new Livro(req.body); 
        await novoLivro.save(); 
        res.status(201).send('Livro salvo no MongoDB com sucesso!');
    } catch (error) {
        res.status(400).send('Erro ao salvar o livro.');
    }
});
// --------------------------------

// Inicia o servidor Node.js
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});