import express, { Request, Response, NextFunction } from "express"
import * as CallbackEndpoints from "./endpoints"
import { getEnv } from "../../utils/utils"
import { httpCodes } from "../../utils/constants"

const router = express.Router()
const callbackToken = getEnv("TOKEN_CALLBACK")

const checkCallbackToken = (request: Request, response: Response, next: NextFunction) => {
    const authorization = request.headers.authorization
    const token = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : authorization?.trim()

    if (!token || token !== callbackToken) {
        response.status(httpCodes.UNAUTHORIZED).json({ message: "Não autorizado." })
        return
    }

    next()
}

router.post("/", checkCallbackToken, CallbackEndpoints.receberCallback)

export default router
