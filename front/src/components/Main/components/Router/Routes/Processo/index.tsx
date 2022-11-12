import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { MainContext, useError, useNotification } from '../../../..'
import api from '../../../../../../api'
import Loader from '../../../Loader'
import { CustomContainer, Ul } from './style'
import { IProcesso, ProcessoSituacao } from './types'
import { Row, Col, Spinner, Badge } from 'react-bootstrap'
import { IAndamento } from '../Andamentos/types'
import { IUsuario } from '../Usuario/types'
import { ITarefa } from '../Tarefas/types'
import Andamento from './components/Andamento'
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'
import Responsavel from './components/Responsavel'
import Tarefa from './components/Tarefa'
import { AiOutlineFileExcel, AiOutlineUserAdd, AiOutlineForm, AiOutlinePlusCircle } from "react-icons/ai";
import { BsFolderX, BsFolderCheck } from 'react-icons/bs'
import ButtonIcon from '../../../ButtonIcon'
import ModalEditarProcesso from './components/ModalEditarProcesso'
import ListaResponsaveis from '../../../Listas/Responsaveis'
import { adicionarTarefa } from '../Tarefas/utils'
import ModalAdicionarTarefa from '../../../Modais/ModalAdicionarTarefa'
import { getSituacao } from '../Processos/utils'
import { getBuscandoAndamentosIntervalMs } from '../../../../../../constants'
const Processo: React.FC = () => {

    const navigate = useNavigate()
    const { setBreadCrumb } = useContext(MainContext)
    const [showModalEditarProcesso, setShowModalEditarProcesso] = useState(false)
    const [showModalAdicionarTarefa, setShowModalAdicionarTarefa] = useState(false)
    const { processoId } = useParams()
    const [carregando, setCarregando] = useState(true)
    const [processo, setProcesso] = useState<IProcesso>({pro_id: 0, pro_cnj: '', pro_titulo: '', pro_situacao: 0})
    const [andamentos, setAndamentos] = useState<IAndamento[]>([])
    const [tarefas, setTarefas] = useState<ITarefa[]>([])
    const showError = useError()
    const addNotification = useNotification()

    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' },
            { name: processoId || '', path: `/processos/${processoId || ''}` }])
    }, [setBreadCrumb, processoId])

    useEffect(() => {
        const fetchProcesso = async () => {
            if(processoId === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: processoData } = await api.get<IProcesso>(`/processo/${processoId}`)
                const { data: {andamentos} } = await api.get<{ andamentos: IAndamento[]}>(`processo/${processoData.pro_id}/andamentos/0`)
                const { data: tarefaData } = await api.get<ITarefa[]>(`processo/${processoData.pro_id}/tarefa`)
                setProcesso(processoData)
                setAndamentos(andamentos)
                setTarefas(tarefaData)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar o processo.', error as Error)
            }
            setCarregando(false)
        }
        fetchProcesso()
    },[processoId, showError])

    useEffect(() => {
        if(processo.pro_id === 0 || processo.pro_buscando_andamentos === false) return
        const fetchBuscandoAndamentos = async () => {
            try{
                const { data: { buscando } } = await api.get<{ buscando: boolean }>(`processo/${processo.pro_id}/buscando-andamentos`)
                if(buscando === false) navigate(0)
            }
            catch(erro){
                showError('Erro ao buscando informações do processo.')
            }
        }
        const interval = setInterval(fetchBuscandoAndamentos, getBuscandoAndamentosIntervalMs)
        return () => clearInterval(interval);
    }, [showError, processo.pro_id, processo.pro_buscando_andamentos, navigate])

    const exlcuirProcesso = async () => {
        try{
            await api.delete(`/processo/${processo.pro_id}`)
            navigate('/processos')
            addNotification(`Processo "${processo.pro_titulo}" excluído com sucesso.`)
        }
        catch(erro: any){
            showError('Erro ao excluir processo.', erro)
        }
    }

    const atualizarSituacao = async (pro_situacao: number) => {
        try{
            const { pro_id } = processo
            await api.put(`/processo`, { pro_id, pro_situacao })
            addNotification(`Processo agora está ${getSituacao(pro_situacao).toLowerCase().slice(0,-1)}.`)
            setProcesso(processo => ({...processo, pro_situacao}))
        }
        catch(erro: any){
            showError('Erro ao editar processo.', erro)
        }
    }

    const editarProcesso = async (processo: IProcesso) => {
        try{
            const { pro_titulo, pro_id } = processo
            await api.put(`/processo`, { pro_id, pro_titulo })
            addNotification(`Alterações salvas com sucesso.`)
            setProcesso(processo => ({...processo, pro_titulo}))
        }
        catch(erro: any){
            showError('Erro ao editar processo.', erro)
        }
    }

    const addTarefa = async (tarefa: ITarefa) => {
        try{
            const novaTarefa = await adicionarTarefa(tarefa, processo.pro_id)
            addNotification('Tarefa adicionada com sucesso.')
            navigate(`/processos/${processo.pro_cnj}/tarefas/${novaTarefa.tar_id}`)
        }
        catch(erro: any){
            showError('Erro ao adicionar tarefa.', erro as Error)
        }
    }

    if(carregando)
        return <Loader/>

    if(processoId === undefined)
        return <h1>Não há nada aqui</h1>
    
    return (
        <CustomContainer>
            {showModalEditarProcesso && 
                <ModalEditarProcesso
                    show={showModalEditarProcesso}
                    setShow={setShowModalEditarProcesso}
                    processoEditar={processo}
                    editar={editarProcesso}
                />
            }
            {showModalAdicionarTarefa &&
                <ModalAdicionarTarefa
                    show={showModalAdicionarTarefa}
                    setShow={setShowModalAdicionarTarefa}
                    adicionar={addTarefa}
                />
            }
            <Row>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className="d-flex align-items-center">
                        <h1>{processo.pro_titulo}</h1>
                        { 
                            processo.pro_buscando_andamentos &&
                            <div style={{ marginLeft: '10px'}}>
                                <Badge bg="success" pill className="d-flex align-items-center">
                                    <Spinner animation="grow" variant="light" size="sm"/>
                                    <span style={{ marginLeft: '5px'}}>Buscando andamentos...</span>
                                </Badge>
                            </div>
                        }
                    </div>
                    <div className="d-flex flex-row">
                        <ButtonIcon title="Editar processo." style={{ marginRight: '10px'}} onClick={() => setShowModalEditarProcesso(true)}>
                            <AiOutlineForm style={{ fontSize: '2rem'}}/>
                        </ButtonIcon>
                        {
                            processo.pro_situacao === ProcessoSituacao.Ativo &&
                            <ButtonIcon title="Arquivar processo." style={{ marginRight: '10px'}} onClick={() => atualizarSituacao(ProcessoSituacao.Arquivado)}>
                                <BsFolderCheck style={{ fontSize: '2rem'}}/>
                            </ButtonIcon>
                        }
                        {
                            processo.pro_situacao === ProcessoSituacao.Arquivado &&
                            <ButtonIcon title="Ativar processo." style={{ marginRight: '10px'}} onClick={() => atualizarSituacao(ProcessoSituacao.Ativo)}>
                                <BsFolderX style={{ fontSize: '2rem'}}/>
                            </ButtonIcon>
                        }
                        <ButtonIcon title="Excluir processo." onClick={exlcuirProcesso}>
                            <AiOutlineFileExcel style={{ fontSize: '2rem'}}/>
                        </ButtonIcon>
                    </div>
                </div>
                <hr/>
                <p>Situação: {getSituacao(processo.pro_situacao).slice(0,-1)}</p>
                <p>CNJ: {processo.pro_cnj}</p>
            </Row>
            <Row style={{ width: '100%'}}>
                <Col style={{ width: '50%' }}>
                    <h3>Últimos Andamentos</h3>
                    <hr/>
                    {andamentos.length > 0 ?
                        <Ul>{andamentos.slice(0, 5).map(andamento => <Andamento key={v4()} andamento={andamento} processoId={processo.pro_cnj}/>)}</Ul> :
                         processo.pro_buscando_andamentos ? <Loader/> : <>Nenhum andamento.</>
                    }
                    { andamentos.length > 5 ? <Link to={`/processos/${processo.pro_cnj}/andamentos`}>Ver mais...</Link> : null}
                </Col>
                <Col style={{ width: '50%'}} >
                    <ListaResponsaveis url={`processo/${processo.pro_id}/responsavel`}/>
                </Col>
            </Row>
            <Row style={{ marginTop: '10px'}}>
                <div className='d-flex justify-content-between align-items-center'>
                    <h3>Tarefas</h3>
                    <div className="d-flex flex-row">
                        <ButtonIcon title="Adicionar tarefa." style={{ marginRight: '10px'}} onClick={() => setShowModalAdicionarTarefa(true)}>
                            <AiOutlinePlusCircle style={{ fontSize: '1.1rem'}}/>
                        </ButtonIcon>
                    </div>
                </div>
                <hr/>
                {tarefas.length > 0 ?
                    <Ul>{tarefas.slice(0,5).map(tarefa => <Tarefa key={v4()} tarefa={tarefa} processoId={processo.pro_cnj}/>)}</Ul> :
                    <>Nenhuma tarefa.</>
                }

                { tarefas.length > 5 ? <Link to={`/processos/${processo.pro_cnj}/tarefas`}>Ver mais...</Link> : null}
            </Row>
        </CustomContainer>
    )
}

export default Processo