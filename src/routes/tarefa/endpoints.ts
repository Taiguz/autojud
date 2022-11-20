
import { AndamentoController, ProcessoController, TarefaController } from './../../controlers'
import { Request, Response } from "express"
import { httpCodes } from '../../utils/constants'
import logger from '../../utils/logger'
import validator from 'validator'
import { ValidationError } from 'sequelize'
import { buscarTarefasEmVencimento } from '../../notificador/notificadorTarefas'
import { CustomValidatorError } from '../../utils/erros'

export const createSubtarefa = async (request: Request, response: Response) => {
    const tarefa = request.body
    try { 
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        const novaSubtarefa = await TarefaController.createSubtarefa({
            ...tarefa,
            tar_id,
            tar_situacao: false,
        })
        response.status(httpCodes.CREATED).json(novaSubtarefa)
    }
    catch(error){
        logger.error('Erro ao criar subtarefa.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else if(error instanceof CustomValidatorError){
            response.status(httpCodes.SERVER_ERROR).json({ message: error.message })
        }
        else 
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar subtarefa.'})
    }
}
export const getTarefa = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
                throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        const tarefa = await TarefaController.get(tar_id)
        response.status(httpCodes.OK).json(tarefa)
    }
    catch(error){
        logger.error('Erro ao retornar tarefa.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar tarefa.'})
    }
}

export const deletarTarefa = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        await TarefaController.remove(tar_id)
        response.status(httpCodes.OK).json({ message: 'Tarefa deletada.'})
    }
    catch(error){
        logger.error('Erro ao deletar tarefa.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao deletar tarefa.'})
    }
}

export const atualizarTarefa = async (request: Request, response: Response) => {
    const tarefa = request.body
    try {
        await TarefaController.update(tarefa)
        response.status(httpCodes.OK).json({ message: 'Tarefa atualizada.' })
    }
    catch(error){
        logger.error('Erro ao atualizar tarefa.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else if(error instanceof CustomValidatorError){
            response.status(httpCodes.SERVER_ERROR).json({ message: error.message })
        }
        else response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao atualizar tarefa.'})
    }
}


export const getAllSubtarefas = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        const subtarefas = await TarefaController.getAllSubtarefas(tar_id)
        response.status(httpCodes.OK).json(subtarefas)
    }
    catch(error){
        logger.error('Erro ao retornar subtarefas.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar subtarefas.'})
    }
}

export const addResponsavel = async (request: Request, response: Response) => {
    try {
        const { usu_tag } = request.body
        if(!Array.isArray(usu_tag) || usu_tag.length === 0 || usu_tag.length > 20 ||
        !validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        await TarefaController.addResponsaveisByTag(usu_tag, tar_id)
        response.status(httpCodes.CREATED).json({ message: 'Responsáveis adicionados.'})
    }
    catch(error){
        logger.error('Erro ao adicionar responsáveis.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao adicionar responsáveis.'})
    }
}

export const removeResponsavel= async (request: Request, response: Response) => {
    try {
        if(request.params.usu_tag.length === 0 ||
           !validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        await TarefaController.removeResponsavelByTag(request.params.usu_tag, tar_id)
        response.status(httpCodes.OK).json({ message: 'Responsável removido.'})
    }
    catch(error){
        logger.error('Erro ao remover responsável.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao remover responsável.'})
    }
}

export const getResponsaveis = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        const usuarios = await TarefaController.getAllReponsaveis(tar_id)
        response.status(httpCodes.OK).json(usuarios.map(({ usu_tag }) => ({ usu_tag })))
    }
    catch(error){
        logger.error('Erro ao retornar responsáveis.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar responsáveis.'})
    }
}

export const getSubtarefas = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.tar_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const tar_id = parseInt(request.params.tar_id)
        const tarefas = await TarefaController.getAllSubtarefas(tar_id)
        response.status(httpCodes.OK).json(tarefas)
    }
    catch(error){
        logger.error('Erro ao retornar subtarefas.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar subtarefas.'})
    }
}

// TODO: Somente pare debug, remover depois
export const buscarTarefasVencimento = async (request: Request, response: Response) => {
    try {
        buscarTarefasEmVencimento()
        response.status(httpCodes.OK).json({ message: 'buscando tarefas...'})
    }
    catch(error){
        logger.error('Erro ao buscar tarefas.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao buscar tarefas.'})
    }
}
