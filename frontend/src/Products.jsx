import { useEffect, useState } from 'react'
import axios from 'axios'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])

  const [idEditando, setIdEditando] = useState(null)

  const [nome, setNome] = useState('')
  const [precoAtual, setPrecoAtual] = useState('')
  const [precoPromocional, setPrecoPromocional] = useState('')
  const [tipo, setTipo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [validade, setValidade] = useState('')
  const [emPromocao, setEmPromocao] = useState(false)

  const [mensagem, setMensagem] = useState('')

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:3000/products')
    setProducts(response.data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const limparFormulario = () => {
    setIdEditando(null)
    setNome('')
    setPrecoAtual('')
    setPrecoPromocional('')
    setTipo('')
    setDescricao('')
    setValidade('')
    setEmPromocao(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (idEditando) {
        // UPDATE
        await axios.put(`http://localhost:3000/products/${idEditando}`, {
          nome,
          preco_atual: parseFloat(precoAtual),
          preco_promocional: precoPromocional ? parseFloat(precoPromocional) : null,
          tipo,
          descricao,
          validade,
          em_promocao: emPromocao
        })

        setMensagem('Produto atualizado com sucesso')
      } else {
        // CREATE
        await axios.post('http://localhost:3000/products', {
          nome,
          preco_atual: parseFloat(precoAtual),
          preco_promocional: precoPromocional ? parseFloat(precoPromocional) : null,
          tipo,
          descricao,
          validade,
          em_promocao: emPromocao
        })

        setMensagem('Produto cadastrado com sucesso')
      }

      limparFormulario()
      fetchProducts()

    } catch (error) {
      console.error(error)
      setMensagem('Erro ao salvar produto')
    }
  }

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/products/${id}`)
    setMensagem('Produto removido')
    fetchProducts()
  }

  const handleEdit = (product) => {
    setIdEditando(product.id)
    setNome(product.nome)
    setPrecoAtual(product.preco_atual)
    setPrecoPromocional(product.preco_promocional || '')
    setTipo(product.tipo)
    setDescricao(product.descricao)
    setValidade(product.validade?.split('T')[0])
    setEmPromocao(product.em_promocao)
  }

  return (
    <div className="products-container">
      <h1>Gerenciamento de Produtos</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço atual"
          value={precoAtual}
          onChange={(e) => setPrecoAtual(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço promocional"
          value={precoPromocional}
          onChange={(e) => setPrecoPromocional(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <input
          type="date"
          value={validade}
          onChange={(e) => setValidade(e.target.value)}
          required
        />

        <label>
          <input
            type="checkbox"
            checked={emPromocao}
            onChange={(e) => setEmPromocao(e.target.checked)}
          />
          Em promoção
        </label>

        <button type="submit">
          {idEditando ? 'Atualizar Produto' : 'Cadastrar Produto'}
        </button>

        {idEditando && (
          <button type="button" onClick={limparFormulario}>
            Cancelar edição
          </button>
        )}
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <div className="product-list">
  {products.map((product) => (
    <div className="product-card" key={product.id}>
      <h3>{product.nome}</h3>

      <p><strong>Tipo:</strong> {product.tipo}</p>

      {/* 💸 Lógica de preço inteligente */}
      <p>
        <strong>Preço:</strong>{' '}
        {product.em_promocao && product.preco_promocional ? (
          <>
            <span style={{ textDecoration: 'line-through', color: '#888' }}>
              R$ {product.preco_atual}
            </span>{' '}
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              R$ {product.preco_promocional}
            </span>
          </>
        ) : (
          `R$ ${product.preco_atual}`
        )}
      </p>

      <p><strong>Descrição:</strong> {product.descricao}</p>

      <p>
        <strong>Validade:</strong>{' '}
        {product.validade?.split('T')[0]}
      </p>

      <p>
        <strong>Promoção ativa:</strong>{' '}
        {product.em_promocao ? 'Sim' : 'Não'}
      </p>

      <button onClick={() => handleEdit(product)}>
        Editar
      </button>

      <button onClick={() => handleDelete(product.id)}>
        Remover
      </button>
    </div>
  ))}
</div>
    </div>
  )
}

export default Products