import { sanitizeObject } from '../utils/utils'
import { CreateTarefa, Tarefa, Usuario } from './types'
import { modelTarefa } from '../models'
import validator from 'validator'
import { Op } from 'sequelize'
import { TarefaController } from '.'


// All functions here are expected to throw erros
//  should ne handled by the caller

export const attributes = [
    'tar_id',
    'tar_objetivo',
    'tar_data_cadastro',
    'tar_data_termino',
    'tar_situacao',
    'tar_pai_id'
]

// Todos os campos enviados ao controller devem ser sanitizados pelo caller

export const create = async (subtarefa: CreateTarefa) => {
    const { tar_pai_id } = subtarefa
    if(tar_pai_id === undefined || tar_pai_id === null || !validator.isInt(subtarefa.tar_pai_id + ''))
        throw new Error('Subtarefa deve ter referência para uma tarefa.')
    
    const createdSubtarefa = await modelTarefa.create(subtarefa)
    return sanitizeObject(createdSubtarefa.get(), attributes)
}

// Assumes subtarefa exists
export const get = async (tar_id: number) => {
    const tarefa = await modelTarefa.findByPk(tar_id, { attributes })
    if(tarefa === null)
        throw new Error('Subtarefa não existe.')
    return tarefa.get()
}

export const getInstance = async (tar_id: number) => {
    const subtarefa = await modelTarefa.findByPk(tar_id)
    if(subtarefa === null)
        throw new Error('Subtarefa não existe.')
    return subtarefa
}

export const update = async (subtarefa: Tarefa) => {
    const { tar_id, tar_pai_id } = subtarefa
    if(tar_pai_id === null)
        throw new Error('Subtarefa deve ter referência para uma tarefa.')
    const subtarefaExistente = await getInstance(tar_id)
    if (subtarefaExistente === null)
        throw new Error('Subtarefa não existe.')
    await subtarefaExistente.update(subtarefa)
    await subtarefaExistente.save()
}

export const remove = async (tar_id: number) => {
    const subtarefaExistente = await getInstance(tar_id)
    if (subtarefaExistente === null)
        throw new Error('Subtarefa não existe.')
    await subtarefaExistente.destroy()
}

export const getAll = async () => {
    // TODO: Paginar getAll subtarefas, cuidado com as chamadas já existentes que esperam todas as tarefas
    const subtarefas = await modelTarefa.findAll({ attributes, where: { tar_pai_id: { [Op.not]: undefined } } })
    return subtarefas.map(subtarefa => subtarefa.get())
}

export const addResponsavel = async (usu_id: number, tar_id: number) => {
    await TarefaController.addResponsavel(usu_id, tar_id)
}

export const removeResponsavel = async (usu_id: number, tar_id: number) => {
    await TarefaController.removeResponsavel(usu_id, tar_id)
}

export const getAllReponsaveis = async (tar_id: number): Promise<Usuario[]> => {
    return await TarefaController.getAllReponsaveis(tar_id)
}
