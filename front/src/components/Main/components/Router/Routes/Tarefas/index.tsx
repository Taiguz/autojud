import React, { useContext, useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { AiOutlineForm, AiOutlinePlusCircle } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router'
import { v4 } from 'uuid'
import { MainContext, useError, useNotification } from '../../../..'
import api from '../../../../../../api'
import ButtonIcon from '../../../ButtonIcon'
import Loader from '../../../Loader'
import ModalAdicionarTarefa from '../../../Modais/ModalAdicionarTarefa'
import { IProcesso } from '../Processo/types'
import { Ul } from './style'
import Tarefa from './Tarefa'
import { ITarefa } from './types'
import { adicionarTarefa } from './utils'


const Tarefas: React.FC = () => {

    const { processoId } = useParams()
    const [processo, setProcesso] = useState<IProcesso>({pro_id: 0, pro_cnj: '', pro_titulo: ''})
    const [showModalAdicionarTarefa, setShowModalAdicionarTarefa] = useState(false)
    const [carregando, setCarregando] = useState(true)
    const [tarefas, setTarefas] = useState<ITarefa[]>([])
    const showError = useError()
    const { setBreadCrumb } = useContext(MainContext)
    const addNotification = useNotification()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProcesso = async () => {
            if(processoId === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: processoData } = await api.get<IProcesso>(`/processo/${processoId}`)
                const { data: tarefasData } = await api.get<ITarefa[]>(`processo/${processoData.pro_id}/tarefa`)
                setProcesso(processoData)
                setTarefas(tarefasData)
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar as tarefasa.', error as Error)
            }
        }
        fetchProcesso()
    },[processoId, showError])


    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' },
            { name: processoId || '', path: `/processos/${processoId || ''}` },
            { name: 'Tarefas', path: `/processos/${processoId || ''}/tarefas` }])
    }, [setBreadCrumb, processoId])

    const addTarefa = async (tarefa: ITarefa) => {
        try{
            const novaTarefa = await adicionarTarefa(tarefa, processo.pro_id)
            addNotification('Tarefa adicionada com sucesso.')
            navigate(`/processos/${processo.pro_id}/tarefas/${novaTarefa.tar_id}`)
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
        <Container style={{ width: '100%'}}>
            {showModalAdicionarTarefa &&
                <ModalAdicionarTarefa
                    show={showModalAdicionarTarefa}
                    setShow={setShowModalAdicionarTarefa}
                    adicionar={addTarefa}
                />
            }
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Tarefas - {processo.pro_titulo}</h1>
                <div className="d-flex flex-row">
                    <ButtonIcon title="Adicionar tarefa." style={{ marginRight: '10px'}} onClick={() => setShowModalAdicionarTarefa(true)}>
                        <AiOutlinePlusCircle style={{ fontSize: '1.5rem'}}/>
                    </ButtonIcon>
                </div>
            </div>
            <hr/>
            { tarefas.length > 0 ?
                <Ul>{tarefas.map(tarefa => <Tarefa key={v4()} tarefa={tarefa} processoId={processoId}/>)}</Ul> :
                <>Nenhuma tarefa.</>
            }
        </Container>
    )

}

export default Tarefas