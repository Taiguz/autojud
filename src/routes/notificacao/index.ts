import express from 'express'
import * as NotificacaoEndpoints from './endpoints'
import { expressjwt as jwt } from 'express-jwt'
import { getEnv } from '../../utils/utils'
import { CheckAuthorize } from '../common'
const router = express.Router()

const secret = getEnv('SECRET')
// Endpoint /tarefa
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)
router.put('/:not_id', NotificacaoEndpoints.marcarComoLida)

export default router
