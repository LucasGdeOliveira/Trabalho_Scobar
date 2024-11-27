import React, { useEffect, useState } from 'react';
import api from '../api'; // Certifique-se de que sua configuração do axios está correta
import './UsersPage.css'; // Estilos externos para melhorar o design

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/allusers');
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setMessage('Erro: Resposta inesperada do servidor.');
        }
      } catch (error) {
        setMessage('Erro ao buscar usuários. Tente novamente mais tarde.');
      }
    };

    fetchUsers();
  }, []);

  const fetchUserById = async () => {
    if (!userId) {
      setMessage('Por favor, insira um ID de usuário.');
      return;
    }

    try {
      const { data } = await api.get(`/users/getUserById/${userId}`);
      setSearchedUser(data);
      setMessage('');
    } catch (error) {
      setMessage('Erro ao buscar o usuário. Verifique o ID e tente novamente.');
    }
  };

  return (
    <div className="users-container">
      <div className="users-box">
        <h1 className="users-title">Gerenciamento de Usuários</h1>

        {/* Campo de busca por ID */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Digite o ID do usuário"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="search-input"
          />
          <button onClick={fetchUserById} className="search-button">
            Pesquisar
          </button>
        </div>

        {/* Mensagem de erro/sucesso */}
        {message && <p className="message">{message}</p>}

        {/* Exibindo o usuário pesquisado */}
        {searchedUser && (
          <div className="searched-user">
            <h2>Usuário Encontrado:</h2>
            <p><strong>ID:</strong> {searchedUser.id}</p>
            <p><strong>Nome:</strong> {searchedUser.name}</p>
            <p><strong>Email:</strong> {searchedUser.email}</p>
            <p><strong>Senha:</strong> {searchedUser.password}</p>
          </div>
        )}

        {/* Lista de todos os usuários */}
        <h2>Todos os Usuários:</h2>
        <ul className="users-list">
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <li key={user.id} className="user-item">
                <strong>ID:</strong> {user.id}, <strong>Nome:</strong> {user.name}, <strong>Email:</strong> {user.email}
              </li>
            ))
          ) : (
            <p className="loading">Carregando usuários...</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default UsersPage;
