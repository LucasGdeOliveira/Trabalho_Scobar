// ./controllers/userController.js

class UserController {
    constructor(UserService) {
        this.userService = UserService;
    }

    async createUser(req, res) {
      const { email, name, password } = req.body;  // Pega os dados do corpo da requisição

      try {
          // Chama o serviço para criar o usuário
          const user = await this.userService.create(email, name, password);
          res.status(201).json({ 
              id: user.id, 
              message: 'Usuário criado com sucesso!',
              user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  password: user.password
              }
          });
      } catch (error) {
          console.error("Erro ao criar usuário:", error);
          res.status(500).json({ error: error.message });
      }
  }

    async findAllUsers(req, res) {
        try {
          const users = await this.userService.getAllUsers(); // Deve retornar um array
          res.status(200).json(users); // Resposta com os usuários
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
          res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
        }
      }          
    
      async findUserById(req, res) {
        const { id } = req.params; // Pega o ID da URL
    
        try {
          // Usando o serviço para buscar o usuário
          const user = await this.userService.getUserById(id);
    
          if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
          }
    
          res.status(200).json(user);
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
          res.status(500).json({ message: 'Erro ao buscar o usuário.', error: error.message });
        }
      }

      // Método de login na camada de controle (UserController)
      async login(req, res) {
        const { email, password } = req.body;
    
        console.log("Email recebido:", email);    // Log para verificar o email
        console.log("Senha recebida:", password); // Log para verificar a senha
    
        try {
            // Chama a função de login da camada de serviço
            const result = await this.userService.login(email, password);
            
            if (result) {
                // Login bem-sucedido, retorna o usuário e o carrinho
                res.status(200).json({ user: result.user, cart: result.cart });
            } else {
                // Falha na autenticação, retorna erro
                res.status(401).json({ error: 'Email ou senha inválidos.' });
            }
        } catch (error) {
            console.error("Erro ao logar usuário:", error);
            res.status(500).json({ error: 'Erro ao logar o usuário.' });
        }
    }
    

}

module.exports = UserController;
