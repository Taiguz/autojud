import { format, parseISO } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import { MainContext, useError } from '../../../..'
import api from '../../../../../../api'
import Loader from '../../../Loader'
import { IAndamento } from '../Andamentos/types'
import { IProcesso } from '../Processo/types'

const Andamento: React.FC = () => {

    const { processoId, andamentoId } = useParams()
    const [andamento, setAndamento] = useState<IAndamento>({ and_data: '2010-10-10', and_descricao: '', and_id: 0})
    const [processo, setProcesso] =useState<IProcesso>({ pro_id: 0, pro_cnj: '', pro_titulo: ''})
    const [carregando, setCarregando] = useState(true)
    const { setBreadCrumb } = useContext(MainContext)
    const showError = useError()

    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' },
            { name: processoId || '', path: `/processos/${processoId || ''}` },
            { name: 'Andamentos', path: `/processos/${processoId || ''}/andamentos` },
            { name: andamentoId || '', path: `/processos/${processoId || ''}/andamentos/${andamentoId || ''}` }])
    }, [setBreadCrumb, processoId, andamentoId])

    useEffect(() => {
        const fetchProcesso = async () => {
            if(processoId === undefined || andamentoId === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: processoData } = await api.get<IProcesso>(`/processo/${processoId}`)
                const { data: andamentoData} = await api.get<IAndamento>(`/andamento/${andamentoId}`)
                setProcesso(processoData)
                setAndamento(andamentoData)
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar o processo.', error as Error)
            }
        }
        fetchProcesso()
    },[processoId, andamentoId])


    if(carregando)
        return <Loader/>

    if(andamentoId === undefined)
        return <h1>Não há nada aqui</h1>

    if(processoId === undefined)
        return <h1>Não há nada aqui</h1>

    return (
        <Container>
            <h1>Andamento - {format(parseISO(andamento.and_data), 'dd/MM/yyyy')}</h1>
            <hr/>
            <p>Processo: {processo.pro_titulo}</p>
            <p>CNJ: {processo.pro_cnj}</p>
            <hr/>
            <p>{andamento.and_descricao}</p>
        </Container>
    )

}

export default Andamento