import { Request, Response } from "express"
import { parseISO, format } from "date-fns"
import { ProcessoController } from "../../controlers"
import { CreateAndamento } from "../../controlers/types"
import { buscarAndamentos } from "../../buscadorV2"
import api from "../../api/api"
import { httpCodes } from "../../utils/constants"
import logger from "../../utils/logger"
import { ModelProcesso } from "../../models/types"


interface CallbackMovimentacao {
    id: number
    conteudo: string
    data: string
}


interface CallbackAtualizacaoConcluida  {
    event: "atualizacao_processo_concluida"
    atualizacao: {
        id: number
        status: string
        numero_cnj: string
    }
}

interface CallbackNovaMovimentacao {
    event: "nova_movimentacao"
    monitoramento: { numero: string }
    movimentacao: CallbackMovimentacao
}


const tratarCallbackAtualizacaoConcluida = async (callback: CallbackAtualizacaoConcluida) => {
    const cnj = callback.atualizacao.numero_cnj
    logger.info(`Callback de atualização concluída recebido para o processo ${cnj}.`)
    const processo = await ProcessoController.getByCNJ(cnj)
    if (!processo) {
        logger.info(`Callback recebido para processo não cadastrado localmente: ${cnj}.`)
        return
    }

    await buscarAndamentos(processo, true)
}

const tratarCallbackNovaMovimentacao = async (callback: CallbackNovaMovimentacao) => {
    const cnj = callback.monitoramento.numero
    logger.info(`Callback de nova movimentação recebido para o processo ${cnj}.`)
    const processo = await ProcessoController.getByCNJ(cnj)
    if (!processo) {
        logger.info(`Callback recebido para processo não cadastrado localmente: ${cnj}.`)
        return
    }

    const movimentacao = callback.movimentacao
    const andamento: CreateAndamento = {
        and_external_id: movimentacao.id,
        and_descricao: movimentacao.conteudo,
        and_data: movimentacao.data,
        pro_id: processo.pro_id
    }

    await ProcessoController.saveNewAndamentos(processo.pro_id, [andamento], false)
    await buscarAndamentos(processo)
}

export const receberCallback = async (request: Request, response: Response) => {
    const callback = request.body as (CallbackAtualizacaoConcluida | CallbackNovaMovimentacao | { event: string })

    try {
        switch (callback.event) {
            case "atualizacao_processo_concluida":
                await tratarCallbackAtualizacaoConcluida(callback as CallbackAtualizacaoConcluida)
                break
            case "nova_movimentacao":
                await tratarCallbackNovaMovimentacao(callback as CallbackNovaMovimentacao)
                break
            default:
                logger.info(`Callback ignorado. Evento não tratado: ${callback.event}.`)
                break
        }

        response.status(httpCodes.OK).json({ message: "Callback recebido." })
    } catch (error) {
        logger.error("Erro ao processar callback do Escavador.", error)
        response.status(httpCodes.INTERNAL_ERROR).json({ message: "Erro ao processar callback." })
    }
}
