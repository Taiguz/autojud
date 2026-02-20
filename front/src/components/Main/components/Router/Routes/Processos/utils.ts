
import validator from 'validator'
import { ProcessoSituacao } from '../Processo/types'

export const validarProcessoTitulo = (pro_titulo: string) => {
    return validator.isAlphanumeric(pro_titulo, 'pt-BR', { ignore: ' ' }) && validator.isLength(pro_titulo, { min: 4, max: 200 })
}

export const validarProcessoCNJ = (pro_cnj: string) => {
    return getValidacaoProcessoCNJMensagem(pro_cnj) === ''
}

const calcularDigitoVerificadorCNJ = (sequencial: string, ano: string, ramo: string, tribunal: string, origem: string) => {
    const numeroSemDV = BigInt(`${sequencial}${ano}${ramo}${tribunal}${origem}00`)

    const DD = 98n - (numeroSemDV % 97n)

    return String(DD).padStart(2, '0')
}

export const getValidacaoProcessoCNJMensagem = (_pro_cnj: string) => {

    debugger
    const cnjSanitizado = _pro_cnj.replace(/\D/g, '').replaceAll('-', '').replaceAll('.', '')
    const pro_cnj = `${cnjSanitizado.slice(0, 7)}-${cnjSanitizado.slice(7, 9)}.${cnjSanitizado.slice(9, 13)}.${cnjSanitizado.slice(13, 14)}.${cnjSanitizado.slice(14, 16)}.${cnjSanitizado.slice(16, 20)}`

    const formato = /^\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}$/
    if (!formato.test(pro_cnj))
        return 'Formato inválido. Use NNNNNNN-DD.AAAA.J.TR.OOOO (ex.: 0047498-35.2020.8.21.0001).'

    const [sequencial, restante] = pro_cnj.split('-')
    const [digitoVerificador, ano, ramo, tribunal, origem] = restante.split('.')

    if (sequencial === '0000000')
        return 'NNNNNNN inválido: o número sequencial não pode ser 0000000.'

    const anoNumero = Number(ano)
    const anoAtual = new Date().getFullYear()
    if (anoNumero < 1900 || anoNumero > anoAtual)
        return `AAAA inválido: informe um ano entre 1900 e ${anoAtual}.`

    if (ramo === '0')
        return 'J inválido: o órgão do Poder Judiciário deve ser de 1 a 9.'

    if (tribunal === '00')
        return 'TR inválido: o código do tribunal deve ser entre 01 e 99.'

    if (origem === '0000')
        return 'OOOO inválido: a unidade de origem não pode ser 0000.'

    const digitoEsperado = calcularDigitoVerificadorCNJ(sequencial, ano, ramo, tribunal, origem)
    if (digitoVerificador !== digitoEsperado)
        return `DD inválido: dígito verificador incorreto para a numeração informada (esperado: ${digitoEsperado}).`

    return ''
}

export const validarProcessoResponsaveisTags = (tags: string, usu_tags: string[]) => {
    return tags.split(',').map(tag => tag.trim()).every(tag => usu_tags.includes(tag))
}

export const getSituacao = (situacao: ProcessoSituacao | undefined): string => {
    if(typeof situacao !== 'number') return 'Ativos'
    switch(situacao){
        case ProcessoSituacao.Ativo:
            return 'Ativos'
        case ProcessoSituacao.Arquivado:
            return 'Arquivados'
    }
    return 'Ativos'
}

export const getSituacaoFromString = (situacao: string | null): ProcessoSituacao => {
    if(situacao === null) return ProcessoSituacao.Ativo
    switch(situacao.toLowerCase()){
        case 'ativos':
            return ProcessoSituacao.Ativo
        case 'arquivados':
            return ProcessoSituacao.Arquivado
    }
    return ProcessoSituacao.Ativo
}
