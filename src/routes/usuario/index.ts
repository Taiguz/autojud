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
router.get('/tarefas', UsuarioEndpoints.getTarefasResponsabilidade)
router.get('/notificacoes', UsuarioEndpoints.getNotificacoesNaoVistas)
router.get('/:usu_id/processos', UsuarioEndpoints.getProcessosResponsabilidade)
router.get('/:usu_id/tarefas', UsuarioEndpoints.getTarefasResponsabilidade)

router.get('/', UsuarioEndpoints.getAllUsuario)
router.get('/me', UsuarioEndpoints.getCurrentUsuario)
router.get('/:usu_id', UsuarioEndpoints.getUsuario)

// Somente admins
router.use(UsuarioEndpoints.checkIsAdmin)
router.post('/', checkBodyParameters(['usu_email', 'usu_senha', 'usu_oab']), UsuarioEndpoints.createUsuario)
router.delete('/:usu_id', UsuarioEndpoints.deletarUsuario)
router.put('/', UsuarioEndpoints.atualizarUsuario)

export default router