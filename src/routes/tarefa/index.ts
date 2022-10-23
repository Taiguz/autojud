import express from 'express'
import * as TarefaEndpoints from './endpoints'
import { expressjwt as jwt } from 'express-jwt'
import { getEnv } from '../../utils/utils'
import { CheckAuthorize } from '../common'
const router = express.Router()

const secret = getEnv('SECRET')
// Endpoint /tarefa
router.get('/buscar', TarefaEndpoints.buscarTarefasVencimento)
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)
router.get('/:tar_id', TarefaEndpoints.getTarefa)
router.post('/:tar_id', TarefaEndpoints.createSubtarefa)
router.get('/:tar_id/subtarefas', TarefaEndpoints.getAllSubtarefas)
router.delete('/:tar_id', TarefaEndpoints.deletarTarefa)
router.put('/', TarefaEndpoints.atualizarTarefa)

// Responsaveis
router.get('/:tar_id/responsavel', TarefaEndpoints.getResponsaveis)
router.post('/:tar_id/responsavel', TarefaEndpoints.addResponsavel)
router.delete('/:tar_id/responsavel/:usu_tag', TarefaEndpoints.removeResponsavel)

export default router
