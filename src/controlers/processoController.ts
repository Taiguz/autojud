import { modelAndamento, modelProcesso, modelProcessoResponsavel, modelUsuario } from '../models'
import { Andamento, CreateAndamento, CreateProcesso, Processo, ProcessoUpdate, Tarefa, Usuario } from './types'
import { ModelAndamento, ModelProcesso } from '../models/types'
import { buscarAndamentos, removerMonitoramentoProcesso } from '../buscadorV2'
import { sanitizeObject } from '../utils/utils'
import { parseISO } from 'date-fns'
import { AndamentoController, TarefaController, UsuarioController } from '.'
import logger from '../utils/logger'


// All functions here are expected to throw erros
//  should ne handled by the caller
const attributes = ['pro_id', 'pro_cnj', 'pro_titulo', 'pro_situacao', 'pro_buscando_andamentos']

const andamentosPorPagina = 25

export const create = async (processo: CreateProcesso): Promise<Processo> => {
    const createdProcesso = await modelProcesso.create(processo)
    buscarAndamentos(createdProcesso, false)
    return sanitizeObject(createdProcesso.get(), attributes)
}

export const isBuscandoAndamentos = async (pro_id: number): Promise<Boolean> => {
    const { pro_buscando_andamentos } = await get(pro_id)
    return pro_buscando_andamentos === true
}

export const get = async (pro_id: number): Promise<Processo> => {
    const processo = await modelProcesso.findByPk(pro_id, { attributes })
    if(processo === null)
        throw new Error('Processo não existe.')
    return processo.get()
}

export const getByCNJ = async (pro_cnj: string): Promise<ModelProcesso> => {
    const processo = await modelProcesso.findOne({ where: { pro_cnj },  attributes })
    if(processo === null)
        throw new Error('Processo não existe')
    return processo 
}

export const getProcessos = async (pro_id: number[]): Promise<Processo[]> => {
    const processos = await modelProcesso.findAll({ where: { pro_id }, attributes})
    return processos.map(processo => processo.get())
}

export const getInstance = async (pro_id: number): Promise<ModelProcesso> => {
    const processo = await modelProcesso.findByPk(pro_id)
    if(processo === null)
        throw new Error('Processo não existe.')
    return processo
}

export const update = async (processo: ProcessoUpdate) => {
    const { pro_id } = processo
    const processoExistente = await getInstance(pro_id)
    if (processoExistente === null)
        throw new Error('Processo não existe.')
    await processoExistente.update(processo)
    await processoExistente.save()
}

export const remove = async (pro_id: number) => {
    const processoExistente = await getInstance(pro_id)
    if (processoExistente === null)
        throw new Error('Processo não existe.')
    await processoExistente.destroy()
    try {
        await removerMonitoramentoProcesso(processoExistente)
    }
    catch (error) {
        logger.error(`Erro removendo monitoramento do processo ${pro_id}.`, error)
    }
}

export const getAll = async (): Promise<Processo[]> => {
    const processos = await modelProcesso.findAll({ attributes })
    return processos.map(processo => processo.get())
}

export const getAllInstances = async (): Promise<ModelProcesso[]> => {
    const processos = await modelProcesso.findAll()
    return processos
}

export const getAllAndamentos = async (pro_id: number, start_and_data: string = '0', greater: boolean = true): Promise<Andamento[]> => {
    const andamentos = await AndamentoController.getAllAndamentoProcesso(pro_id, start_and_data, greater)
    return andamentos
}

export const getAllTarefas = async (pro_id: number): Promise<Tarefa[]> => {
    const tarefas = await TarefaController.getAllProcesso(pro_id)
    return tarefas
}

export const getAllReponsaveis = async (pro_id: number): Promise<Usuario[]> => {
    const responsaveis = await modelProcessoResponsavel.findAll({ where: { pro_id }})
    const usuariosResponsaveis = responsaveis.map(({ usu_id }) => usu_id)
    const usuarios = await UsuarioController.getUsuarios(usuariosResponsaveis)
    return usuarios
}

export const getUltimoAndamentoInstance = async (pro_id: number): Promise<ModelAndamento | null> => {
    const andamento =  await modelAndamento.findOne({ where:{ pro_id }, order: [['and_data', 'DESC']]})
    return andamento
}

export const saveNewAndamentos = async (pro_id: number, andamentos: CreateAndamento[], notify: boolean = true): Promise<Andamento[]> => {
    const processo = await getInstance(pro_id)

    let andamentosFiltrados = [...andamentos]
    const { pro_ultimo_andamento } = processo

    if(pro_ultimo_andamento){
        const dataUltimoAndamento = parseISO(pro_ultimo_andamento)
        andamentosFiltrados = andamentosFiltrados.filter(({ and_data }) => parseISO(and_data) > dataUltimoAndamento )
    }

    andamentosFiltrados = andamentosFiltrados.sort((a,b) => parseISO(a.and_data).getTime() - parseISO(b.and_data).getTime())

    const novosAndamentos = await AndamentoController.createBulk(andamentosFiltrados)

    return novosAndamentos
}

export const salvarDataUltimoAndamento = async (pro_id: number) => {
    const processo = await getInstance(pro_id)

    const ultimoAndamento = await getUltimoAndamentoInstance(pro_id)

    if(ultimoAndamento){
        await processo.update({ pro_ultimo_andamento: ultimoAndamento?.and_data})
        await processo.save()
    }
}

export const addResponsavel = async (usu_id: number, pro_id: number) => {
    const usuario = await UsuarioController.getInstance(usu_id)
    const processo = await getInstance(pro_id)
    await modelProcessoResponsavel.create({ usu_id: usuario.usu_id, pro_id: processo.pro_id })
}

export const addResponsaveisByTag = async (usu_tag: string[], pro_id: number) => {
    const usuarios = await UsuarioController.getInstancesByTag(usu_tag)
    const processo = await getInstance(pro_id)
    const responsaveis = usuarios.map(({ usu_id }) => ({ usu_id, pro_id: processo.pro_id }))
    await modelProcessoResponsavel.bulkCreate(responsaveis, { ignoreDuplicates: true })
}

export const removeResponsavelByTag = async (usu_tag: string, pro_id: number) => {
    const { usu_id } = await UsuarioController.getInstanceByTag(usu_tag)
    await modelProcessoResponsavel.destroy({ where: { usu_id, pro_id }})
}

export const removeResponsavel = async (usu_id: number, pro_id: number) => {
    await modelProcessoResponsavel.destroy({ where: { usu_id, pro_id }})
}

export const createTarefa = async (tarefa: Tarefa): Promise<Tarefa> => {
    const { pro_id } = tarefa
    const processo = await getInstance(pro_id)
    const novaTarefa = await TarefaController.create(tarefa)
    return novaTarefa
}
