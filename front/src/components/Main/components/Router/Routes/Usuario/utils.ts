import validator from "validator"

export const validarUsuarioTag = (usu_tag: string): boolean => {
    return validator.isAlpha(usu_tag) && validator.isLength(usu_tag, { min: 4, max: 20 })
}

export const validarUsuarioEmail = (usu_email: string): boolean => {
    return validator.isEmail(usu_email)
}

export const validarUsuarioOAB = (usu_oab: string): boolean => {
    return /^[A-Z]{2}[0-9]{6}$/.test(usu_oab)
}
export const validarSenha = (senha: string): boolean => {
    return validator.isLength(senha, { min:8, max:20 }) && validator.isStrongPassword(senha, {minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false})
}