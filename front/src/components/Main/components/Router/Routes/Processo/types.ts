export enum ProcessoSituacao  {
    Ativo = 0,
    Arquivado = 1
}

export interface IProcesso {
    pro_id: number
    pro_cnj: string
    pro_titulo: string
    pro_situacao?: number
}
