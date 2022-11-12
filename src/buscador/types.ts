export interface RetornoAndamentosDiariosOficiais {
    items: RetornoAndamentoDiarioOficial[]
    paginator: {
        current_page: number
        per_page: number
        total: number
        total_pages: number
    }
}

// TODO: Existem muitos dados útis nesse retorno que podem ser usados
// ver melhor mais adiante os dados que podem ser usados
export interface RetornoAndamentoDiarioOficial {
    id: number,
    conteudo: string,
    data: string
}

export enum EscavadorStatus {
    PENDENTE = 'PENDENTE',
    SUCESSO = "SUCESSO",
    ERRO = 'ERRO',
    NAO_ENCONTRADO = 'NAO_ENCONTRADO'
}

type Status = "PENDENTE" | "SUCESSO" | "ERRO" | "NAO_ENCONTRADO"

export interface RetornoConsultaAndamentoTribunal {
    status: Status
    link_api: string
    resposta: {
        instancias: {
            movimentacoes: {
                data: string
                conteudo: string
                id: number
            }[],
            documentos_publicos: any[]
        }[]
    }
}


