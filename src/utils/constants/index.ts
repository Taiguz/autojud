export enum httpCodes {
    CREATED = 201,
    OK = 200,
    NOT_FOUND = 404,
    UNAUTHORIZED = 401,
    SERVER_ERROR = 400,
    INTERNAL_ERROR = 500
}


export const defaultPageLimit = 20

export const regValidadeTextFields = /^[A-Za-z0-9ÃÁÉÍÓÚãáéíóúàâêîôûÂÊÎÔÛç\-,. ]+$/

// TODO: Isso deve ser personalisável
export const diasDeAntecedenciaParaAvisoTarefas = 3;

export const cronBuscarTarefasVencimento = '00 00 07 * * 1-5'

export const cronBuscarAndamentos = '00 00 06 * * 1-5'