import express from 'express'
import logger from '../../utils/logger'
import { CheckAuthorize, checkBodyParameters } from '../common'
import { expressjwt as jwt } from 'express-jwt'
import * as UsuarioEndpoints from './endpoints'
import { getEnv } from '../../utils/utils'
import { isAdmin } from '../../controlers/usuarioController'
const router = express.Router()

const secret = getEnv('SECRET')

// Endpoint /usuario

router.post('/login', checkBodyParameters(['email', 'password']), UsuarioEndpoints.autenticarUsuario)
router.post('/verify/:token', checkBodyParameters(['senha_atual', 'nova_senha']), UsuarioEndpoints.verificarUsuarioTrocarSenha)

// Logado
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)

// Somente o próprio usuário
router.get('/processos', UsuarioEndpoints.getProcessosResponsabilidade)

// Somente admins
router.use(UsuarioEndpoints.checkIsAdmin)
router.get('/', UsuarioEndpoints.getAllUsuario)
router.post('/', checkBodyParameters(['usu_email', 'usu_senha', 'usu_oab']), UsuarioEndpoints.createUsuario)
router.get('/:usu_id', UsuarioEndpoints.getUsuario)
router.delete('/:usu_id', UsuarioEndpoints.deletarUsuario)
router.put('/', UsuarioEndpoints.atualizarUsuario)

export default router