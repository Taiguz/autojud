import { NextFunction, Request, Response } from "express"
import { Request as JWTRequest } from "express-jwt"
import { ValidationError } from "sequelize"
import validator from "validator"
import { NotificacaoController, UsuarioController } from "../../controlers"
import { Usuario } from "../../controlers/types"
import { decodeToken } from "../../controlers/usuarioController"
import { httpCodes } from '../../utils/constants'
import { AuthError, AuthErrorUnVerifiedAccount, AuthorizeError, CustomValidatorError } from "../../utils/erros"
import logger from '../../utils/logger'
import { getEmailTag, getEnv, getUserID } from "../../utils/utils"

const segredoVerificarEmail = getEnv('SECRET_VERIFY')

export const createUsuario = async (request: Request, response: Response) => {
    const  usuario = request.body
    const { usu_email, usu_nome } = usuario
    try { 
        if (usuario.usu_tag === undefined)
            usuario.usu_tag = getEmailTag(usu_email)

        const novoUsuario = await UsuarioController.create({ 
            usu_nome,
            usu_oab: usuario.usu_oab || 'AA888888',
            usu_email,
            usu_senha: usuario.usu_senha,
            usu_administrador: true,
            usu_tag: usuario.usu_tag,
        }, false)

        response.status(httpCodes.CREATED).json(novoUsuario)
    }
    catch(error){
        logger.error('Erro ao criar usuario.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else if(error instanceof CustomValidatorError){
            response.status(httpCodes.SERVER_ERROR).json({ message: error.message })
        }
        else response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar usuario.'})
    }
}

export const createUsuarioSubordinado = async (request: Request, response: Response) => {
    const usuario = request.body
    const { usu_email, usu_nome } = usuario
    try {
        if (usuario.usu_tag === undefined)
            usuario.usu_tag = getEmailTag(usu_email)

        const novoUsuario = await UsuarioController.create({
            usu_nome,
            usu_oab: usuario.usu_oab || 'AA888888',
            usu_email,
            usu_senha: usuario.usu_senha,
            usu_administrador: usuario.usu_administrador || false,
            usu_tag: usuario.usu_tag,
        })

        response.status(httpCodes.CREATED).json(novoUsuario)
    }
    catch (error) {
        logger.error('Erro ao criar usuario.', error)
        if (error instanceof ValidationError) {
            const message = error.errors.map(({ message }) => message).join(' ')
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else if (error instanceof CustomValidatorError) {
            response.status(httpCodes.SERVER_ERROR).json({ message: error.message })
        }
        else response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao criar usuario.' })
    }
}

export const getAllUsuario = async (request: JWTRequest, response: Response) => {
    try {
        const usuarios = await UsuarioController.getAll()
        const usu_id = request.auth?.usu_id
        if(usu_id === undefined) throw new Error('Sem autorização.')
        const isAdmin = await UsuarioController.isAdmin(usu_id)
        if(isAdmin)
            response.status(httpCodes.OK).json(usuarios)
        else
            response.status(httpCodes.OK).json(usuarios.map(({ usu_tag }) => ({ usu_tag })))
    }
    catch(error){
        logger.error('Erro ao retornar usuario.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar usuario.'})
    }
}

export const getAllUsuariosTags = async (request: Request, response: Response) => {
    try {
        const usuarios = await UsuarioController.getAllTags()
        response.status(httpCodes.OK).json(usuarios)
    }
    catch(error){
        logger.error('Erro ao retornar usuario.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar usuario.'})
    }
}

export const deletarUsuario = async (request: JWTRequest, response: Response) => {
    try {
        if(!validator.isInt(request.params.usu_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const usu_id = parseInt(request.params.usu_id)
        const user = request.auth?.usu_id
        if(usu_id === user)
            return response.status(httpCodes.SERVER_ERROR).json({ message: 'Não é possível deletar seu próprio usuário.' })
        await UsuarioController.remove(usu_id)
        response.status(httpCodes.OK).json({ message: 'Usuário deletado.'})
    }
    catch(error){
        logger.error('Erro ao deletar usuario.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao deletar usuario.'})
    }
}

export const atualizarUsuario = async (request: Request, response: Response) => {
    const { usu_id, usu_tag, usu_oab, usu_administrador } = request.body
    try {
        await UsuarioController.update({ usu_id, usu_tag, usu_oab, usu_administrador })
        response.status(httpCodes.OK).json({ message: 'Usuário atualizado.'})
    }
    catch(error){
        logger.error('Erro ao atualizar usuario.', error)
        if(error instanceof ValidationError){
            const message = error.errors.map(({message}) => message).join(' ') 
            response.status(httpCodes.SERVER_ERROR).json({ message })
        }
        else if(error instanceof CustomValidatorError){
            response.status(httpCodes.SERVER_ERROR).json({ message: error.message })
        }
        else response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao atualizar usuario.'})
    }
}

export const getCurrentUsuario = async (request: Request, response: Response) => {
    try {
        
        const user_id = getUserID(request)

        const usuario = await UsuarioController.get(user_id)

        if(usuario === null)
            throw new Error('Usuário não existe.')
        
        response.status(httpCodes.OK).json(usuario)
    }
    catch(error){
        logger.error('Erro ao retornar usuário.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar usuário.'})
    }
}

export const getUsuario = async (request: JWTRequest, response: Response) => {
    try {
        let isUsuId = false
        if(validator.isInt(request.params.usu_id, { min: 1, allow_leading_zeroes: false}))
            isUsuId = true
        if(!isUsuId && !validator.isAlphanumeric(request.params.usu_id) && !validator.isLength(request.params.usu_id, { min: 4, max: 20}))
            throw new Error('Tag de usuário inválida.')

        const usu_id = request.auth?.usu_id
        if(usu_id === undefined) throw new Error('Sem autorização.')
        const isAdmin = await UsuarioController.isAdmin(usu_id)
        if(isUsuId && usu_id !== parseInt(request.params.usu_id) && !isAdmin)
            throw new AuthorizeError('Sem autorização.')
        else if(!isUsuId){
            const { usu_tag } = await UsuarioController.getInstance(usu_id)
            if(usu_tag !== request.params.usu_id && !isAdmin)
                throw new AuthorizeError('Sem autorização.')
        }
    
        let usuario: Usuario | null
        if(isUsuId)
            usuario = await UsuarioController.get(parseInt(request.params.usu_id))
        else{
            usuario = await UsuarioController.getByTag(request.params.usu_id)
        }

        if(usuario === null)
            throw new Error('Usuário não existe.')
        
        response.status(httpCodes.OK).json(usuario)
    }
    catch(error){
        logger.error('Erro ao retornar usuário.', error)
        if(error instanceof AuthorizeError)
            response.status(httpCodes.UNAUTHORIZED).json({ message: 'Sem permissões necessárias.'})
        else
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar usuário.'})
    }
}

export const verificarToken = async (request: Request, response: Response) => {
    try {
        const { usu_id } = await decodeToken(request.params.token, segredoVerificarEmail)
        const isAdmin = await UsuarioController.isAdmin(usu_id)
        if (!isAdmin) throw new Error('Sem permissões necessárias.')
        await UsuarioController.update({ usu_id, usu_verificado: true })
        response.status(httpCodes.OK).json({ message: 'Conta verificada! Sua senha foi alterada com sucesso.' })
    }
    catch (error) {
        logger.error('Erro ao verificar usuário.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao verificar usuário.' })
    }
}

export const verificarUsuarioTrocarSenha = async (request: Request, response: Response) => {
    try {
        const { senha_atual, nova_senha } = request.body
        if(!validator.isJWT(request.params.token) ||
           !validator.isStrongPassword(senha_atual, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}) ||
           !validator.isStrongPassword(nova_senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const { usu_id } = await decodeToken(request.params.token, segredoVerificarEmail)
        await UsuarioController.changePassword(usu_id, senha_atual, nova_senha)
        response.status(httpCodes.OK).json({ message: 'Conta verificada! Sua senha foi alterada com sucesso.'})
    }
    catch(error){
        logger.error('Erro ao verificar usuário.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao verificar usuário.'})
    }
}

export const alterarSenha = async (request: JWTRequest, response: Response) => {
    try {
        const { senha_atual, nova_senha } = request.body
        if(!validator.isStrongPassword(nova_senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const usu_id = getUserID(request)
        await UsuarioController.changePassword(usu_id, senha_atual, nova_senha)
        response.status(httpCodes.OK).json({ message: 'Sua senha foi alterada com sucesso.'})
    }
    catch(error){
        logger.error('Erro ao alterar senha.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao alterar senha. Verifique se a senha informada está correta.'})
    }
}

export const autenticarUsuario = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body
        if(validator.isEmpty(email) || validator.isEmpty(password))
            throw new Error('Parâmetros de requisição inválidos.')
        const token = await UsuarioController.authenticate(email, password)
        response.status(httpCodes.OK).json({ token })
    }
    catch(error){
        if(error instanceof AuthError){
            logger.error('Erro autenticando o usuário. Usuário ou senha inválidos.', error)
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Usuário ou senha inválidos.'})
        }
        else if(error instanceof AuthErrorUnVerifiedAccount){
            logger.error('Conta não verificada.', error)
            response.status(httpCodes.SERVER_ERROR).json({ message: 'Conta não verificada. Por favor verifique sua conta usando o link de validação enviado para seu email.'})
        }
        else{
            logger.error('Erro autenticando o usuário.', error)
            response.status(httpCodes.INTERNAL_ERROR).json({ message: 'Erro ao autenticar usuário.'})
        }
    }
}

export const getProcessosResponsabilidade = async (request: JWTRequest, response: Response) => {
    try {
        let usu_id: number

        if(validator.isInt(request.params.usu_id || '', { min: 1, allow_leading_zeroes: false}))
            usu_id = parseInt(request.params.usu_id)
        else
            usu_id = getUserID(request)

        const processos = await UsuarioController.getAllProcessosSobreResponsabilidade(usu_id)
        response.status(httpCodes.OK).json(processos)
    }
    catch(error){
        logger.error('Erro ao retornar processos sobre responsabilidade.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar processos sobre responsabilidade.'})
    }
}

export const getTarefasResponsabilidade = async (request: JWTRequest, response: Response) => {
    try {
        let usu_id: number

        if(validator.isInt(request.params.usu_id || '', { min: 1, allow_leading_zeroes: false}))
            usu_id = parseInt(request.params.usu_id)
        else
            usu_id = getUserID(request)

        const tarefas = await UsuarioController.getAllTarefasSobreResponsabilidade(usu_id)
        response.status(httpCodes.OK).json(tarefas)
    }
    catch(error){
        logger.error('Erro ao retornar tarefas sobre responsabilidade.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar tarefas sobre responsabilidade.'})
    }
}

export const getNotificacoesNaoVistas = async (request: JWTRequest, response: Response) => {
    try {
        const usu_id = getUserID(request)

        const notificacoes = await NotificacaoController.getAllNotSeenUserNotifications(usu_id)
        response.status(httpCodes.OK).json(notificacoes)
    }
    catch(error){
        logger.error('Erro ao retornar notificacoes do usuário.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar notificações do usuário.'})
    }
}

// Middlewares internos

export const checkIsAdmin = async (request: JWTRequest, response: Response, next: NextFunction) => {
    try {
        const usu_id = request.auth?.usu_id
        if(usu_id === undefined) throw new Error('Sem autorização.')
        const isAdmin = await UsuarioController.isAdmin(usu_id)
        if(isAdmin)
            next()
        else response.status(httpCodes.UNAUTHORIZED).json({ message: "Sem permissões necessárias." })
    }
    catch(error){
        logger.error('Erro checando permissões.', error)
        response.status(httpCodes.INTERNAL_ERROR).json({ message: 'Erro checando permissões.'})
    }
}

export const sameUser = async (request: JWTRequest, response: Response, next: NextFunction) => {
    try {
        if(!validator.isInt(request.params.usu_id || request.body.usu_id + '', { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const usu_id = request.auth?.usu_id
        const provided_usu_id = parseInt(request.params.usu_id || request.body.usu_id)
        if(usu_id === undefined) throw new Error('Sem autorização.')
        const isAdmin = await UsuarioController.isAdmin(usu_id)
        if(isAdmin || usu_id === provided_usu_id)
            next()
        else response.status(httpCodes.UNAUTHORIZED).json({ message: "Sem permissões necessárias." })
    }
    catch(error){
        logger.error('Erro checando permissões.', error)
        response.status(httpCodes.UNAUTHORIZED).json({ message: 'Erro checando permissões.'})
    }
}