import database from '../database'
import { Model, Op } from 'sequelize'
import { CreateAndamento, Andamento } from './types'
import { sanitizeAndamento, sanitizeObject } from '../utils/utils'
import { modelAndamento } from '../models'
import { defaultPageLimit } from '../utils/constants'


// All functions here are expected to throw erros
//  should ne handled by the caller

export const attributes = ['and_data', 'and_descricao', 'and_id']

export const create = async (andamento: CreateAndamento) => {
    sanitizeAndamento(andamento)
    const createdAndamento = await modelAndamento.create(andamento)
    return sanitizeObject(createdAndamento.get(), attributes)
}
export const createBulk = async (andamentos: CreateAndamento[]) => {
    andamentos.forEach(a => sanitizeAndamento(a))
    const novosAndamentos = await modelAndamento.bulkCreate(andamentos)
    return novosAndamentos.map(a => a.get())
}

// Can return undefined if not found
export const get = async (and_id: number) => {
    const andamento = await modelAndamento.findByPk(and_id, { attributes })
    if(andamento === null)
        throw new Error("Andamento não existe.")
    return andamento.get()
}

export const getInstance = async (and_id: number) => {
    const andamento = await modelAndamento.findByPk(and_id)
    return andamento
}

export const update = async (andamento: Andamento) => {
    const { and_id } = andamento
    const andamentoExistente = await getInstance(and_id)
    if (andamentoExistente === null)
        throw new Error('Andamento não existe.')
    await andamentoExistente.update(andamento)
    await andamentoExistente.save()
}

export const remove = async (and_id: number) => {
    const andamentoExistente = await getInstance(and_id)
    if (andamentoExistente === null)
        throw new Error('Andamento não existe.')
    await andamentoExistente.destroy()
}

export const getAll = async () => {
    const andamentos = await modelAndamento.findAll({ attributes })
    return andamentos.map(andamento => andamento.get())
}

export const getAllAndamentoProcesso = async (pro_id: number, start_and_data: string = '0', greater: boolean = false): Promise<Andamento[]> => {
    const comparator = greater ? Op.gt : Op.lt
    const whereAndData = start_and_data === '0'
        ? { [Op.ne]: null }
        : { [comparator]: start_and_data }

    const andamentos = await modelAndamento.findAll({ 
        where:{
            pro_id,
            and_data: whereAndData
        },
        order: (greater && start_and_data !== '0')
            ? [['and_data', 'ASC'], ['and_id', 'ASC']]
            : [['and_data', 'DESC'], ['and_id', 'DESC']],
        attributes,
        limit: defaultPageLimit
    })
    if(greater && start_and_data !== '0')
        return andamentos.map(andamento => andamento.get()).reverse()
    return andamentos.map(andamento => andamento.get())
}

export const countAndamentosProcesso = async (pro_id: number): Promise<number> => {
    const count = await modelAndamento.count({ where: { pro_id }})
    return count
}
