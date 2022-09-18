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