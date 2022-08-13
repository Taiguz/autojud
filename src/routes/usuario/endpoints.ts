import { NextFunction, Request, Response } from "express"
import { Request as JWTRequest } from "express-jwt"
import { ValidationError } from "sequelize"
import validator from "validator"
import { UsuarioController } from "../../controlers"
import { decodeToken } from "../../controlers/usuarioController"
import { httpCodes } from '../../utils/constants'
import { AuthError, AuthErrorUnVerifiedAccount, CustomValidatorError } from "../../utils/erros"
import logger from '../../utils/logger'
import { getEmailTag, getEnv, getUserID } from "../../utils/utils"

const segredoVerificarEmail = getEnv('SECRET_VERIFY')

export const createUsuario = async (request: Request, response: Response) => {
    const  usuario = request.body
    const { usu_tag, usu_email } = usuario
    try { 
        if(usu_tag === undefined)
            usuario.usu_tag = getEmailTag(usu_email)
        const novoUsuario = await UsuarioController.create(usuario)
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

export const getAllUsuario = async (request: Request, response: Response) => {
    try {
        const usuarios = await UsuarioController.getAll()
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
    const usuario = request.body
    try {
        await UsuarioController.update(usuario)
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

export const getUsuario = async (request: Request, response: Response) => {
    try {
        if(!validator.isInt(request.params.usu_id, { min: 1, allow_leading_zeroes: false}))
            throw new Error('Parâmetros de requisição inválidos.')
        const usu_id = parseInt(request.params.usu_id)
        const usuario = await UsuarioController.get(usu_id)
        if (usuario !== null)
            response.status(httpCodes.OK).json(usuario)
        else
            response.status(httpCodes.SERVER_ERROR).json({message: 'Usuário não existe.'})
    }
    catch(error){
        logger.error('Erro ao retornar usuário.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar usuário.'})
    }
}

export const verificarUsuarioTrocarSenha = async (request: Request, response: Response) => {
    try {
        const { senha_atual, nova_senha } = request.body
        if(!validator.isJWT(request.params.token) ||
           !validator.isStrongPassword(senha_atual, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1}) ||
           !validator.isStrongPassword(nova_senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1}))
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
        const usu_id = getUserID(request)
        const processos = await UsuarioController.getAllProcessosSobreResponsabilidade(usu_id)
        response.status(httpCodes.OK).json(processos)
    }
    catch(error){
        logger.error('Erro ao retornar processos sobre responsabilidade.', error)
        response.status(httpCodes.SERVER_ERROR).json({ message: 'Erro ao retornar processos sobre responsabilidade.'})
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
        response.status(httpCodes.INTERNAL_ERROR).json({ message: 'Erro checando permissões.'})
    }
}