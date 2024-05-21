const express = require('express');  // Importa o Express
const multer = require('multer');    // Importa o multer
const path = require('path');        // Importa o módulo path para manipular caminhos de arquivos

const app = express();  // Cria uma instância do Express

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Define o destino dos arquivos carregados
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Define o nome dos arquivos armazenados
  },
});

const upload = multer({ storage });  // Cria a instância de upload com o armazenamento configurado

// Rota para postar imagens
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  res.send(`Arquivo ${req.file.filename} carregado com sucesso!`);
});

// Configura o servidor para ouvir na porta 3000
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });
