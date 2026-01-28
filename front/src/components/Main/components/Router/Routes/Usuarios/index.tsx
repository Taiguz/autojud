import { AxiosError } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { v4 } from 'uuid'
import { MainContext, useError, useMessage, useNotification } from '../../../..'
import api from '../../../../../../api'
import { gerarSenha } from '../../../../../../utils'
import ButtonIcon from '../../../ButtonIcon'
import Loader from '../../../Loader'
import { IUsuario } from '../Usuario/types'
import ModalAdicionarUsuario from './ModalAdicionarUsuario'
import { Ul } from './style'
import Usuario from './Usuario'


const Usuarios: React.FC = () => {

    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [carregando, setCarregando] = useState(true)
    const [showModalAdicionarUsuarios, setShowModalAdicionarUsuarios] = useState(false)
    const showError = useError()
    const showMessage = useMessage()
    const { setBreadCrumb } = useContext(MainContext)
    const addNotification = useNotification()
    const navigate = useNavigate()
    const { setLogado, usuario } = useContext(MainContext)

    useEffect(() => {
        const fetchUsuario = async () => {
            try{
                const { data: usuarioData } = await api.get<IUsuario[]>(`/usuario`)
                setUsuarios(usuarioData)
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar os usuários.', error as Error)
            }
        }
        fetchUsuario()
    },[showError])


    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Usuarios', path: '/usuarios' }])
    }, [setBreadCrumb])

    const adicionarUsuario = async (usuario: IUsuario) => {
        const { usu_nome, usu_email, usu_tag, usu_oab, usu_administrador } = usuario
            const senha = gerarSenha()
        const { data: novoUsuario } = await api.post<IUsuario>('/usuario', { usu_nome: 'usuario', usu_email, usu_tag, usu_oab, usu_senha: senha, usu_administrador })
        navigate(`/usuarios/${novoUsuario.usu_tag}`)
        addNotification(`Usuário "${novoUsuario.usu_tag}" adicionado.`)
        showMessage(`Um email foi enviado para ${usu_email}.\nO usuário deve entrar no link enviado para seu e-mail e alterar sua senha para poder realizar login no sistema.\nA senha atual da conta é: ${senha}`)
    }


    if(!usuario.usu_administrador)
        return <>Não há nada aqui :(</>

    if(carregando)
        return <Loader/>

    return (
        <Container style={{ width: '100%'}}>
            {showModalAdicionarUsuarios && 
                <ModalAdicionarUsuario 
                    show={showModalAdicionarUsuarios}
                    setShow={setShowModalAdicionarUsuarios}
                    adicionar={adicionarUsuario}
                />
            }
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Usuários</h1>
                <div>
                    <ButtonIcon title="Adicionar novo Usuário." onClick={() => setShowModalAdicionarUsuarios(true)}>
                        <AiOutlineFileAdd style={{ fontSize: '2rem'}}/>
                    </ButtonIcon>
                </div>
            </div>
            <hr/>
            { usuarios.length > 0 ?
                <Ul>{usuarios.map(usuario => <Usuario key={v4()} usuario={usuario}/>)}</Ul> :
                <>Nenhum usuário cadastrado :(</>
            }
        </Container>
    )

}

export default Usuarios