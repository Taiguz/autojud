// TODO: Mover esse módulo para um serviço separado no futuro?

import api from "../api/api";
import { AndamentoController, ProcessoController } from "../controlers";
import { Andamento, CreateAndamento } from "../controlers/types";
import { ModelProcesso } from "../models/types";
import { format, parse } from "date-fns";
import logger from "../utils/logger";
import { EscavadorStatus, RetornoAndamentosDiariosOficiais, RetornoConsultaAndamentoTribunal } from "./types";
import { notificarAndamentosResponsaveis } from "../notificador";

// Pesquisa de andamentos no site do tribunal
// api/v1/processo-tribunal/{numero}/async
// https://api.escavador.com/docs/?javascript#pesquisar-processos-no-site-do-tribunal-em-lote-assncrono

// Pesquisa de andamentos de diários oficiais
// api/v1/processos/{processoId}/movimentacoes
// https://api.escavador.com/docs/?javascript#movimentaes-de-um-processo-que-saram-em-dirios-oficiais

const intervaloBuscaAndamentosTribunalMillis = 1000


// Busca os andamentos em diários oficiais e no site dos tribunais
// Adiciona somente os últimos andamentos no BD e notifica os responsáveis
// se novos tiverem sido inseridos. Salva a data do último andamento inserido em processo.
export const buscarAndamentos = async (processo: ModelProcesso, notify: boolean = true) => {
    try {
        const { pro_external_id } = processo
        let ultimoAndamento: Andamento | null = null
        // Processo recem criado
        if(pro_external_id === null) 
            await buscaProcessoExternalID(processo)
        else 
            ultimoAndamento = await ProcessoController.getUltimoAndamentoInstance(processo.pro_id)

        // Buscar e salvar
        await buscaAndamentosDiariosOficiais(processo, notify)
        await buscaAndamentosTribunais(processo, notify)

        // Salvar última data buscada
        await ProcessoController.salvarDataUltimoAndamento(processo.pro_id)

        // Notificar responsáveis
        if(ultimoAndamento !== null){
            const novosAndamentos = await AndamentoController
                .getAllAndamentoProcesso(processo.pro_id, ultimoAndamento.and_id, true)
            if(novosAndamentos.length === 0){
                logger.info(`Sem novos andamentos para o processo ${processo.pro_id}.`)
                return
            }

            const responsaveis = await ProcessoController.getAllReponsaveis(processo.pro_id)
            notificarAndamentosResponsaveis(processo.get(), novosAndamentos, responsaveis)
        }
    } catch (error) {
        logger.error(`Erro buscando os andamentos do processo ${processo.pro_id}.`, error)
    }
}

export const buscaPeriodicaAndamentos = async () => {
    console.log('Buscando andamentos de todos os processos...')
    const processos = await ProcessoController.getAllInstances()
    processos.forEach((processo) =>{
        console.log(`Buscando processo ${processo.pro_id} ...`)
        buscarAndamentos(processo)
    })
}

const buscaProcessoExternalID = async (processo: ModelProcesso) => { // TODO: Buscar o número do processo somente nos diários oficiais?
    console.log('Buscando external ID')
    try {
        const { pro_cnj } = processo.get()
        const { data } = await api.get<{ id: number}[]>(`processos/numero/${pro_cnj}`)
        const { id } = data[0]
        processo.update({ pro_external_id: id})
        await processo.save()
    } catch (error) {
        //TODO: deveria tentar novamente aqui 
        logger.error(`Erro buscando o external id do processo ${processo.pro_id}.`, error)
        throw error
    }
}

const buscaAndamentosTribunais = async (processo: ModelProcesso, notify: boolean = true) => {
    console.log('buscando andamentos tribunais')
    try {
        const { pro_cnj, pro_id } = processo

        const salvarAndamentos = async (processo: RetornoConsultaAndamentoTribunal) => {
            console.log('salvando andamentos')
            const {resposta: {instancias} } = processo
            const movimentacoes: CreateAndamento[] = instancias
                .flatMap(({movimentacoes}) => movimentacoes )
                .map(({ id, conteudo, data}) => ({ and_external_id: id, and_descricao: conteudo, and_data: format(parse(data, 'dd/MM/yyyy', new Date()),'yyyy-MM-dd'), pro_id }))
            await ProcessoController.saveNewAndamentos(pro_id, movimentacoes, notify)
            console.log('salvo!')
        }

        // Revisar isso aqui
        const buscar = async (url: string, params: any) => {
            const { data } = await api.get<RetornoConsultaAndamentoTribunal>(url, params)
            
            const { status } = data

            if(!status) throw new Error('Erro na consulta dos andamentos.')

            // TODO: Adicionar lógica de retentar caso dê erro na consulta
            if(status === EscavadorStatus.SUCESSO)
                await salvarAndamentos(data)
            else if(status === EscavadorStatus.PENDENTE)
                setTimeout(() => buscar(data.link_api,{}), intervaloBuscaAndamentosTribunalMillis)
            else throw new Error('Erro na consulta dos andamentos.')

        }


        // TODO: Isso aqui só deve retornar quando todas as func recursivas chamadas retornarem
        // no caso está esperando só a primeira
        await buscar(`processo-tribunal/${pro_cnj}/async`, { params: { wait: 1 }})

        
    } catch (error) {
        logger.error(`Erro buscando os andamentos do processo ${processo.pro_id}.`, error)
    }
}

const buscaAndamentosDiariosOficiais = async (processo: ModelProcesso, notify: boolean = true) => {
    console.log('buscando diarios oficiais')
    try {
        //TODO: Validar se esta adicionando todos os itens das paginas corretamente com um processo grande
        const { pro_external_id, pro_id } = processo.get()
        // Requisicao por pagina
        const buscarPagina = async (page: number): Promise<RetornoAndamentosDiariosOficiais> => {
            const { data } = await api.get<RetornoAndamentosDiariosOficiais>(`processos/${pro_external_id}/movimentacoes`, {
                params: {
                    limit: 60,
                    page
                }
            })
            return data
        }
        // Salvar andamentos no BD
        const salvarAndamentos = async (retornoAndamentos: RetornoAndamentosDiariosOficiais) => {
            const { items } = retornoAndamentos
            const andamentos: CreateAndamento[] = items
                .map(({ conteudo, data, id }) => ({ and_external_id: id, and_descricao: conteudo, and_data: data, pro_id }))
            await ProcessoController.saveNewAndamentos(pro_id, andamentos, notify)
        }

        const pagina1 = await buscarPagina(1)
        await salvarAndamentos(pagina1)

        const { paginator: { total_pages } } = pagina1

        for(let currentPage = 2; currentPage <= total_pages; currentPage++){ // 3
            const pagina = await buscarPagina(currentPage)
            await salvarAndamentos(pagina)
        }
    } catch (error) {
        //TODO: deveria tentar novamente aqui 
        logger.error(`Erro buscando os andamentos em diários oficiais do processo ${processo.pro_id}.`, error)
        throw error
    }
}




