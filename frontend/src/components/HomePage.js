import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Arquivo CSS externo para estilos

function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Bem-vindo ao Meu E-commerce!</h1>
      <nav className="nav-links">
        <Link to="/registro" className="btn">
          Criar Conta
        </Link>
        <Link to="/login" className="btn">
          Fazer Login
        </Link>
        <Link to="/users" className="btn">
          Usuários
        </Link>
        <Link to="/produtos" className="btn">
          Produtos
        </Link>
        <Link to="/carrinho" className="btn">
          Carrinho
        </Link>
        <Link to="/payment" className="btn">
          Pagamento
        </Link>
      </nav>
    </div>
  );
}

export default HomePage;
