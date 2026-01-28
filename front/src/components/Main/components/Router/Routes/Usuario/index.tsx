import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { MainContext, useError, useNotification } from '../../../..'
import Loader from '../../../Loader'
import { CustomContainer, Ul } from './style'
import { Row, Col } from 'react-bootstrap'
import { IUsuario } from '../Usuario/types'
import { ITarefa } from '../Tarefas/types'
import { v4 } from 'uuid'
import { AiOutlineFileExcel, AiOutlineForm } from "react-icons/ai";
import ButtonIcon from '../../../ButtonIcon'
import ModalEditarUsuario from './ModalEditarUsuario'
import Processo from './Processo'
import Tarefa from './Tarefa'
import { IProcesso } from '../Processo/types'
import api from '../../../../../../api'
const Usuario: React.FC = () => {

    const navigate = useNavigate()
    const { setBreadCrumb } = useContext(MainContext)
    const [showModalEditarUsuario, setShowModalEditarUsuario] = useState(false)
    const { tag } = useParams()
    const [carregando, setCarregando] = useState(true)
    const [usuario, setUsuario] = useState<IUsuario>({ usu_nome: '', usu_id: 0, usu_email: '', usu_oab: '', usu_tag: tag || '', usu_verificado: false, usu_administrador: false })
    const [processos, setProcessos] = useState<IProcesso[]>([])
    const [tarefas, setTarefas] = useState<ITarefa[]>([])
    const { setLogado, usuario: usuarioLogado } = useContext(MainContext)
    const showError = useError()
    const addNotification = useNotification()

    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Usuarios', path: '/usuarios' },
            { name: tag || '', path: `/usuarios/${tag || ''}` }])
    }, [setBreadCrumb, tag])

    useEffect(() => {
        const fetchUsuario = async () => {
            if(tag === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: usuario } = await api.get<IUsuario>(`/usuario/${tag}`)
                const { data: processos } = await api.get<IProcesso[]>(`/usuario/${usuario.usu_id}/processos`)
                const { data: tarefas } = await api.get<ITarefa[]>(`/usuario/${usuario.usu_id}/tarefas`)
                setUsuario(usuario)
                setProcessos(processos)
                setTarefas(tarefas)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar o usuário.', error as Error)
            }
            setCarregando(false)
        }
        fetchUsuario()
    },[tag, showError])

    const exlcuirUsuario = async () => {
        if(usuario.usu_id === 0) return
        const { usu_id } = usuario
        try{
            await api.delete(`/usuario/${usu_id}`)
            navigate('/usuarios')
            addNotification(`Usuário "${usuario.usu_tag}" excluído com sucesso.`)
        }
        catch(erro: any){
            showError('Erro ao excluir usuário.', erro)
        }
    }

    const editarUsuario = async (usuario: IUsuario) => {
        try{
            const { usu_id, usu_tag, usu_oab, usu_administrador } = usuario
            await api.put(`/usuario`, { usu_id, usu_tag, usu_oab, usu_administrador })
            addNotification(`Alterações salvas com sucesso.`)
            setUsuario(usuario => ({...usuario, usu_tag, usu_oab, usu_administrador}))
        }
        catch(erro: any){
            showError('Erro ao editar usuário.', erro)
        }
    }

    if(carregando)
        return <Loader/>

    if(tag === undefined)
        return <h1>Não há nada aqui</h1>
    
    return (
        <CustomContainer>
            {showModalEditarUsuario && 
                <ModalEditarUsuario
                    show={showModalEditarUsuario}
                    setShow={setShowModalEditarUsuario}
                    usuarioEditar={usuario}
                    editar={editarUsuario}
                />
            }
            <Row>
                <div className='d-flex justify-content-between align-items-center'>
                    <h1>{usuario.usu_tag}</h1>
                    <div className="d-flex flex-row">
                        {
                            usuarioLogado.usu_administrador &&
                            <>
                                <ButtonIcon title="Editar usuário." style={{ marginRight: '10px'}} onClick={() => setShowModalEditarUsuario(true)}>
                                    <AiOutlineForm style={{ fontSize: '2rem'}}/>
                                </ButtonIcon>
                                <ButtonIcon title="Excluir usuário." onClick={exlcuirUsuario}>
                                    <AiOutlineFileExcel style={{ fontSize: '2rem'}}/>
                                </ButtonIcon>
                            </>
                        }
                    </div>
                </div>
                <hr/>
                <p>Advogado {usuario.usu_administrador && 'administrador'}</p>
                <p>Email: {usuario.usu_email}</p>
                <p>OAB: {usuario.usu_oab}</p>
                {usuario.usu_verificado ? <p>Status: Verificado</p> : <p><span>Status: </span><span style={{ fontWeight: 'bold'}}>Não verificado</span></p>}
            </Row>
            <Row style={{ width: '100%'}}>
                <Col style={{ width: '50%' }}>
                    <h3>Processos</h3>
                    <hr/>
                    {processos.length > 0 ?
                        <Ul>{processos.map(processo => <Processo key={v4()} processo={processo} />)}</Ul> :
                        <>Nenhum processo sob responsabilidade.</>
                    }
                </Col>
                <Col style={{ width: '50%' }}>
                    <h3>Tarefas</h3>
                    <hr/>
                    {tarefas.length > 0 ?
                        <Ul>{tarefas.map(tarefa => <Tarefa key={v4()} tarefa={tarefa}/>)}</Ul> :
                        <>Nenhuma tarefa sob responsabilidade.</>
                    }
                </Col>
            </Row>

        </CustomContainer>
    )
}

export default Usuario