import express from 'express'
import * as ProcessoEndpoints from './endpoints'
import * as TarefaEndpoints from './../tarefa/endpoints'
import { expressjwt as jwt } from 'express-jwt'
import { getEnv } from '../../utils/utils'
import { CheckAuthorize } from '../common'
const router = express.Router()

const secret = getEnv('SECRET')
// Endpoint /processo
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)
router.get('/', ProcessoEndpoints.getAllProcessos)
router.get('/:pro_id', ProcessoEndpoints.getProcesso)
router.get('/:pro_id/andamentos/:start_and_id', ProcessoEndpoints.getAndamentos)
router.post('/:pro_id/andamentos', ProcessoEndpoints.createAndamento)
router.post('/:pro_id/responsavel', ProcessoEndpoints.addResponsavelProcesso)
router.get('/:pro_id/responsavel', ProcessoEndpoints.getResponsaveis)
router.delete('/:pro_id/responsavel/:usu_id', ProcessoEndpoints.removeResponsavelProcesso)
router.delete('/:pro_id', ProcessoEndpoints.deletarProcesso)
router.post('/', ProcessoEndpoints.createProcesso)
router.put('/', ProcessoEndpoints.atualizarProcesso)
router.post('/:pro_id/tarefa', ProcessoEndpoints.createTarefa)
router.get('/:pro_id/tarefa', ProcessoEndpoints.getTarefas)

export default router
