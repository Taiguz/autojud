import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { httpCodes } from "../../utils/constants"
import { assertOb } from "../../utils/utils"
import { expressjwt } from "express-jwt"
import logger from "../../utils/logger"

// Common middlewares

export const checkBodyParameters = (attributes: string[]) => {
    const middleware = async (request: Request, response: Response, next: NextFunction) => {
        const ob: any = {}
        attributes.forEach(att => ob[att] = true)
        if(!assertOb(request.body, ob))
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Parâmetros inválidos.' })
        else next()
    }
    return middleware
}

export const CheckAuthorize = (error: ErrorRequestHandler, request: Request, response: Response, next: NextFunction) => {
    if (error.name === "UnauthorizedError") {
        logger.error('Token inválido.')
        response.status(httpCodes.UNAUTHORIZED).json({ message: 'Login inválido.'});
    } else {
        next(error);
    }
}