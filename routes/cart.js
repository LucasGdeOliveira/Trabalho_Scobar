const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const CartService = require('../services/cartService');
const cartService = new CartService();  // Instancia corretamente o CartService

// Adicionar produto ao carrinho
router.post('/add', (req, res) => CartController.addProduct(req, res));

router.delete('/remove/:productId', async (req, res) => {
    const { userId } = req.body;  // userId vem do corpo da requisição
    const { productId } = req.params; // productId vem da URL

    console.log('productId:', productId);  // productId vem da URL

    if (!userId || !productId) {
        return res.status(400).json({ message: 'userId e productId são obrigatórios.' });
    }

    try {
        const updatedCart = await cartService.removeProductFromCart(userId, productId);  // Chama a função corretamente
        return res.status(200).json({ message: 'Produto removido do carrinho.', cart: updatedCart });
    } catch (error) {
        console.error('Erro ao remover produto do carrinho:', error.message);
        return res.status(500).json({ message: error.message });
    }
});

// Visualizar carrinho
router.get('/', (req, res) => CartController.viewCart(req, res));

module.exports = router;
