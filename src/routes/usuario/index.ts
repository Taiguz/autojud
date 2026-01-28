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
router.post('/', checkBodyParameters(['usu_email', 'usu_senha', 'usu_nome']), UsuarioEndpoints.createUsuario)

// Logado
router.use(jwt({ secret , algorithms: ["HS512"] }), CheckAuthorize)

// Somente o próprio usuário
router.get('/processos', UsuarioEndpoints.getProcessosResponsabilidade)
router.get('/tarefas', UsuarioEndpoints.getTarefasResponsabilidade)
router.get('/notificacoes', UsuarioEndpoints.getNotificacoesNaoVistas)
router.get('/me', UsuarioEndpoints.getCurrentUsuario)
router.get('/', UsuarioEndpoints.getAllUsuario) // Caso não for admin, retorna somente as tags de usuário
router.post('/alterar-senha', checkBodyParameters(['senha_atual', 'nova_senha']), UsuarioEndpoints.alterarSenha)

//Permitido para o próprio usuário, caso contrário, somente admin
router.get('/:usu_id', UsuarioEndpoints.getUsuario) // Permitido para o 
router.get('/:usu_id/processos', UsuarioEndpoints.sameUser, UsuarioEndpoints.getProcessosResponsabilidade)
router.get('/:usu_id/tarefas', UsuarioEndpoints.sameUser, UsuarioEndpoints.getTarefasResponsabilidade)

// Somente admins
router.use(UsuarioEndpoints.checkIsAdmin)
router.delete('/:usu_id', UsuarioEndpoints.deletarUsuario)
router.put('/', UsuarioEndpoints.atualizarUsuario)

export default router