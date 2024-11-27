// routes/produtos.js

const express = require('express');
const router = express.Router();
const ProdutosService = require('../services/produtosService');
const ProdutosController = require('../controllers/produtosController');
const db = require('../models');

// Instancia os serviços e controladores
const produtosService = new ProdutosService(db.Produtos);
const produtosController = new ProdutosController(produtosService);

// Rota para criar produto
router.post('/', (req, res) => {
    return produtosController.createProduto(req, res);
});

// Rota para listar todos os produtos
router.get('/', (req, res) => {
    return produtosController.listProdutos(req, res);
});

// Rota para atualizar produto
router.put('/:id', (req, res) => {
    return produtosController.updateProduto(req, res);
});

// Rota para deletar produto
router.delete('/:id', (req, res) => {
    return produtosController.deleteProduto(req, res);
});

module.exports = router;
