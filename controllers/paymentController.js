const { Produtos, Transaction, Cart } = require('../models');

// Função para calcular o valor total do carrinho
async function calcularValorTotalCarrinho(userId) {
    const cart = await Cart.findOne({
        where: { userId, status: 'aberto' },
        include: [
            {
                model: Produtos,  // Referência ao modelo Produtos
                as: 'produtos',   // Alias definido na associação
                through: { attributes: ['quantidade'] },  // Tabela intermediária CartProdutos
            },
        ],
    });

    if (!cart) {
        throw new Error('Carrinho não encontrado.');
    }

    let valorTotal = 0;

    // Acessa os produtos associados ao carrinho
    cart.produtos.forEach((produto) => {
        valorTotal += produto.preco * produto.CartProdutos.quantidade;  // Calcula o total com base na quantidade e preço
    });

    return valorTotal;
}


class PaymentController {
    static async processCreditCardPayment(req, res) {
        const { userId } = req.body;

        try {
            const valorTotal = await calcularValorTotalCarrinho(userId);

            const transaction = await Transaction.create({
                userId,
                valortotal: valorTotal,
                metodopayment: 'cartão de crédito',
                status: 'pendente',
            });

            // Simulação de sucesso no pagamento
            transaction.status = 'concluído';
            await transaction.save();

            res.status(200).json({ message: 'Pagamento via cartão de crédito processado com sucesso', transaction });
        } catch (error) {
            console.error('Erro ao processar pagamento via cartão de crédito:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async processPixPayment(req, res) {
        const { userId } = req.body;

        try {
            const valorTotal = await calcularValorTotalCarrinho(userId);

            const transaction = await Transaction.create({
                userId,
                valortotal: valorTotal,
                metodopayment: 'PIX',
                status: 'pendente',
            });

            // Simulação de sucesso no pagamento
            transaction.status = 'concluído';
            await transaction.save();

            res.status(200).json({ message: 'Pagamento via PIX processado com sucesso', transaction });
        } catch (error) {
            console.error('Erro ao processar pagamento via PIX:', error);
            res.status(500).json({ message: error.message });
        }
    }

    static async getTransactionStatus(req, res) {
        const { transactionId } = req.params;
    
        try {
          const transaction = await Transaction.findByPk(transactionId);
    
          if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada' });
          }
    
          res.status(200).json(transaction);
        } catch (error) {
          console.error('Erro ao buscar status da transação:', error);
          res.status(500).json({ message: error.message });
        }
    }
}

module.exports = PaymentController;
