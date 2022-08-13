import express, { Request, Response} from 'express'
import { buscaPeriodicaAndamentos } from '../../buscador'
import { httpCodes } from '../../utils/constants'
const router = express.Router()

// Endpoint /root


const buscarAndamentos = async (request: Request, response: Response) => {
    buscaPeriodicaAndamentos()
    response.status(httpCodes.OK).json({ message: 'Buscando novos andamentos...'})
}

router.get('/buscar-andamentos', buscarAndamentos)

export default router