import { useEffect, useState } from 'react'
import axios from 'axios'
import './Users.css'

function Users() {
    const [users, setUsers] = useState([])

    const [idEditando, setIdEditando] = useState(null)

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [cpf, setCpf] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const [mensagem, setMensagem] = useState('')

    const usuarioLogadoAdmin = localStorage.getItem('is_admin') === '1'

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/users')
            setUsers(response.data)
        } catch (error) {
            console.error('Erro ao buscar usuários:', error)
            setMensagem('Erro ao carregar usuários')
        }
    }

    const formatarCPF = (valor) => {
        valor = valor.replace(/\D/g, '') // remove tudo que não é número

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

        return valor
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const limparFormulario = () => {
        setIdEditando(null)
        setNome('')
        setEmail('')
        setSenha('')
        setCpf('')
        setIsAdmin(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!usuarioLogadoAdmin) {
            setMensagem('Você não tem permissão para alterar usuários')
            return
        }

        try {
            if (idEditando) {
                await axios.put(`http://localhost:3000/users/${idEditando}`, {
                    nome,
                    email,
                    senha,
                    cpf,
                    is_admin: isAdmin
                })

                setMensagem('Usuário atualizado com sucesso')
            } else {
                await axios.post('http://localhost:3000/users', {
                    nome,
                    email,
                    senha,
                    cpf,
                    is_admin: isAdmin
                })

                setMensagem('Usuário cadastrado com sucesso')
            }

            limparFormulario()
            fetchUsers()
        } catch (error) {
            console.error('Erro ao salvar usuário:', error)
            setMensagem('Erro ao salvar usuário')
        }
    }

    const handleDelete = async (id) => {
        if (!usuarioLogadoAdmin) {
            setMensagem('Você não tem permissão para remover usuários')
            return
        }

        try {
            await axios.delete(`http://localhost:3000/users/${id}`)
            setMensagem('Usuário removido com sucesso')
            fetchUsers()
        } catch (error) {
            console.error('Erro ao remover usuário:', error)
            setMensagem('Erro ao remover usuário')
        }
    }

    const handleEdit = (user) => {
        if (!usuarioLogadoAdmin) {
            setMensagem('Você não tem permissão para editar usuários')
            return
        }

        setIdEditando(user.id)
        setNome(user.nome)
        setEmail(user.email)
        setSenha(user.senha)
        setCpf(user.cpf)
        setIsAdmin(!!user.is_admin)
    }

    return (
        <div className="users-container">
            <h1>Gerenciamento de Usuários</h1>

            <p className="descricao-pagina">
                Visualize usuários e gerencie permissões de acesso ao sistema.
            </p>

            {!usuarioLogadoAdmin && (
                <p className="mensagem">
                    Você pode visualizar os usuários, mas apenas administradores podem cadastrar, editar ou remover.
                </p>
            )}

            {usuarioLogadoAdmin && (
                <form className="user-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(formatarCPF(e.target.value))}
                        maxLength={14}
                        required
                    />

                    <label className="admin-checkbox">
                        <input
                            type="checkbox"
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        />
                        Usuário administrador
                    </label>

                    <button type="submit">
                        {idEditando ? 'Atualizar Usuário' : 'Cadastrar Usuário'}
                    </button>

                    {idEditando && (
                        <button type="button" onClick={limparFormulario}>
                            Cancelar edição
                        </button>
                    )}
                </form>
            )}

            {mensagem && <p className="mensagem">{mensagem}</p>}

            <div className="user-list">
                {users.map((user) => (
                    <div className="user-card" key={user.id}>
                        <h3>{user.nome}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>CPF:</strong> {user.cpf}</p>
                        <p>
                            <strong>Administrador:</strong> {user.is_admin ? 'Sim' : 'Não'}
                        </p>

                        {usuarioLogadoAdmin && (
                            <>
                                <button onClick={() => handleEdit(user)}>
                                    Editar
                                </button>

                                <button onClick={() => handleDelete(user.id)}>
                                    Remover
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Users