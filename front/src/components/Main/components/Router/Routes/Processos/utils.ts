
import validator from 'validator'

export const validarProcessoTitulo = (pro_titulo: string) => {
    return validator.isAlphanumeric(pro_titulo, 'pt-BR', { ignore: ' ' }) && validator.isLength(pro_titulo, { min: 4, max: 200 })
}

export const validarProcessoCNJ = (pro_cnj: string) => {
    return /^[0-9-.]+$/.test(pro_cnj)
}