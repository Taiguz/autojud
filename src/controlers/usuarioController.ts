import { modelProcessoResponsavel, modelTarefaResponsavel, modelUsuario } from '../models'
import { ModelUsuario } from '../models/types'
import { getEnv, sanitizeObject } from '../utils/utils'
import { CreateUsuario, EditarUsuario, Processo, Tarefa, Usuario } from './types'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import logger from '../utils/logger'
import { AuthError, AuthErrorUnVerifiedAccount, CustomValidatorError } from '../utils/erros'
import validator from 'validator'
import { mail } from '../mail'
import { ProcessoController, TarefaController } from '.'


// All functions here are expected to throw erros
//  should ne handled by the caller
const attributes = ['usu_id', 'usu_tag', 'usu_email', 'usu_oab', 'usu_verificado', 'usu_administrador'] // TODO: Limitar as informações que usuários normais tem acesso
const attributesExtended = ['usu_id', 'usu_tag', 'usu_email', 'usu_oab', 'usu_administrador', 'usu_verificado']
const saltRounds = 12

const segredo = getEnv('SECRET')
const segredoVerificarEmail = getEnv('SECRET_VERIFY')
const appHostname = getEnv("APP_HOSTNAME")
const appName = getEnv("APP_NAME")

// TODO: criaçao de usuarios administradores
export const create = async (usuario: CreateUsuario): Promise<Usuario> => {
    const {usu_senha} = usuario
    // usu_senha é uma coluna excepcional que validarei aqui
    // de resto os campos serão validados já nos models
    // tirando a necessidade de validar nos próprios endpoints
    if(validator.isEmpty(usu_senha))
        throw new CustomValidatorError('A senha do usuário não pode ser vazia.')
    else if(!validator.isLength(usu_senha, { min:8, max:20 }))
        throw new CustomValidatorError('A senha do usuário deve conter de 8 a 20 caracteres.')
    else if (!validator.isStrongPassword(usu_senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}))
        throw new CustomValidatorError('A senha do usuário não possui o formato adequado.')
    const senha = await getHashedPassword(usuario.usu_senha)
    const novoUsuario = {...usuario, usu_senha: senha, usu_verificado: false}
    const createdUsuario = await modelUsuario.create(novoUsuario)
    sendVerificationEmail(createdUsuario)
    return sanitizeObject(createdUsuario.get(), attributes)
}

// Can return undefined if not found
export const get = async (usu_id: number): Promise<Usuario | null> => {
    const usuario = await modelUsuario.findByPk(usu_id, { attributes })
    return usuario ? usuario.get() : null
}

export const getExtended = async (usu_id: number): Promise<Usuario | null> => {
    const usuario = await modelUsuario.findByPk(usu_id, { attributes: attributesExtended })
    return usuario ? usuario.get() : null
}


export const getByTag = async (usu_tag: string): Promise<Usuario | null> => {
    const usuario = await modelUsuario.findOne({ where: { usu_tag }, attributes })
    return usuario ? usuario.get() : null
}

export const getByTagExtended = async (usu_tag: string): Promise<Usuario | null> => {
    const usuario = await modelUsuario.findOne({ where: { usu_tag }, attributes: attributesExtended })
    return usuario ? usuario.get() : null
}

export const getUsuarios = async (usu_id: number[]): Promise<Usuario[]> => {
    const usuarios = await modelUsuario.findAll({ where: { usu_id }, attributes})
    return usuarios.map(usuario => usuario.get())
}

export const getInstance = async (usu_id: number): Promise<ModelUsuario> => {
    const usuario = await modelUsuario.findByPk(usu_id)
    if(usuario === null)
        throw new Error('Usuário não existe.')
    return usuario
}

export const getInstanceByTag = async (usu_tag: string): Promise<ModelUsuario> => {
    const usuario = await modelUsuario.findOne({ where: { usu_tag }})
    if(usuario === null)
        throw new Error('Usuário não existe.')
    return usuario
}

export const getInstancesByTag = async (usu_tag: string[]): Promise<ModelUsuario[]> => {
    const usuario = await modelUsuario.findAll({ where: { usu_tag }})
    if(usuario.length === 0)
        throw new Error('Nenhum usuário encontrado.')
    return usuario
}

export const getAllProcessosSobreResponsabilidade = async (usu_id: number): Promise<Processo[]> => {
    const responsaveis = await modelProcessoResponsavel.findAll({ where: { usu_id } })
    const processosResponsabilidade = responsaveis.map(({ pro_id }) => pro_id)
    const processos = await ProcessoController.getProcessos(processosResponsabilidade)
    return processos
}

export const getAllTarefasSobreResponsabilidade = async (usu_id: number): Promise<Tarefa[]> => {
    const responsaveis = await modelTarefaResponsavel.findAll({ where: { usu_id } })
    const tarefaResponsabilidade = responsaveis.map(({ tar_id }) => tar_id)
    const tarefas = await TarefaController.getTarefas(tarefaResponsabilidade)
    for(const tarefa of tarefas)
        tarefa.processo = await ProcessoController.get(tarefa.pro_id)
    return tarefas
}

const getInstanceByEmail = async (usu_email: string): Promise<ModelUsuario | null> => {
    const usuario = await modelUsuario.findOne({ where: { usu_email }})
    return usuario
}

export const update = async (usuario: EditarUsuario) => {
    const { usu_id, usu_senha } = usuario
    if(usu_senha && usuario.usu_senha){ // satisfy typescript
        if(validator.isEmpty(usu_senha))
            throw new CustomValidatorError('O campo senha não pode ser vazio.')
        else if(!validator.isLength(usu_senha, { min:8, max:20 }))
            throw new CustomValidatorError('O campo senha deve conter de 8 a 20 caracteres.')
        else if (!validator.isStrongPassword(usu_senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false}))
            throw new CustomValidatorError('O campo senha não possui o formato adequado.')
        const senha = await getHashedPassword(usuario.usu_senha)
        usuario.usu_senha = senha
    }
    const usuarioExistente = await getInstance(usu_id)
    await usuarioExistente.update(usuario)
    await usuarioExistente.save()
}

export const remove = async (usu_id: number) => {
    const usuarioExistente = await getInstance(usu_id)
    await usuarioExistente.destroy()
}

export const getAll = async (): Promise<Usuario[]> => {
    const usuarios = await modelUsuario.findAll({ attributes })
    return usuarios.map(usuario => usuario.get())
}

export const getAllTags = async (): Promise<{ usu_tag: string }[]> => {
    const usuarios = await modelUsuario.findAll({ attributes: ['usu_tag'] })
    return usuarios.map(({ usu_tag }) => ({ usu_tag }))
}

export const authenticate = async (email: string, password: string): Promise<string> => {
    const usuario = await getInstanceByEmail(email)
    if(usuario === null)
        throw new AuthError('Conta não existe.')
    const isPasswordValid = await bcrypt.compare(password, usuario.usu_senha)
    if(!isPasswordValid)
        throw new AuthError('Senha inváldia.')
    if(!usuario.usu_verificado)
        throw new AuthErrorUnVerifiedAccount('Conta não verificada.')
    const token = await authenticateUser(usuario)
    return token
}

export const isAdmin = async (usu_id: number): Promise<boolean> => {
    const usuario = await modelUsuario.findByPk(usu_id)
    if(usuario === null)
        throw new Error('Usuário não existe.')
    return usuario.usu_administrador
}

const getHashedPassword = async (plainPassword: string): Promise<string> => {
    const password = await bcrypt.hash(plainPassword, saltRounds)
    return password
}

const authenticateUser = async (usuario: ModelUsuario, expiracao: string = '7d', secret: string = segredo): Promise<string> => {
    return new Promise((resolve, reject) => {
        const { usu_id } = usuario
        const token = jwt.sign({ usu_id  }, secret, { algorithm: 'HS512', expiresIn: expiracao }, (erro, token) => {
            if(token)
                resolve(token)
            else{
                logger.error("Erro gerando token.", erro)
                reject(erro)
            }
        });
    })
}


export const decodeToken = async (token: string, secret: string = segredo): Promise<JwtPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret , function(erro, decoded) {
            if(decoded) {
                resolve(decoded as JwtPayload)
            }
            else{
                logger.error("Token inválido.", erro)
                reject(erro)
            }
          });
    })
}

const sendVerificationEmail = async (createdUsuario: ModelUsuario) => {
    const token = await authenticateUser(createdUsuario, '2d', segredoVerificarEmail)
    const txt = `
        <h1>Bem vindo, ${createdUsuario.usu_tag}!</h1>
        <p>Para começar, verifique sua conta trocando a sua senha no link abaixo.</p>
        <a href="${appHostname}/verify/${token}" target="_blank">
        <button
            style="
            background-color: #b8b8b8;
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 8px;
            margin-bottom: 5px;
            martin-top: 5px;
            cursor: pointer;
            "
        >Verificar conta</button>
        </a>
        <p>Bom trabalho!</p>
        <p>Equipe ${appName}.</p>
    `
    mail(createdUsuario.usu_email, 'Bem vindo! Verifique sua conta para começar!', txt)

}

export const changePassword = async (usu_id: number, senhaAntiga: string, senhaNova: string): Promise<void> => {
    const usuario = await getInstance(usu_id)

    const isPasswordValid = await bcrypt.compare(senhaAntiga, usuario.usu_senha)

    if(!isPasswordValid)
        throw new AuthError('Senha inválida.')

    const novaSenhaHashed = await getHashedPassword(senhaNova)

    if(!usuario.usu_verificado) 
        await usuario.update({usu_senha: novaSenhaHashed, usu_verificado: true})
    else
        await usuario.update({usu_senha: novaSenhaHashed})
    
    await usuario.save()
}
