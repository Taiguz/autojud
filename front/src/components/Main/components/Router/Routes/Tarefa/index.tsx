import { format, parseISO } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { AiOutlineForm, AiOutlineFileExcel, AiOutlineFileDone, AiOutlinePlusCircle } from 'react-icons/ai'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useMatch, useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import { MainContext, useError, useNotification } from '../../../..'
import api from '../../../../../../api'
import ButtonIcon from '../../../ButtonIcon'
import ListaResponsaveis from '../../../Listas/Responsaveis'
import Loader from '../../../Loader'
import Andamento from '../Andamento'
import { IProcesso } from '../Processo/types'
import { ITarefa } from '../Tarefas/types'
import { adicionarSubtarefa, adicionarTarefa } from '../Tarefas/utils'
import { IUsuario } from '../Usuario/types'
import ModalAdicionarSubtarefa from './ModalAdicionarSubtarefa'
import ModalEditarTarefa from './ModalEditarTarefa'
import Responsavel from './Responsavel'
import { Ul } from './style'
import Subtarefa from './Subtarefa'

const Tarefa: React.FC = () => {

    const matchTarefaRoute = useMatch('/processos/:processoId/tarefas/:tarefaId')
    const { processoId, tarefaId} = useParams()
    const [tarefa, setTarefa] = useState<ITarefa>({ tar_id: 0, tar_objetivo: '', tar_data_cadastro: '2019-02-19', tar_data_termino: '2019-02-19', tar_situacao: false, tar_pai_id: 0, pro_id: 0})
    const [tarefaPai, setTarefaPai] = useState<ITarefa>({ tar_id: 0, tar_objetivo: '', tar_data_cadastro: '2019-02-19', tar_data_termino: '2019-02-19', tar_situacao: false, tar_pai_id: 0, pro_id: 0})
    const [subtarefas, setSubtarefas] = useState<ITarefa[]>([])
    const [processo, setProcesso] =useState<IProcesso>({ pro_id: 0, pro_cnj: '', pro_titulo: ''})
    const [carregando, setCarregando] = useState(true)
    const [isSubtarefa, setIsSubtaefa] = useState(false)
    const { setBreadCrumb } = useContext(MainContext)
    const [showModalEditarTarefa, setShowModalEditarTarefa] = useState(false)
    const [showModalAdicionarSubtarefa, setShowModalAdicionarSubtarefa] = useState(false)
    const showError = useError()
    const addNotification = useNotification()
    const navigate = useNavigate()

    useEffect(() => {
        if(tarefa.tar_pai_id === null && isSubtarefa)
            return
        setBreadCrumb(breadCrumb => {
            const rotas = [
                { name: 'Home', path: '/' },
                { name: 'Processos', path: '/processos' },
                { name: processoId || '', path: `/processos/${processoId || ''}` },
                { name: 'Tarefas', path: `/processos/${processoId || ''}/tarefas` }]
            if(isSubtarefa)
                rotas.push(
                    { name: tarefa.tar_pai_id + '', path: `/processos/${processoId || ''}/tarefas/${tarefa.tar_pai_id}` },
                    { name: `Subtarefa / ${tarefaId}`, path: `/processos/${processoId || ''}/tarefas/${tarefa.tar_pai_id}/subtarefa/${tarefaId}` })
            else
                rotas.push({ name: tarefaId || '', path: `/processos/${processoId || ''}/tarefas/${tarefaId || ''}` })
            return rotas
        })
    }, [setBreadCrumb, processoId, tarefaId, isSubtarefa, tarefa.tar_pai_id])

    useEffect(() => {
        const fetchProcesso = async () => {
            if(processoId === undefined || tarefaId === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: processoData } = await api.get<IProcesso>(`/processo/${processoId}`)
                const { data: tarefaData} = await api.get<ITarefa>(`/tarefa/${tarefaId}`)
                setProcesso(processoData)
                setTarefa(tarefaData)
                if(tarefaData.tar_pai_id === null){
                    // Buscar as subtarefas
                    const { data: subtarefaData} = await api.get<ITarefa[]>(`/tarefa/${tarefaId}/subtarefas`)
                    setSubtarefas(subtarefaData)
                    setIsSubtaefa(false)
                }
                else {
                    // Tarefa é uma subtarefa
                    // Checar se não estamos na url de tarefas, e caso não, buscar a tarefa pai.
                    if(matchTarefaRoute !== null)
                        return navigate(`/processos/${processoData.pro_cnj}/tarefas/${tarefaData.tar_pai_id}/subtarefa/${tarefaId}`)
                    
                    const { data: tarefaPaiData} = await api.get<ITarefa>(`/tarefa/${tarefaData.tar_pai_id}`)
                    setTarefaPai(tarefaPaiData)
                    setIsSubtaefa(true)
                }
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar a tarefa.', error as Error)
            }
        }
        fetchProcesso()
    },[matchTarefaRoute, processoId, tarefaId, navigate, showError])

    const excluirTarefa = async () => {
        if(isSubtarefa) 
            return await excluirSubtarefa()
        try{
            await api.delete(`tarefa/${tarefa.tar_id}`)
            addNotification('Tarefa excluída com sucesso.')
            navigate(`/processos/${processo.pro_cnj}/tarefas`)
        }
        catch(error: any){
            showError('Erro ao excluir tarefa.', error as Error)
        }
    }

    const excluirSubtarefa = async () => {
        try{
            await api.delete(`tarefa/${tarefa.tar_id}`)
            addNotification('Subtarefa excluída com sucesso.')
            navigate(`/processos/${processo.pro_cnj}/tarefas/${tarefa.tar_pai_id}`)
        }
        catch(error: any){
            showError('Erro ao excluir subtarefa.', error as Error)
        }
    }

    const editarTarefa = async (tarefa: ITarefa) => {
        if (isSubtarefa)    
            return await editarSubtarefa(tarefa)
        try{
            const { tar_id, tar_data_cadastro, tar_data_termino, tar_objetivo} = tarefa
            await api.put('tarefa', { tar_id, tar_data_cadastro, tar_data_termino, tar_objetivo })
            addNotification('Tarefa alterada com sucesso.')
            setTarefa(tarefa => ({ ...tarefa, tar_data_cadastro, tar_data_termino, tar_objetivo }))
        }
        catch(error: any){
            showError('Erro ao editar tarefa.', error as Error)
        }
    }

    const editarSubtarefa = async (tarefa: ITarefa) => {
        try{
            const { tar_id, tar_data_cadastro, tar_data_termino, tar_objetivo} = tarefa
            await api.put('tarefa', { tar_id, tar_data_cadastro, tar_data_termino, tar_objetivo })
            addNotification('Subtarefa alterada com sucesso.')
            setTarefa(tarefa => ({ ...tarefa, tar_data_cadastro, tar_data_termino, tar_objetivo }))
        }
        catch(error: any){
            showError('Erro ao editar subtarefa.', error as Error)
        }
    }

    const concluirTarefa = async () => {
        if (isSubtarefa)
            return await concluirSubtarefa()
        try{
            await api.put('tarefa', { tar_id: tarefa.tar_id, tar_situacao: !tarefa.tar_situacao})

            if(!tarefa.tar_situacao) addNotification(`Tarefa concluída!`)
            else addNotification(`Tarefa marcada como não concluída.`)

            setTarefa({...tarefa, tar_situacao: !tarefa.tar_situacao })
        }
        catch(error: any){
            showError('Erro ao concluir a tarefa.', error as Error)
        }
    }

    const concluirSubtarefa = async () => {
        try{
            await api.put('tarefa', { tar_id: tarefa.tar_id, tar_situacao: !tarefa.tar_situacao})

            if(!tarefa.tar_situacao) addNotification(`Subtarefa concluída!`)
            else addNotification(`Subtarefa marcada como não concluída.`)

            setTarefa({...tarefa, tar_situacao: !tarefa.tar_situacao })
        }
        catch(error: any){
            showError('Erro ao concluir subtarefa.', error as Error)
        }
    }

    const addSubtarefa = async (subtarefa: ITarefa) => {
        try{
            const novaTarefa = await adicionarSubtarefa({...subtarefa, tar_pai_id: tarefa.tar_id })
            addNotification('Subtarefa adicionada com sucesso.')
            navigate(`/processos/${processo.pro_cnj}/tarefas/${tarefa.tar_id}/subtarefa/${novaTarefa.tar_id}`)
        }
        catch(erro: any){
            showError('Erro ao adicionar subtarefa.', erro as Error)
        }
    }


    if(carregando)
        return <Loader/>

    if(tarefaId === undefined)
        return <h1>Não há nada aqui</h1>

    if(processoId === undefined)
        return <h1>Não há nada aqui</h1>

    return (
        <Container>
            {showModalEditarTarefa && 
                <ModalEditarTarefa 
                    show={showModalEditarTarefa}
                    setShow={setShowModalEditarTarefa}
                    isSubtarefa={isSubtarefa}
                    tarefaEditar={tarefa}
                    aoConcluir={editarTarefa}
                />
            }
            {showModalAdicionarSubtarefa && 
                <ModalAdicionarSubtarefa 
                    show={showModalAdicionarSubtarefa}
                    setShow={setShowModalAdicionarSubtarefa}
                    adicionar={addSubtarefa}
                />
            }
            <Row>
                <div className='d-flex justify-content-between align-items-center'>
                    <h1>{tarefa.tar_situacao && <BsFillCheckCircleFill width={40} style={{ marginRight: '15px' }}/>} {tarefa.tar_objetivo}</h1>
                    <div className="d-flex flex-row">
                        <ButtonIcon title={`${tarefa.tar_situacao ? "Marcar como não concluída." : "Marcar como concluída."}`} style={{ marginRight: '10px'}} onClick={concluirTarefa}>
                            <AiOutlineFileDone style={{ fontSize: '2rem'}}/>
                        </ButtonIcon>
                        <ButtonIcon title="Editar tarefa." onClick={() => setShowModalEditarTarefa(true)}>
                            <AiOutlineForm style={{ fontSize: '2rem'}}/>
                        </ButtonIcon>
                        <ButtonIcon title="Excluir tarefa." onClick={excluirTarefa}>
                            <AiOutlineFileExcel style={{ fontSize: '2rem'}}/>
                        </ButtonIcon>
                    </div>
                </div>
                <hr/>
            </Row>
            <Row>
                <Col>
                    <p>Processo: {processo.pro_titulo}</p>
                    <p>CNJ: {processo.pro_cnj}</p>
                    <p>{isSubtarefa ? 'Descrição' : 'Objetivo'}: {tarefa.tar_objetivo}</p>
                    <p>data de cadastro: {format(parseISO(tarefa.tar_data_cadastro), 'dd/MM/yyyy')}</p>
                    <p style={{ fontWeight: 'bold' }}>data de vencimento: {format(parseISO(tarefa.tar_data_termino), 'dd/MM/yyyy')}</p>
                    {isSubtarefa && 
                        <p>
                            <span>Pertence a tarefa: </span>
                            <Link to={`/processos/${processo.pro_cnj}/tarefas/${tarefa.tar_pai_id}`} reloadDocument={false}>{tarefaPai.tar_objetivo}</Link>
                        </p>
                    }
                </Col>
                <Col>
                    <ListaResponsaveis style="simplified" url={`tarefa/${tarefaId}/responsavel`}/>
                </Col>
            </Row>
            <Row>
                {!isSubtarefa && 
                    <>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h3 style={{marginTop: '20px'}}>Subtarefas</h3>
                            <div className="d-flex flex-row">
                                <ButtonIcon title="Adicionar subtarefa." style={{ marginRight: '10px'}} onClick={() => setShowModalAdicionarSubtarefa(true)}>
                                    <AiOutlinePlusCircle style={{ fontSize: '1.5rem'}}/>
                                </ButtonIcon>
                            </div>
                        </div>
                        <hr/>
                        { subtarefas.length > 0 ?
                            <Ul>{subtarefas.map(sub => <Subtarefa key={v4()} tarefa={sub} processoId={processo.pro_cnj}/>)}</Ul> :
                            <>Nenhuma subtarefa.</>
                        }
                    </>
                }
            </Row>
        </Container>
    )

}

export default Tarefa