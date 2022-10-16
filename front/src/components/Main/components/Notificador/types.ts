import { IAndamento } from "../Router/Routes/Andamentos/types"
import { IProcesso } from "../Router/Routes/Processo/types"
import { ITarefa } from "../Router/Routes/Tarefas/types"

export interface NotificacoesSistema {
    not_id: number
    not_aviso: string
    not_importancia: number
    not_data_envio: string
    processo?: IProcesso
    andamento?: IAndamento
    tarefa?: ITarefa
}

export enum TipoAviso {
    NOVO_ANDAMENTO = '{novo_andamento}',
    VENCIMENTO_TAREFA = '{vencimento_tarefa}'
}

export enum ImportanciaNotificacao {
    NORMAL = 1,
    AVISO = 2,
    PERIGO = 3
}