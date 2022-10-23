
import validator from 'validator'
import { ProcessoSituacao } from '../Processo/types'

export const validarProcessoTitulo = (pro_titulo: string) => {
    return validator.isAlphanumeric(pro_titulo, 'pt-BR', { ignore: ' ' }) && validator.isLength(pro_titulo, { min: 4, max: 200 })
}

export const validarProcessoCNJ = (pro_cnj: string) => {
    return /^[0-9-.]+$/.test(pro_cnj)
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