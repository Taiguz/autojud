import { format, formatISO, parseISO } from "date-fns"

export const limitString = (str: string, limit: number): string => {
    if(str.length > limit)
        return str.substring(0, limit) + '...'
    else 
        return str
}

export const sanitizeAndamento = (str: string): string => {
    return str
}

export const formatISOString = (str: string): string => {
    return format(parseISO(str), 'dd/MM/yyy')
} 

export const dateToISOSTring = (data: Date): string => {
    return formatISO(data, { representation: 'date'})
}

export const isLogado = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    return token !== null
}

export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export const getHojeDate = () => {
    const hoje = new Date()
    return parseISO(dateToISOSTring(hoje))
}

// min e max inclusivos
export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomSymbol = (): string => {
    return String.fromCharCode(getRandomInt(33,47))
}
const getRandomChar = (): string => {
    return String.fromCharCode(getRandomInt(97,122))
}

export const gerarSenha = (tamanho: number = 8) => {
    let senha = getRandomSymbol() + getRandomChar().toUpperCase() + String(getRandomInt(0, 9))
    const tamanhoMaximo = getRandomInt(8, tamanho + 3)
    for(let index = 0; index < tamanhoMaximo; index++)
        senha += String.fromCharCode(getRandomInt(33, 126))
    return senha
}

export const Capitalize = (str: string) => {
    str[0].toUpperCase()
    return str
}