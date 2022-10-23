import React, { useContext, useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import { MainContext, useError, useNotification, useQuery } from '../../../..'
import api from '../../../../../../api'
import ButtonIcon from '../../../ButtonIcon'
import Loader from '../../../Loader'
import { IProcesso, ProcessoSituacao } from '../Processo/types'
import ModalAdicionarProcesso from './ModalAdicionarProcesso'
import Processo from './Processo'
import { Ul } from './style'
import { getSituacao, getSituacaoFromString } from './utils'


const Processos: React.FC = () => {

    const [processos, setProcessos] = useState<IProcesso[]>([])
    const [processosFiltrados, setProcessosFiltrados] = useState<IProcesso[]>([])
    const [carregando, setCarregando] = useState(true)
    const [showModalAdicionarProcessos, setShowModalAdicionarProcessos] = useState(false)
    const query = useQuery()
    const [situacao, setSituacao] = useState(getSituacaoFromString(query.get("situacao")))
    const showError = useError()
    const { setBreadCrumb } = useContext(MainContext)
    const addNotification = useNotification()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProcesso = async () => {
            try{
                const { data: processoData } = await api.get<IProcesso[]>(`/processo`)
                setProcessos(processoData)
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar os processos.', error as Error)
            }
        }
        fetchProcesso()
    },[showError])

    useEffect(() => {
        setProcessosFiltrados(processos.filter(({ pro_situacao }) => pro_situacao === situacao))
    }, [processos, situacao])


    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' }])
    }, [setBreadCrumb])

    const adicionarProcesso = async (processo: IProcesso, usu_tag: string) => {
        try{
            const {pro_cnj, pro_titulo} = processo
            const responsaveis = usu_tag.split(',').map(tag => tag.trim())
            const { data: novoProcesso } = await api.post<IProcesso>('/processo', { pro_cnj, pro_titulo})
            await api.post(`/processo/${novoProcesso.pro_id}/responsavel`, { usu_tag: responsaveis })
            navigate(`/processos/${novoProcesso.pro_cnj}`)
            addNotification(`Processo "${novoProcesso.pro_titulo}" adicionado.`)
        }
        catch(erro: any){
            showError('Houve um erro ao adicionar o processo.', erro as Error)
        }
    }
    
    if(carregando)
        return <Loader/>

    return (
        <Container style={{ width: '100%'}}>
            {showModalAdicionarProcessos && 
                <ModalAdicionarProcesso 
                    show={showModalAdicionarProcessos}
                    setShow={setShowModalAdicionarProcessos}
                    adicionar={adicionarProcesso}
                />
            }
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Processos</h1>
                <div>
                    <ButtonIcon title="Adicionar novo processo." onClick={() => setShowModalAdicionarProcessos(true)}>
                        <AiOutlineFileAdd style={{ fontSize: '2rem'}}/>
                    </ButtonIcon>
                </div>
            </div>
            <hr/>
            <div className="d-flex mb-3 flex-row justify-content-end">
                <Dropdown align="end">
                    <Dropdown.Toggle variant="secondary">
                        Situação: {getSituacao(situacao)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item 
                            as={Link}
                            to="/processos?situacao=ativos"
                            onClick={() => setSituacao(ProcessoSituacao.Ativo)}>Ativos</Dropdown.Item>
                        <Dropdown.Item 
                            as={Link}
                            to="/processos?situacao=arquivados"
                            onClick={() => setSituacao(ProcessoSituacao.Arquivado)}>Arquivados</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            { processosFiltrados.length > 0 ?
                <Ul>{processosFiltrados
                        .map(processo => <Processo key={v4()} processo={processo}/>)}</Ul> :
                <>Nenhum processo {situacao === ProcessoSituacao.Ativo ? 'ativo' : 'arquivado'} cadastrado :(</>
            }
        </Container>
    )

}

export default Processos