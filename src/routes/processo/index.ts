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
router.delete('/:pro_id', ProcessoEndpoints.deletarProcesso)
router.post('/', ProcessoEndpoints.createProcesso)
router.put('/', ProcessoEndpoints.atualizarProcesso)
router.get('/:pro_id/andamentos/:start_and_data', ProcessoEndpoints.getAndamentos)
router.get('/:pro_id/buscando-andamentos', ProcessoEndpoints.buscandoAndamentos)
// Responsaveis
router.get('/:pro_id/responsavel', ProcessoEndpoints.getResponsaveis)
router.post('/:pro_id/responsavel', ProcessoEndpoints.addResponsaveisProcessoByTag)
router.delete('/:pro_id/responsavel/:usu_tag', ProcessoEndpoints.removeResponsavelProcesso)
// Tarefas
router.post('/:pro_id/tarefa', ProcessoEndpoints.createTarefa)
router.get('/:pro_id/tarefa', ProcessoEndpoints.getTarefas)

export default router
