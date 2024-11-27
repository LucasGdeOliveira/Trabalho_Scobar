import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [selectedProduto, setSelectedProduto] = useState(null); // Para editar um produto
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Controle de carregamento

  // Carregar todos os produtos ao carregar a página
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('/produtos');
        console.log("Produtos carregados:", response.data);  // Verifique a resposta da API
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao carregar os produtos:", error);
        setMessage('Erro ao carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

 // Função para criar um novo produto
const createProduto = async () => {
    if (!nome || !preco || !estoque) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const precoFloat = parseFloat(preco);
    const estoqueInt = parseInt(estoque, 10);

    if (isNaN(precoFloat) || precoFloat <= 0) {
      setMessage('Preço inválido.');
      return;
    }

    if (isNaN(estoqueInt) || estoqueInt < 0) {
      setMessage('Estoque inválido.');
      return;
    }

    try {
      const response = await axios.post('/produtos', {
        nome,
        descricao: descricao || '',  // Enviar uma string vazia se a descrição estiver vazia
        preco: precoFloat,
        estoque: estoqueInt,
      });
      setProdutos([...produtos, response.data]);
      setMessage('Produto criado com sucesso!');
      resetForm();
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
      setMessage('Erro ao criar o produto.');
    }
  };

// Função para atualizar um produto existente
const updateProduto = async () => {
    if (!selectedProduto) return;
    if (!nome || !preco || !estoque) {
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    const precoFloat = parseFloat(preco);
    const estoqueInt = parseInt(estoque, 10);

    if (isNaN(precoFloat) || precoFloat <= 0) {
      setMessage('Preço inválido.');
      return;
    }

    if (isNaN(estoqueInt) || estoqueInt < 0) {
      setMessage('Estoque inválido.');
      return;
    }

    try {
      const response = await axios.put(`/produtos/${selectedProduto.id}`, {
        nome,
        descricao: descricao || '',  // Enviar uma string vazia se a descrição estiver vazia
        preco: precoFloat,
        estoque: estoqueInt,
      });

      const updatedProdutos = produtos.map((produto) =>
        produto.id === selectedProduto.id ? response.data : produto
      );
      setProdutos(updatedProdutos);
      setMessage('Produto atualizado com sucesso!');
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar o produto:", error);
      setMessage('Erro ao atualizar o produto.');
    }
  };

  // Função para excluir um produto
  const deleteProduto = async (id) => {
    try {
      await axios.delete(`/produtos/${id}`);
      setProdutos(produtos.filter((produto) => produto.id !== id));
      setMessage('Produto excluído com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir o produto:", error);
      setMessage('Erro ao excluir o produto.');
    }
  };

  // Função para selecionar um produto para editar
  const selectProduto = (produto) => {
    setSelectedProduto(produto);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setSelectedProduto(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque('');
  };

  return (
    <div>
      <h1>Produtos</h1>
      {message && <p>{message}</p>}

      {/* Formulário de criação e edição de produto */}
      <h2>{selectedProduto ? 'Editar Produto' : 'Adicionar Produto'}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectedProduto ? updateProduto() : createProduto();
        }}
      >
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Preço:</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estoque:</label>
          <input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {selectedProduto ? 'Atualizar' : 'Adicionar'}
        </button>
      </form>

      {/* Lista de produtos */}
      <h2>Lista de Produtos</h2>
      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <ul>
          {produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            produtos.map((produto) => (
              <li key={produto.id}>
                <strong>{produto.nome}</strong> - {produto.preco} - Estoque: {produto.estoque}
                <br />
                {produto.descricao && <em>{produto.descricao}</em>}
                <div>
                  <button onClick={() => selectProduto(produto)}>Editar</button>
                  <button onClick={() => deleteProduto(produto.id)}>Excluir</button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ProdutosPage;
