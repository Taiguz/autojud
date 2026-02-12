import express, { Request, Response } from 'express'
import { buscarTarefasEmVencimento } from "../../notificador/notificadorTarefas";
import { httpCodes } from '../../utils/constants'
const router = express.Router()

// Endpoint /root


//const buscarAndamentos = async (request: Request, response: Response) => {
//buscaPeriodicaAndamentos()
//response.status(httpCodes.OK).json({ message: 'Atualizando andamentos...'})
//}

//const buscarTarefas = async (request: Request, response: Response) => {
//buscarTarefasEmVencimento()
//response.status(httpCodes.OK).json({ message: 'Atualizando tarefas em vencimento...'})
//}

//router.get('/att-andamentos', buscarAndamentos)
//router.get('/att-tarefas', buscarTarefas)

export default router