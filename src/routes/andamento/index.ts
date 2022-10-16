import express from 'express'
import * as AndamentoEndpoints from './endpoints'
import { expressjwt as jwt } from 'express-jwt'
import { getEnv } from '../../utils/utils'
import { CheckAuthorize } from '../common'
const router = express.Router()

const secret = getEnv('SECRET')
// Endpoint /processo
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)
router.get('/:and_id', AndamentoEndpoints.getAndamento)

export default router
