import { modelAndamento, modelNotificacao, modelProcesso, modelTarefa } from "../models"
import { ModelNotificacao } from "../models/types"
import { sanitizeObject } from "../utils/utils"
import { CreateNotificacao, Notificacao } from "./types"

//  should ne handled by the caller
const attributes = ['not_id', 'not_aviso', 'not_data_envio', 'not_importancia']

export const create = async (notificacao: CreateNotificacao): Promise<Notificacao> => {
    const createdNotificacao = await modelNotificacao.create(notificacao)
    return sanitizeObject(createdNotificacao.get(), attributes)
}

export const createBulk = async (notificacoes: CreateNotificacao[]) => {
    await modelNotificacao.bulkCreate(notificacoes)
}

// Can return undefined if not found
export const get = async (not_id: number): Promise<Notificacao> => {
    const notificacao = await modelNotificacao.findByPk(not_id, { attributes })
    if(notificacao === null)
        throw new Error('Notificação não existe.')
    return notificacao.get()
}

export const getInstance = async (not_id: number): Promise<ModelNotificacao> => {
    const notificacao = await modelNotificacao.findByPk(not_id)
    if(notificacao === null)
        throw new Error('Notificação não existe.')
    return notificacao
}

export const update = async (notificacao: Notificacao) => {
    const { not_id } = notificacao
    const notificacaoExistente = await getInstance(not_id)
    if (notificacaoExistente === null)
        throw new Error('Notificação não existe.')
    await notificacaoExistente.update(notificacao)
    await notificacaoExistente.save()
}

export const marcarVista = async (usu_id: number, not_id: number) => {
    const notificacaoExistente = await modelNotificacao.findOne({ where: { not_id, usu_id }})
    if (notificacaoExistente === null)
        throw new Error('Notificação não existe.')
    await notificacaoExistente.update({ not_visto: true })
    await notificacaoExistente.save()
}

export const getAll = async (): Promise<Notificacao[]> => {
    const notificacoes = await modelNotificacao.findAll({ attributes })
    return notificacoes.map(notificacao => notificacao.get())
}

export const getAllNotSeenUserNotifications = async (usu_id: number): Promise<Notificacao[]> => {

    const notificacoes = await modelNotificacao.findAll({
        attributes,
        where: { usu_id, not_visto: false },
        order: ['not_data_envio'],
        include: [
            { model: modelProcesso, as: 'processo' },
            { model: modelAndamento, as: 'andamento' },
            { model: modelTarefa, as: 'tarefa' }
         ]
    })

    return notificacoes.map(notificacao => notificacao.get())
}



