const CartService = require('../services/cartService');
const cartService = new CartService();

class CartController {
    // Adiciona um produto ao carrinho
    async addProduct(req, res) {
        const { userId, productId, quantidade } = req.body;

        if (!userId || !productId || isNaN(quantidade) || quantidade <= 0) {
            return res.status(400).json({ message: 'Dados inválidos. Certifique-se de que userId, productId e quantidade sejam válidos.' });
        }

        try {
            const updatedCart = await cartService.addProductToCart(userId, productId, quantidade);
            return res.status(200).json({ message: 'Produto adicionado ao carrinho.', cart: updatedCart });
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }

    // Função de remoção do produto do carrinho
async removeProduct(req, res) {
    const { userId } = req.body;  // Recebe o userId no corpo da requisição
    const { productId } = req.params;  // Recebe o productId da URL

    if (!userId || !productId) {
        return res.status(400).json({ message: 'userId e productId são obrigatórios.' });
    }

    try {
        // Verifica se o carrinho do usuário existe, caso contrário cria um novo carrinho
        let cart = await cartService.createCartIfNotExists(userId);

        // Verifica se o produto existe no carrinho
        const cartProduto = await CartProdutos.findOne({
            where: { cartId: cart.id, produtoId: productId }
        });

        if (!cartProduto) {
            return res.status(404).json({ message: 'Produto não encontrado no carrinho.' });
        }

        // Reabastece o estoque do produto no carrinho
        const produto = await Produtos.findByPk(productId);
        if (produto) {
            produto.estoque += cartProduto.quantidade;
            await produto.save();
        }

        // Remove o produto do carrinho
        await cartProduto.destroy();

        // Retorna o carrinho atualizado após a remoção
        const updatedCart = await cartService.getCart(userId);

        return res.status(200).json({
            message: 'Produto removido do carrinho.',
            cart: updatedCart
        });
    } catch (error) {
        console.error('Erro ao remover produto do carrinho:', error.message);
        return res.status(500).json({ message: error.message });
    }
}
      
    async viewCart(req, res) {
        const { userId } = req.query;
    
        if (!userId) {
            return res.status(400).json({ message: 'userId é obrigatório.' });
        }
    
        try {
            const cart = await cartService.getCart(userId);
            return res.status(200).json({ cart });
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error.message);
            return res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = new CartController(); 