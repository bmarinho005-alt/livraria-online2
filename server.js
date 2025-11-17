// Importa as bibliotecas necessárias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const path = require('path'); // Importa o módulo 'path' do Node.js

const app = express();
const port = 3000; // Onde o servidor roda localmente (na sua máquina)

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
// String de conexão com o nome do DB especificado (/Cluster0)
const mongoUrl = 'mongodb+srv://bmarinho005_db_user:teste12345678@cluster0.jv2degl.mongodb.net/Cluster0?appName=Cluster0';

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

// Configuração de arquivos estáticos para funcionar no Render e localmente
// Isso serve index.html, catalogo.html, styles.css, img/, etc., a partir da pasta raiz do projeto.
app.use(express.static(path.join(__dirname, '/'))); 

// --- ROTAS (Endpoints da API) ---
// Rota inicial de teste
app.get('/', (req, res) => {
  res.send('O back-end está rodando e conectado ao MongoDB! Use /api/livros para a integração.');
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
        const novoLivro = new Livro(req.body); // Cria um novo documento com os dados recebidos
        await novoLivro.save(); // Salva no MongoDB
        res.status(201).send('Livro salvo no MongoDB com sucesso!');
    } catch (error) {
        res.status(400).send('Erro ao salvar o livro.');
    }
});
// --------------------------------

// Inicia o servidor Node.js
app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`);
});