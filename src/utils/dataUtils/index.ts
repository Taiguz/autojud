import { parseISO, formatISO } from "date-fns"

export const dataHoje = (new Date()).toLocaleDateString().replaceAll('/','-')

export const dateToISOSTring = (data: Date): string => {
    return formatISO(data, { representation: 'date'})
}

export const getHojeDate = () => {
    const hoje = new Date()
    return parseISO(dateToISOSTring(hoje))
}
