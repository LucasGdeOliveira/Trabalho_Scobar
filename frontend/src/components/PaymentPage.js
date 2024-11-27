import React, { useState } from 'react';
import axios from 'axios';
import './PaymentPage.css'; // Importa o CSS externo

const PaymentPage = () => {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null);

  const fetchCart = async () => {
    if (!userId) {
      setMessage('Informe o ID do usuário para visualizar o carrinho.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/carrinho?userId=${userId}`);
      setCart(response.data.cart);
      setMessage('');
    } catch (error) {
      console.error('Erro ao carregar o carrinho:', error);
      setMessage('Erro ao carregar o carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method) => {
    if (!userId || !cart || cart.items.length === 0) {
      setMessage('Carrinho vazio ou usuário não identificado.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = method === 'credit-card' ? '/payment/credit-card' : '/payment/pix';
      const response = await axios.post(endpoint, { userId });
      setMessage(response.data.message);
      setCart(null);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setMessage('Erro ao processar pagamento.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStatus = async () => {
    if (!transactionId) {
      setMessage('Informe o ID da transação para verificar o status.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/payment/status/${transactionId}`);
      setTransactionStatus(response.data);
      setMessage('');
    } catch (error) {
      console.error('Erro ao buscar status da transação:', error);
      setMessage('Erro ao buscar status da transação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Pagamento</h1>

      <div className="input-group">
        <label>ID do Usuário:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Digite o ID do usuário"
          className="payment-input"
        />
        <button onClick={fetchCart} disabled={loading} className="payment-button">
          Carregar Carrinho
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Carregando...</p>
      ) : cart && cart.items && cart.items.length > 0 ? (
        <div className="cart-summary">
          <h2>Resumo do Carrinho</h2>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <li key={item.produtoId}>
                <span>
                  <strong>{item.nome}</strong> - {item.quantidade} unidades - Total: R$
                  {parseFloat(item.totalPrice).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="total-price">
            Total Geral: R$
            {cart.items.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2)}
          </p>
        </div>
      ) : (
        <p className="empty-cart">Carrinho vazio ou não encontrado.</p>
      )}

      <div className="payment-options">
        <button onClick={() => handlePayment('credit-card')} disabled={loading} className="payment-button">
          Pagar com Cartão de Crédito
        </button>
        <button onClick={() => handlePayment('pix')} disabled={loading} className="payment-button">
          Pagar com PIX
        </button>
      </div>

      <div className="transaction-status">
        <h2>Status da Transação</h2>
        <label>ID da Transação:</label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Digite o ID da transação"
          className="payment-input"
        />
        <button onClick={fetchTransactionStatus} disabled={loading} className="payment-button">
          Verificar Status
        </button>
      </div>

      {transactionStatus && (
        <div className="transaction-details">
          <h3>Status da Transação:</h3>
          <p>ID: {transactionStatus.id}</p>
          <p>Status: {transactionStatus.status}</p>
          <p>Valor Total: R$ {parseFloat(transactionStatus.valortotal).toFixed(2)}</p>
          <p>Método de Pagamento: {transactionStatus.metodopayment}</p>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PaymentPage;
