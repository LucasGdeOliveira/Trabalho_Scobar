import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';  
import LoginPage from './components/LoginPage'; 
import RegisterPage from './components/RegisterPage'; 
import UsersPage from './components/UsersPage'; 
import ProdutosPage from './components/ProdutosPage';
import CarrinhoPage from './components/CarrinhoPage';
import PaymentPage from './components/PaymentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/carrinho" element={<CarrinhoPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
