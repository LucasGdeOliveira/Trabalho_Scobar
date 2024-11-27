// auth.js - Autenticação com JWT
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Certifique-se de ter dotenv instalado e configurado

const plainPassword = '123';  // Senha simples para testar
const hashedPassword = '$2b$10$TUSqUK/MN0O3Esn4aQKKTuurXZQO1.GI8HqTLny86byivnHRrtBOq'; // Senha armazenada no banco

const bcrypt = require('bcryptjs');  // Altere para bcryptjs

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
    if (err) {
        console.error("Erro na comparação:", err);
        throw err;
    }
    console.log("Senha comparada, resultado:", result); // Esperado: true
});


function generateToken(user) {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, secret, { expiresIn: '1h' });  // O token vai expirar após 1 hora
}
// Método para verificar a validade do token JWT
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    // Verifica se o cabeçalho de autorização está presente
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não informado' });
    }

    const token = authHeader.split(' ')[1]; // Ignora a palavra 'Bearer'
    
    // Verifica a validade do token
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido', error: err.message });
        }
        req.userId = decoded.id; // Armazena o ID do usuário decodificado
        next();
    });
}

// Middleware para verificar se o usuário está autenticado
const checkAuthentication = (req, res, next) => {
    verifyToken(req, res, next); // Usa o método verifyToken para verificar o token
};

module.exports = { generateToken, verifyToken, checkAuthentication };
