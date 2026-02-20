import React, { useContext, useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useParams } from 'react-router'
import { MainContext, useError } from '../../../..'
import api from '../../../../../../api'
import Loader from '../../../Loader'
import { IProcesso } from '../Processo/types'
import Andamento from './Andamento'
import { Ul } from './style'
import { IAndamento } from './types'
import Pagination from 'react-bootstrap/Pagination';
import Paginacao from '../../../Paginacao'


const Andamentos: React.FC = () => {

    const { processoId } = useParams()
    const [processo, setProcesso] = useState<IProcesso>({pro_id: 0, pro_cnj: '', pro_titulo: ''})
    const [carregando, setCarregando] = useState(true)
    const [carregandoAndamentos, setCarregandoAndamentos] = useState(false)
    const [andamentos, setAndamentos] = useState<IAndamento[]>([])
    const [paginacao, setPaginacao] = useState<{totalItens: number, itensPorPagina: number, paginaAtual: number, paginaAnterior: number}>({ totalItens: 0, itensPorPagina: 0, paginaAtual: 1, paginaAnterior: 1})
    const showError = useError()
    const { setBreadCrumb } = useContext(MainContext)

    useEffect(() => {
        const fetchProcesso = async () => {
            if(processoId === undefined)
                return
            try{
                //TODO: Unificar em uma req só 
                const { data: processoData } = await api.get<IProcesso>(`/processo/${processoId}`)
                const { data: { andamentos, total, page } } = await api.get<{ andamentos: IAndamento[], total: number, page: number }>(`processo/${processoData.pro_id}/andamentos/0?direction=next`)
                setProcesso(processoData)
                setAndamentos(andamentos)
                setPaginacao({ ...paginacao, totalItens: total, itensPorPagina: page })
                setCarregando(false)
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar o processo.', error as Error)
            }
        }
        fetchProcesso()
    },[processoId])


    useEffect(() => {
        setBreadCrumb(breadCrumb => [
            { name: 'Home', path: '/' },
            { name: 'Processos', path: '/processos' },
            { name: processoId || '', path: `/processos/${processoId || ''}` },
            { name: 'Andamentos', path: `/processos/${processoId || ''}/andamentos` }])
    }, [setBreadCrumb, processoId])

    useEffect(() => {
        const { paginaAtual, paginaAnterior } = paginacao
        if(paginaAnterior === paginaAtual)
            return
        const fetchAndamentos = async () => {
            try{
                const { and_data: ultimaDataAndamento } = andamentos[andamentos.length - 1]
                const { and_data: primeiraDataAndamento } = andamentos[0]
                const direction = paginaAnterior > paginaAtual ? 'prev' : 'next'
                const startAndData = direction === 'prev' ? primeiraDataAndamento : ultimaDataAndamento
                //TODO: Unificar em uma req só 
                const { data: { andamentos: andamentosData, total, page} } = await api
                    .get<{ andamentos: IAndamento[], total: number, page: number }>(`processo/${processo.pro_id}/andamentos/${startAndData}?direction=${direction}`)
                setAndamentos(andamentosData)
                setPaginacao(paginacao => ({ ...paginacao, totalItens: total, itensPorPagina: page, paginaAnterior: paginaAtual }))
            }
            catch(error: any){
                showError('Ocorreu um erro ao buscar andamentos.', error as Error)
            }
            setCarregandoAndamentos(false)
        }
        setCarregandoAndamentos(true)
        fetchAndamentos()
    },[paginacao.paginaAtual, processo.pro_id])


    if(carregando)
        return <Loader/>

    if(processoId === undefined)
        return <h1>Não há nada aqui</h1>
    
    return (
        <Container style={{ width: '100%'}}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Andamentos - {processo.pro_titulo}</h1>
                <div style={{ display: 'flex', flexDirection: 'row' , height: '50px'}} >
                    {/*
                    //TODO: implementar
                        <Form.Control
                            style={{ marginRight: '10px'}}
                            type="text"
                            placeholder="Procurar andamento..."
                        />
                        <Form.Control
                            type="date"
                        />
                    */}
                </div>
            </div>
            <hr/>
            <Paginacao 
                totalItens={paginacao.totalItens} 
                itensPorPagina={paginacao.itensPorPagina} 
                paginaAtual={paginacao.paginaAtual} 
                setPagina={(pagina: number) => setPaginacao({...paginacao, paginaAtual: pagina})}
                disabled={carregandoAndamentos}
            />
            {carregandoAndamentos ? 
                <Loader/> : andamentos.length > 0 ?
                <Ul>{andamentos.map(andamento => <Andamento andamento={andamento} processoId={processoId}/>)}</Ul> :
                <>Nenhum andamento.</>
            }
            <Paginacao 
                totalItens={paginacao.totalItens} 
                itensPorPagina={paginacao.itensPorPagina} 
                paginaAtual={paginacao.paginaAtual} 
                setPagina={(pagina: number) => setPaginacao({...paginacao, paginaAtual: pagina})}
                disabled={carregandoAndamentos}
            />
        </Container>
    )

}

export default Andamentos
