import { Request } from "express-jwt"
import { Andamento, CreateAndamento } from "../../controlers/types"
import logger from "../logger"

export const sanitizeObject = (ob: any, attributes: string[], include: boolean = true) => {
    if(include)
        Object.keys(ob).forEach(key => {
            if(!attributes.includes(key))
                delete ob[key]
        })
    else
        attributes.forEach(att => delete ob[att])
    return ob
}

export const getEmailTag = (email: string): string => {
    return email.split('@')[0]
}

export const assertOb = (ob: any, attributes: any): boolean => {
    const keys = Object.keys(ob)
    // garantir que todos os atributos estao no objeto e nao sao null ou undefined
    for(let index = 0; index < keys.length; index++){
        if(attributes[keys[index]] === undefined) continue
        if(ob[keys[index]] === undefined) return false
        if(ob[keys[index]] === null) return false
        delete attributes[keys[index]]
    }
    return Object.keys(attributes).length === 0
}

export const getEnv = (prop: string): string => {
    const env = process.env[prop]
    if(env === undefined){
        logger.error(`${prop} deve ser definido. Saindo...`)
        console.log(`${prop} deve ser definido.`)
        process.exit(-1)
    }
    else 
        return env
}

export const isProductionEnv = (): Boolean => {
    if(process.env.NODE_ENV === 'production')
        return true
    return false
}

export const getUserID = (request: Request): number => {
    const usu_id = request.auth?.usu_id
    if(usu_id === undefined)
        throw new Error("Sem autorização.")
    return usu_id
}

export const sanitizeAndamento = (andamento: Andamento | CreateAndamento) => {
    andamento.and_descricao = andamento.and_descricao.replaceAll(/<[^><]+>/g, '')
}
