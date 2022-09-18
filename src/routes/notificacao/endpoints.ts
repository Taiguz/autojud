
import { AndamentoController, NotificacaoController, ProcessoController, TarefaController } from './../../controlers'
import { Request, Response } from "express"
import { httpCodes } from '../../utils/constants'
import logger from '../../utils/logger'
import validator from 'validator'
import { ValidationError } from 'sequelize'
import { buscarTarefasEmVencimento } from '../../notificador/notificadorTarefas'
import { Request as JWTRequest } from "express-jwt"
import { getUserID } from '../../utils/utils'

export const marcarComoLida = async (request: JWTRequest, response: Response) => {

    try { 
        const usu_id = getUserID(request)
        if(!validator.isInt(request.params.not_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const not_id = parseInt(request.params.not_id)
        await NotificacaoController.marcarVista(usu_id, not_id)
        response.status(httpCodes.OK).json({ message: 'ok' })
    }
    catch(error){
        logger.error('Erro ao marcar notificacao.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao marcar notificacao.'})
    }
}