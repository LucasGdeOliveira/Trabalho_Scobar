import React, { useState } from 'react';
import api from '../api'; // Certifique-se de que sua configuração do axios está correta
import './RegisterPage.css'; // Estilos externos para melhorar o design

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/novouser', {
        name,
        email,
        password,
      });

      setMessage(`Usuário criado! ID: ${response.data.id}`);
    } catch (error) {
      setMessage('Erro ao registrar usuário.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Registrar Usuário</h1>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="Nome de usuário"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="register-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="register-input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
            required
          />
          <button type="submit" className="register-button">
            Registrar
          </button>
        </form>
        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
