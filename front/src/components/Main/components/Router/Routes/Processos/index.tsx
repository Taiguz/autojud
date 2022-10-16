import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { AiOutlineFileAdd } from 'react-icons/ai'
import { useNavigate } from 'react-router'
import { v4 } from 'uuid'
import { MainContext, useError, useNotification } from '../../../..'
import api from '../../../../../../api'
import ButtonIcon from '../../../ButtonIcon'
import Loader from '../../../Loader'
import { IProcesso } from '../Processo/types'
import ModalAdicionarProcesso from './ModalAdicionarProcesso'
import Processo from './Processo'
import { Ul } from './style'


const Processos: React.FC = () => {

    const [processos, setProcessos] = useState<IProcesso[]>([])
    const [carregando, setCarregando] = useState(true)
    const [showModalAdicionarProcessos, setShowModalAdicionarProcessos] = useState(false)
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
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' }])
    }, [setBreadCrumb])

    const adicionarProcesso = async (processo: IProcesso) => {
        try{
            const {pro_cnj, pro_titulo} = processo
            const { data: novoProcesso } = await api.post<IProcesso>('/processo', { pro_cnj, pro_titulo})
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
            { processos.length > 0 ?
                <Ul>{processos.map(processo => <Processo key={v4()} processo={processo}/>)}</Ul> :
                <>Nenhum processo cadastrado :(</>
            }
        </Container>
    )

}

export default Processos