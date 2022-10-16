import validator from "validator"

export const validarTarefaObjetivo = (tar_objetivo: string) => {
    return validator.isAlphanumeric(tar_objetivo, 'pt-BR', { ignore: ' ' }) && validator.isLength(tar_objetivo, { min: 4, max: 200 })
}

export const validarTarefaPrazoFatal = (tar_data_termino: string) => {
    return validator.isDate(tar_data_termino)
}