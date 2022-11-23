import { sanitizeObject } from '../utils/utils'
import { CreateTarefa, Tarefa, Usuario } from './types'
import { modelTarefa } from '../models'
import { UsuarioController } from '.'
import { modelProcesso, modelTarefaResponsavel } from '../models'
import { Op } from 'sequelize'
import { addDays, addHours, compareDesc, isAfter, isBefore, parseISO, setHours } from 'date-fns'
import { diasDeAntecedenciaParaAvisoTarefas } from '../utils/constants'
import { CustomValidatorError } from '../utils/erros'
import { dateToISOSTring } from '../utils/dataUtils'


// All functions here are expected to throw erros
//  should ne handled by the caller

export const attributes = [
    'tar_id',
    'tar_objetivo',
    'tar_data_cadastro',
    'tar_data_termino',
    'tar_situacao',
    'tar_pai_id',
    'pro_id'
]

// Todos os campos enviados ao controller devem ser sanitizados pelo caller

export const create = async (tarefa: CreateTarefa): Promise<Tarefa> => {
    // TODO: checar se o processo existe
    const sanitizedTarefa = {...tarefa, tar_pai_id: undefined }
    const createdTarefa = await modelTarefa.create(sanitizedTarefa)
    return sanitizeObject(createdTarefa.get(), attributes)
}


// Assumes tarefa exists
export const get = async (tar_id: number) => {
    const tarefa = await modelTarefa.findByPk(tar_id, { attributes })
    if(tarefa === null)
        throw new Error('Tarefa não existe.')
    return tarefa.get()
}

export const getInstance = async (tar_id: number) => {
    const tarefa = await modelTarefa.findByPk(tar_id)
    if(tarefa === null)
        throw new Error('Tarefa não existe.')
    return tarefa
}

export const getTarefas = async (tar_id: number[]): Promise<Tarefa[]> => {
    const tarefas = await modelTarefa.findAll({ where: { tar_id }, attributes})
    return tarefas.map(tarefa => tarefa.get())
}

const checkIsSubtarefaValida = (subtarefa: Tarefa, tarefa: Tarefa) => {
    debugger
    if(isAfter(setHours(parseISO(subtarefa.tar_data_termino),12), setHours(parseISO(tarefa.tar_data_termino),12)))
        throw new CustomValidatorError('Subtarefa tem data de término maior que a tarefa. Subtarefa deve acontecer entre o começo e fim da tarefa.')
    if(isBefore(setHours(parseISO(subtarefa.tar_data_cadastro),12), setHours(parseISO(tarefa.tar_data_cadastro),12)))
        throw new CustomValidatorError('Subtarefa tem data de cadastro menor que a tarefa. Subtarefa deve acontecer entre o começo e fim da tarefa.')
}

export const createSubtarefa = async (tarefa: Tarefa) => {
    const tarefaExistente = await getInstance(tarefa.tar_id)
    checkIsSubtarefaValida(tarefa, tarefaExistente)
    const sanitizedTarefa = {...tarefa, tar_id: undefined, tar_pai_id: tarefa.tar_id, pro_id: tarefaExistente.pro_id}
    const createdTarefa = await modelTarefa.create(sanitizedTarefa)
    return sanitizeObject(createdTarefa.get(), attributes)
}

export const update = async (tarefa: Tarefa) => {
    const { tar_id } = tarefa
    const tarefaExistente = await getInstance(tar_id)
    if (tarefaExistente === null)
        throw new Error('Tarefa não existe.')
    if (tarefaExistente.tar_pai_id && (tarefa.tar_data_cadastro || tarefa.tar_data_termino)){
        const tarefaPai = await getInstance(tarefaExistente.tar_pai_id)
        checkIsSubtarefaValida(tarefa, tarefaPai)
    }
    await tarefaExistente.update(tarefa)
    await tarefaExistente.save()
}

export const remove = async (tar_id: number) => {
    const tarefaExistente = await getInstance(tar_id)
    if (tarefaExistente === null)
        throw new Error('Tarefa não existe.')
    await tarefaExistente.destroy()
}

export const getAll = async () => {
    // TODO: Paginar getAll tarefas, cuidado com as chamadas já existentes que esperam todas as tarefas
    const tarefas = await modelTarefa.findAll({ attributes, where: { tar_pai_id: undefined } })
    return tarefas.map(tarefa => tarefa.get())
}


interface ResponsavelTarefas { [key: string]: { responsavel: Usuario, tarefas: Tarefa[]}}

export const getAllParaVencimentoParaResponsaveis = async (): Promise<ResponsavelTarefas> => {
    const hoje = parseISO(dateToISOSTring(new Date()))
    const futuro = addDays(hoje, diasDeAntecedenciaParaAvisoTarefas)
    let tarefas: any = await modelTarefa.findAll({
        where: {
            tar_data_termino: {
                [Op.between]: [dateToISOSTring(hoje), dateToISOSTring(futuro)]
            },
            tar_pai_id: null,
        },
        include: {
            model: modelProcesso,
            as: 'processo',
            required: true
        }
    })

    const responsaveis: ResponsavelTarefas = {}

    for(const tarefa of tarefas){
        tarefa.responsaveis = await getAllReponsaveis(tarefa.tar_id)
        tarefas.processo = tarefa.processo.get()
    }

    tarefas.forEach((tarefa: any) => {
        tarefa.responsaveis.forEach((responsavel: any) => {
            const { usu_id } = responsavel
            if(responsaveis[usu_id] === undefined)
                responsaveis[usu_id] = { responsavel, tarefas: []}
            responsaveis[usu_id].tarefas.push(tarefa.get())
        })
    })

    return responsaveis
}

export const addResponsavel = async (usu_id: number, tar_id: number) => {
    const usuario = await UsuarioController.getInstance(usu_id)
    const tarefa = await getInstance(tar_id)
    await modelTarefaResponsavel.create({ usu_id: usuario.usu_id, tar_id: tarefa.tar_id })
}

export const addResponsaveisByTag = async (usu_tag: string[], tar_id: number) => {
    const usuarios = await UsuarioController.getInstancesByTag(usu_tag)
    const tarefa = await getInstance(tar_id)
    const responsaveis = usuarios.map(({ usu_id }) => ({ usu_id, tar_id: tarefa.tar_id }))
    await modelTarefaResponsavel.bulkCreate(responsaveis, { ignoreDuplicates: true })
}

export const removeResponsavel = async (usu_id: number, tar_id: number) => {
    await modelTarefaResponsavel.destroy({ where: { usu_id, tar_id }})
}

export const removeResponsavelByTag = async (usu_tag: string, tar_id: number) => {
    const { usu_id } = await UsuarioController.getInstanceByTag(usu_tag)
    await modelTarefaResponsavel.destroy({ where: { usu_id, tar_id }})
}

export const getAllReponsaveis = async (tar_id: number): Promise<Usuario[]> => {
    const responsaveis = await modelTarefaResponsavel.findAll({ where: { tar_id }})
    const usuariosResponsaveis = responsaveis.map(({ usu_id }) => usu_id)
    const usuarios = await UsuarioController.getUsuarios(usuariosResponsaveis)
    return usuarios
}

// Talvez seja útil algum dia
export const getAllProcessoWithSubtarefas = async (pro_id: number): Promise<Tarefa[]> => {
    const tarefasModels = await modelTarefa.findAll({ attributes, where: { pro_id } })
    const tarefas: Tarefa[] = []
    // TODO: É possível melhorar essa complexidade? 
    tarefasModels.forEach(tarefa => {
        if(tarefa.tar_pai_id !== null) return
        const tarefasFilhas = tarefasModels.filter(tarefaFilha => tarefaFilha.tar_pai_id === tarefa.tar_id)
        tarefas.push({...tarefa.get(), subtarefas: tarefasFilhas})
    })
    return tarefas
}

export const getAllProcesso = async (pro_id: number): Promise<Tarefa[]> => {
    const tarefasModels = await modelTarefa.findAll({ attributes, where: { pro_id, tar_pai_id: { [Op.eq]: null} } })
    return tarefasModels.map(tarefa => tarefa.get())
}

export const getAllSubtarefas = async (tar_id: number): Promise<Tarefa[]> => {
    const tarefasModels = await modelTarefa.findAll({ attributes, where: { tar_pai_id: tar_id } })
    return tarefasModels.map(tarefa => tarefa.get())
}