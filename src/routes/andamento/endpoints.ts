import { Request, Response } from "express"
import validator from "validator"
import { AndamentoController } from "../../controlers"
import { httpCodes } from "../../utils/constants"
import logger from "../../utils/logger"

export const getAndamento = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.and_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros da requisição inválidos.')
        const and_id = parseInt(request.params.and_id)
        const andamento = await AndamentoController.get(and_id)
        response.status(httpCodes.OK).json(andamento)
    }
    catch(error){
        logger.error('Erro ao retornar andamento.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar processo.'})
    }
}