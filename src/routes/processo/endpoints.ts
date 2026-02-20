
import { AndamentoController, ProcessoController, TarefaController } from './../../controlers'
import { Request, Response } from "express"
import { defaultPageLimit, httpCodes } from '../../utils/constants'
import logger from '../../utils/logger'
import validator from 'validator'
import { ValidationError } from 'sequelize'
import { Andamento, Processo } from '../../controlers/types'

export const createProcesso = async (request: Request, response: Response) => {
    const  processo = request.body
    try { 
        const novoProcesso = await ProcessoController.create(processo)
        response.status(httpCodes.CREATED).json(novoProcesso)
    }
    catch(error){
        logger.error('Erro ao criar processo.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else 
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar processo.'})
    }
}

export const buscandoAndamentos = async (request: Request, response: Response) => {
    try { 
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        response.status(httpCodes.OK).json({ buscando: await ProcessoController.isBuscandoAndamentos(pro_id)})
    }
    catch(error){
        logger.error('Erro ao consultar processo.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao consultar processo.'})
    }
}

export const getAllProcessos = async (request: Request, response: Response) => {
    try {
        const processos = await ProcessoController.getAll()
        response.status(httpCodes.CREATED).json(processos)
    }
    catch(error){
        logger.error('Erro ao retornar processos.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar processos.'})
    }
}

export const deletarProcesso = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        await ProcessoController.remove(pro_id)
        response.status(httpCodes.OK).end()
    }
    catch(error){
        logger.error('Erro ao deletar processo.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao deletar processo.'})
    }
}

export const atualizarProcesso = async (request: Request, response: Response) => {
    const processo = request.body
    try {
        await ProcessoController.update(processo)
        response.status(httpCodes.OK).end()
    }
    catch(error){
        logger.error('Erro ao atualizar processo.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao atualizar processo.'})
    }
}

export const getProcesso = async (request: Request, response: Response) => {
    let processo: Processo | null = null 
    try {
        if(validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false})){
            const pro_id = parseInt(request.params.pro_id)
            processo = await ProcessoController.get(pro_id)
        }
        //TODO: validar se isso funciona
        else if(validator.matches(request.params.pro_id, /[0-9-.]{1,20}/)){
            const pro_cnj = request.params.pro_id
            processo = await ProcessoController.getByCNJ(pro_cnj)
        }
        if (processo !== null)
            response.status(httpCodes.OK).json(processo)
        else
            response.status(httpCodes.SERVER_ERROR).json({message: 'Processo não existe.'})
    }
    catch(error){
        logger.error('Erro ao retornar processo.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar processo.'})
    }
}

export const getAndamentos = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        const startAndData = request.params.start_and_data
        const direction = request.query.direction === 'prev' ? 'prev' : 'next'
        if (startAndData !== '0' && !validator.isDate(startAndData))
            throw new Error('Parâmetros de requisição inválidos.')

        const andamentos = await ProcessoController.getAllAndamentos(pro_id, startAndData, direction === 'prev')
        const total = await AndamentoController.countAndamentosProcesso(pro_id)
        response.status(httpCodes.OK).json({ andamentos, total, page: defaultPageLimit})
    }
    catch(error){
        logger.error('Erro ao retornar processo.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar andamentos.'})
    }
}

export const getTarefas = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        const processo = await TarefaController.getAllProcesso(pro_id)
        response.status(httpCodes.OK).json(processo)
    }
    catch(error){
        logger.error('Erro ao retornar tarefas.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar tarefas.'})
    }
}

export const addResponsavelProcesso = async (request: Request, response: Response) => {
    try {
        const { usu_id } = request.body
        if(!validator.isInt(usu_id + '', { min: 1, allow_leading_zeroes: false}) ||
        !validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        await ProcessoController.addResponsavel(usu_id, pro_id)
        response.status(httpCodes.CREATED).json({ message: 'Responsável adicionado.'})
    }
    catch(error){
        logger.error('Erro ao adicionar responsável.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao adicionar responsável.'})
    }
}

export const addResponsaveisProcessoByTag = async (request: Request, response: Response) => {
    try {
        const { usu_tag } = request.body
        if(!Array.isArray(usu_tag) || usu_tag.length === 0 || usu_tag.length > 20 ||
           !validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        await ProcessoController.addResponsaveisByTag(usu_tag, pro_id)
        response.status(httpCodes.CREATED).json({ message: 'Responsáveis adicionados.'})
    }
    catch(error){
        logger.error('Erro ao adicionar responsáveis.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao adicionar responsáveis.'})
    }
}

export const removeResponsavelProcesso = async (request: Request, response: Response) => {
    try {
        if(request.params.usu_tag.length === 0 ||
           !validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        await ProcessoController.removeResponsavelByTag(request.params.usu_tag, pro_id)
        response.status(httpCodes.OK).json({ message: 'Responsável removido.'})
    }
    catch(error){
        logger.error('Erro ao remover responsável.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao remover responsável.'})
    }
}

export const getResponsaveis = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        const usuarios = await ProcessoController.getAllReponsaveis(pro_id)
        response.status(httpCodes.OK).json(usuarios.map(({ usu_tag }) => ({ usu_tag })))
    }
    catch(error){
        logger.error('Erro ao retornar responsáveis.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar responsáveis.'})
    }
}

// TODO: Experimental, retirar após testes
export const createAndamento = async (request: Request, response: Response) => {
    const pro_id = parseInt(request.params.pro_id)
    const { and_data } = request.body
    const andamento = { ...request.body, and_data}
    try {
        const createdAndamento = await AndamentoController.create({...andamento, pro_id })
        response.status(httpCodes.CREATED).json(createdAndamento)
    }
    catch(error){
        logger.error('Erro ao criar andamento.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar andamento.'})
    }
}

export const createTarefa = async (request: Request, response: Response) => {
    const tarefa = request.body
    try { 
        if(!validator.isInt(request.params.pro_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const pro_id = parseInt(request.params.pro_id)
        const novaTarefa = await ProcessoController.createTarefa({
            ...tarefa,
            tar_situacao: false,
            pro_id
        })
        response.status(httpCodes.CREATED).json(novaTarefa)
    }
    catch(error){
        logger.error('Erro ao criar tarefa.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else 
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar tarefa.'})
    }
}
