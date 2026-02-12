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

export interface RetornoAndamentosProcessoV2 {
    items: RetornoAndamentoProcessoV2[]
    links: {
        next: string | null
    }
    paginator: {
        per_page: number
    }
}

export interface RetornoAndamentoProcessoV2 {
    id: number
    conteudo: string
    data: string
}

export interface StatusUltimaVerificacaoProcesso {
    id: number
    status: "PENDENTE" | "SUCESSO" | "ERRO" | string
    criado_em: string
    concluido_em: string 
}

export interface RetornoStatusAtualizacaoProcesso {
    numero_cnj: string
    data_ultima_verificacao: string | null
    tempo_desde_ultima_verificacao?: string
    ultima_verificacao?: StatusUltimaVerificacaoProcesso | null
}

export type FrequenciaMonitoramentoProcesso = "DIARIA" | "SEMANAL"

export interface MonitoramentoProcesso {
    id: number
    numero: string
    criado_em: string
    data_ultima_verificacao: string | null
    frequencia: FrequenciaMonitoramentoProcesso
    status: string
}

export interface RetornoMonitoramentosProcesso {
    items: MonitoramentoProcesso[]
    links: {
        next: string | null
    }
    paginator: {
        current_page: number
        per_page: number
        total: number
        total_pages: number
    }
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
