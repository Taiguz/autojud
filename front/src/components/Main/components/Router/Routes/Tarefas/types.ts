import { IProcesso } from "../Processo/types"

export interface ITarefa {
    tar_id: number
    tar_objetivo: string
    tar_data_cadastro: string
    tar_data_termino: string
    tar_situacao: boolean
    tar_pai_id: number | null
    pro_id: number
    processo?: IProcesso
}