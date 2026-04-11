import { useState } from 'react'
import axios from 'axios'
import {
  Routes,
  Route,
  useNavigate,
  Link,
  Navigate
} from 'react-router-dom'
import Products from './Products'
import Users from './Users'
import './App.css'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('logado')
    localStorage.removeItem('is_admin')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">Supermercado Admin</span>
        <Link to="/products">Produtos</Link>
        <Link to="/users">Usuários</Link>
      </div>

      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </nav>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha
      })

      setMensagem(response.data.mensagem)

      localStorage.setItem('logado', 'true')
      localStorage.setItem('is_admin', String(response.data.usuario.is_admin))

      navigate('/products')
    } catch (error) {
      if (error.response) {
        setMensagem(error.response.data.mensagem)
      } else {
        setMensagem('Erro ao conectar com o servidor')
      }
    }
  }

  return (
    <div className="container">
      <div className="login-box">
        <h3>Projeto Supermercado</h3>
        <p className="subtitle">Acesso restrito aos funcionários</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit">Entrar</button>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  )
}

function PrivateRoute({ children }) {
  const logado = localStorage.getItem('logado')

  return logado === 'true' ? children : <Navigate to="/" />
}

function LayoutProtegido({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <LayoutProtegido>
              <Products />
            </LayoutProtegido>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <LayoutProtegido>
              <Users />
            </LayoutProtegido>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App