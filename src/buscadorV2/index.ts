// TODO: Mover esse módulo para um serviço separado no futuro?

import api from "../api/api";
import { AndamentoController, ProcessoController } from "../controlers";
import { Andamento, CreateAndamento } from "../controlers/types";
import { ModelProcesso } from "../models/types";
import { format, parse } from "date-fns";
import logger from "../utils/logger";
import {
    MonitoramentoProcesso,
    RetornoAndamentoProcessoV2,
    RetornoMonitoramentosProcesso,
    RetornoAndamentosProcessoV2,
    RetornoStatusAtualizacaoProcesso,
    StatusUltimaVerificacaoProcesso,
} from "./types";
import { notificarAndamentosResponsaveis } from "../notificador";

// Pesquisa de andamentos no site do tribunal
// api/v1/processo-tribunal/{numero}/async
// https://api.escavador.com/docs/?javascript#pesquisar-processos-no-site-do-tribunal-em-lote-assncrono

// Pesquisa de andamentos de diários oficiais
// api/v1/processos/{processoId}/movimentacoes
// https://api.escavador.com/docs/?javascript#movimentaes-de-um-processo-que-saram-em-dirios-oficiais


// Busca os andamentos em diários oficiais e no site dos tribunais
// Adiciona somente os últimos andamentos no BD e notifica os responsáveis
// se novos tiverem sido inseridos. Salva a data do último andamento inserido em processo.
export const buscarAndamentos = async (processo: ModelProcesso, notify: boolean = true) => {
    try {
        await ProcessoController.update({ pro_id: processo.pro_id, pro_buscando_andamentos: true })
        // Processo recem criado
        const ultimoAndamento = await ProcessoController.getUltimoAndamentoInstance(processo.pro_id)

        // Solicitar atualização assíncrona do processo no Escavador
        await solicitarAtualizacaoProcesso(processo)

        // Buscar e salvar
        await buscarAndamentosProcesso(processo, notify)

        // Cadastrar monitoramento para o processo
        await cadastrarMonitoramentoProcesso(processo)

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
    } finally {
        await ProcessoController.update({ pro_id: processo.pro_id, pro_buscando_andamentos: false })
    }
}

export const solicitarAtualizacaoProcesso = async (processo: ModelProcesso) => {
    try {
        const { pro_cnj } = processo.get()
        if (!pro_cnj) return

        const { data: statusAtualizacao } = await api.get<RetornoStatusAtualizacaoProcesso>(`https://api.escavador.com/api/v2/processos/numero_cnj/${pro_cnj}/status-atualizacao`)

        const { ultima_verificacao } = statusAtualizacao

        if (ultima_verificacao?.status === "PENDENTE") {
            logger.info(`Atualização já em andamento para o processo ${processo.pro_id}.`)
            return
        }


        const agora = new Date()
        const mesPassado = new Date(agora.getTime() - (30 * 24 * 60 * 60 * 1000))
        const ultimaVerificacaoConcluidaEm = ultima_verificacao?.concluido_em
        const solicitarAtualizacao = !ultima_verificacao || (ultimaVerificacaoConcluidaEm && new Date(ultimaVerificacaoConcluidaEm).getTime() <= mesPassado.getTime())

        if (!solicitarAtualizacao)
            return

        await api.post(`https://api.escavador.com/api/v2/processos/numero_cnj/${pro_cnj}/solicitar-atualizacao`, {
            send_callback: 1
        })
    }
    catch(error) {
        logger.error(`Erro solicitando atualização do processo ${processo.pro_id}.`, error)
        throw error
    }
}

export const buscarMonitoramentoCadastrados = async (): Promise<MonitoramentoProcesso[]> => {
    try {
        const monitoramentos: MonitoramentoProcesso[] = []
        const maxIteracoes = 100
        let iteracao = 0
        let nextLink: string | null = "https://api.escavador.com/api/v2/monitoramentos/processos?limit=100"

        while (nextLink && iteracao < maxIteracoes) {
            const { data } = await api.get<RetornoMonitoramentosProcesso>(nextLink)
            monitoramentos.push(...data.items)
            nextLink = data.links.next as string | null
            iteracao += 1
        }

        return monitoramentos
    } catch (error) {
        logger.error("Erro buscando monitoramentos cadastrados.", error)
        throw error
    }
}

const normalizarNumeroProcesso = (numero: string): string => numero.replace(/\D/g, "")

export const cadastrarMonitoramentoProcesso = async (processo: ModelProcesso) => {
    try {
        const { pro_cnj } = processo.get()
        if (!pro_cnj) return

        const monitoramentosExistentes = await buscarMonitoramentoCadastrados()
        const numeroNormalizado = normalizarNumeroProcesso(pro_cnj)
        const monitoramentoExistente = monitoramentosExistentes
            .find(({ numero }) => normalizarNumeroProcesso(numero) === numeroNormalizado)

        if (monitoramentoExistente) {
            logger.info(`Monitoramento já cadastrado para o processo ${processo.pro_id}.`)
            return
        }

        await api.post("https://api.escavador.com/api/v2/monitoramentos/processos", {
            numero: pro_cnj,
            frequencia: "DIARIA"
        })
    }
    catch(error) {
        logger.error(`Erro cadastrando o monitoramento do processo ${processo.pro_id}.`, error)
        throw error
    }

}

export const removerMonitoramentoProcesso = async (processo: ModelProcesso) => {
    try {
        const { pro_cnj } = processo.get()
        if (!pro_cnj) return

        const monitoramentosExistentes = await buscarMonitoramentoCadastrados()
        const monitoramentosDoProcesso = monitoramentosExistentes.filter(({ numero }) => numero === pro_cnj)

        if (monitoramentosDoProcesso.length === 0) return

        for (const { id } of monitoramentosDoProcesso) {
            await api.delete(`https://api.escavador.com/api/v2/monitoramentos/processos/${id}`)
        }
    }
    catch(error) {
        logger.error(`Erro removendo monitoramento do processo ${processo.pro_id}.`, error)
        throw error
    }
}

const buscarAndamentosProcesso = async (processo: ModelProcesso, notify: boolean = true) => {
    try {
        const { pro_cnj, pro_id } = processo.get()
        if (!pro_cnj) return

        const max_iteracoes = 100
        let iteracao = 0
        let nextLink: string | null = `https://api.escavador.com/api/v2/processos/numero_cnj/${pro_cnj}/movimentacoes?limit=100`

        while (nextLink && iteracao < max_iteracoes) {

            const { data: { items, links }} = await api.get<RetornoAndamentosProcessoV2>(nextLink)
            const andamentos: CreateAndamento[] = items
                .map(({ id, conteudo, data: dataMovimentacao }: RetornoAndamentoProcessoV2) => ({
                    and_external_id: id,
                    and_descricao: conteudo,
                    and_data: dataMovimentacao,
                    pro_id
                }))

            if (andamentos.length > 0)
                await ProcessoController.saveNewAndamentos(pro_id, andamentos, notify)

            nextLink = links.next as string | null
            iteracao += 1
        }
    }
    catch (error) {
        logger.error(`Erro buscando os andamentos do processo ${processo.pro_id}.`, error)
        throw error
    }
}
