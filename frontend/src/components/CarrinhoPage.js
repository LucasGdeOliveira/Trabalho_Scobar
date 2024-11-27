import React, { useState } from 'react';
import axios from 'axios';
import './CarrinhoPage.css'; // Arquivo CSS externo para estilos

const CarrinhoPage = () => {
  const [carrinho, setCarrinho] = useState(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [productId, setProductId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCarrinho = async () => {
    if (!userId) {
      setMessage('Informe o ID do usuário para visualizar o carrinho.');
      return;
    }

    setLoading(true);
    try {
      const responseCarrinho = await axios.get(`/carrinho?userId=${userId}`);
      setCarrinho(responseCarrinho.data.cart);

      const responseUser = await axios.get(`/users/getuserbyid/${userId}`);
      setUserName(responseUser.data.name);

      setMessage('');
    } catch (error) {
      console.error('Erro ao carregar o carrinho:', error);
      setMessage('Erro ao carregar o carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const addProdutoToCarrinho = async () => {
    if (!carrinho || !productId || !quantidade) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const quantidadeInt = parseInt(quantidade, 10);
    if (isNaN(quantidadeInt) || quantidadeInt <= 0) {
      setMessage('Quantidade inválida.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/carrinho/add', {
        userId,
        productId,
        quantidade: quantidadeInt,
      });
      setCarrinho(response.data.cart);
      setMessage('Produto adicionado ao carrinho com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      setMessage('Erro ao adicionar produto ao carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const removeProdutoFromCarrinho = async (produtoId) => {
    if (!userId || !produtoId) {
      setMessage('Erro: informações faltando.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(`/carrinho/remove/${produtoId}`, {
        data: { userId },
      });
      setCarrinho(response.data.cart);
      setMessage('Produto removido do carrinho com sucesso!');
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
      setMessage('Erro ao remover produto do carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductId('');
    setQuantidade('');
  };

  return (
    <div className="carrinho-container">
      <h1 className="titulo">Carrinho</h1>
      {message && <p className="mensagem">{message}</p>}

      <div className="form-section">
        <label>Usuário (ID):</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchCarrinho} disabled={loading} className="btn">
          {loading ? 'Carregando...' : 'Visualizar Carrinho'}
        </button>
      </div>

      {userName && <h2>Bem-vindo, {userName}!</h2>}

      <div className="produto-form">
        <h2>Adicionar Produto</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProdutoToCarrinho();
          }}
        >
          <div>
            <label>ID do Produto:</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          <div>
            <label>Quantidade:</label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
      </div>

      <div className="carrinho-itens">
        <h2>Itens no Carrinho</h2>
        {loading ? (
          <p>Carregando carrinho...</p>
        ) : carrinho && carrinho.items && carrinho.items.length > 0 ? (
          <ul>
            {carrinho.items.map((item) => (
              <li key={item.produtoId} className="item">
                <span>
                  <strong>{item.nome}</strong> - {item.quantidade} unidades - Total: R${' '}
                  {parseFloat(item.totalPrice).toFixed(2)}
                </span>
                <button
                  onClick={() => removeProdutoFromCarrinho(item.produtoId)}
                  className="btn-remove"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Carrinho vazio.</p>
        )}
      </div>
    </div>
  );
};

export default CarrinhoPage;
