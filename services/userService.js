const bcryptjs = require('bcryptjs'); // Altere para bcryptjs
const { User, Cart } = require('../models'); // Certifique-se de que os modelos estão corretamente importados

class UserService {
    constructor() {
        this.User = User;
        this.Cart = Cart;
    }

    async getCartByUserId(userId) {
        try {
            const cart = await this.Cart.findOne({ where: { userId, status: 'aberto' } });
            return cart;
        } catch (error) {
            console.error("Erro ao buscar carrinho do usuário:", error);
            throw error;
        }
    }

    async createCartForUser(userId) {
        try {
            // Cria um carrinho para o usuário com status 'aberto' e items como um array vazio
            const cart = await this.Cart.create({ 
                userId, 
                status: 'aberto', 
                items: [] // Inicializa como um array vazio ou um objeto JSON
            });
            return cart;
        } catch (error) {
            console.error("Erro ao criar carrinho para usuário:", error);
            throw error;
        }
    }

    async create(email, name, password) {
        try {
            // Verifica se o email já está em uso
            const existingUser = await this.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Este email já está em uso.');
            }
    
            // Validação do nome
            if (!name || name.trim().length === 0) {
                throw new Error('O nome é obrigatório e não pode estar vazio.');
            }
    
            // Validação da senha
            if (!password || password.trim().length === 0) {
                throw new Error('A senha é obrigatória e não pode estar vazia.');
            }
    
            // Cria o novo usuário no banco de dados sem criptografia
            const newUser = await this.User.create({
                email,
                name,
                password, // Salva a senha diretamente
            });
    
            // Remove a senha do objeto de retorno
         //   newUser.password = undefined;
    
            return newUser;
    
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            throw error; // Lança o erro para ser tratado pela camada de controller
        }
    }
    

    async getAllUsers() {
        try {
            const users = await this.User.findAll({
                attributes: ['id', 'name', 'email'], // Somente os campos id e email
            });
            return users;
        } catch (error) {
            console.error('Erro no serviço getAllUsers:', error);
            throw error; // Lança o erro para ser tratado pela rota
        }
    }

    // Método para pegar o usuário pelo ID
    async getUserById(id) {
        return await this.User.findOne({ where: { id } });
    }

    async login(email) {
        try {
            // Busca o usuário no banco de dados pelo email
            const user = await this.User.findOne({ where: { email } });
    
            if (user) {
                // Remove a senha para não retornar no response
                user.dataValues.password = ''; 
    
                // Busca ou cria o carrinho do usuário
                let cart = await this.getCartByUserId(user.id);
                if (!cart) {
                    cart = await this.createCartForUser(user.id);
                }
    
                return { user, cart };
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            console.error("Erro ao tentar realizar login:", error);
            throw error; // Lança o erro para ser tratado pelo controller
        }
    }
    
}

module.exports = UserService;
