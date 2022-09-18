import validator from "validator"
import { validarTarefaObjetivo } from "../Tarefa/utils"

export const validarUsuarioTag = (usu_tag: string): boolean => {
    return validator.isAlpha(usu_tag) && validator.isLength(usu_tag, { min: 4, max: 20 })
}

export const validarUsuarioEmail = (usu_email: string): boolean => {
    return validator.isEmail(usu_email)
}

export const validarUsuarioOAB = (usu_oab: string): boolean => {
    return /^[A-Z]{2}[0-9]{6}$/.test(usu_oab)
}