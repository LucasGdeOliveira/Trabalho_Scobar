const { Cart, Produtos, CartProdutos } = require('../models');

class CartService {

      // Função para criar o carrinho se não existir
      async createCartIfNotExists(userId) {
        // Verifica se o carrinho já existe para o usuário com status 'aberto'
        let cart = await Cart.findOne({ where: { userId, status: 'aberto' } });
        
        // Se o carrinho não existir, cria um novo carrinho
        if (!cart) {
            cart = await Cart.create({ userId, status: 'aberto' });
        }

        return cart;
    }
    // Adiciona ou atualiza um produto no carrinho
    async addProductToCart(cartId, productId, quantidade, userId) {
        // Verifica se o carrinho já existe para o usuário com status 'aberto'
        let cart = await Cart.findOne({ where: { id: cartId, status: 'aberto' } });

        // Se o carrinho não existir, cria um novo carrinho
        if (!cart) {
            cart = await Cart.create({ userId, status: 'aberto' });
        }

        // Verifica se o produto existe no banco
        const produto = await Produtos.findByPk(productId);
        if (!produto) throw new Error('Produto não encontrado.');

        // Verifica se há estoque suficiente
        if (produto.estoque < quantidade) throw new Error('Estoque insuficiente.');

        // Atualiza o estoque do produto
        produto.estoque -= quantidade;
        await produto.save();

        // Verifica se o produto já existe no carrinho através da tabela intermediária CartProdutos
        let cartProduto = await CartProdutos.findOne({
            where: { cartId: cart.id, produtoId: productId }
        });

        if (cartProduto) {
            // Se o produto já existir no carrinho, atualiza a quantidade e o total
            cartProduto.nome = produto.nome;
            cartProduto.quantidade += quantidade;
            cartProduto.totalPrice = cartProduto.quantidade * parseFloat(produto.preco); // Recalcula o total
            await cartProduto.save(); // Salva as alterações
        } else {
            // Se o produto não existir no carrinho, cria uma nova entrada na tabela intermediária
            await CartProdutos.create({
                cartId: cart.id,
                produtoId: productId,
                nome: produto.nome,
                quantidade: quantidade,
                totalPrice: parseFloat(produto.preco) * quantidade // Calcula o totalPrice
            });
        }

        // Retorna o carrinho atualizado
        return cart;
    }

   // Remove um produto do carrinho
async removeProductFromCart(userId, productId) {
    // Verifica se o carrinho existe para o usuário
    const cart = await Cart.findOne({ where: { userId, status: 'aberto' } });
    if (!cart) throw new Error('Carrinho não encontrado.');

    // Verifica se o produto existe no carrinho
    const cartProduto = await CartProdutos.findOne({
        where: { cartId: cart.id, produtoId: productId }
    });

    if (!cartProduto) throw new Error('Produto não encontrado no carrinho.');

    // Recupera o produto
    const produto = await Produtos.findByPk(productId);

    if (produto) {
        // Reabastece o estoque do produto
        produto.estoque += cartProduto.quantidade;
        await produto.save();
    }

    // Remove o produto do carrinho
    await cartProduto.destroy();

    // Retorna o carrinho atualizado
    return cart;
}

// Recupera o carrinho do usuário com seus itens
async getCart(userId) {
    // Chama a função createCartIfNotExists para garantir que o carrinho exista
    let cart = await this.createCartIfNotExists(userId);

    // Buscar os produtos relacionados ao carrinho
    const cartItems = await CartProdutos.findAll({
        where: { cartId: cart.id },
    });

    return {
        id: cart.id,
        userId: cart.userId,
        status: cart.status,
        items: cartItems.map((item) => ({
            id: item.id,
            cartId: item.cartId,
            produtoId: item.produtoId,
            nome: item.nome,
            quantidade: item.quantidade,
            totalPrice: item.totalPrice,
        })),
    };
}


}

module.exports = CartService;
