export interface CreateProcesso {
    pro_cnj: string
    pro_titulo: string
}

export interface ProcessoUpdate { 
    pro_id: number
    pro_cnj?: string
    pro_titulo?: string
    pro_external_id?: number
    pro_ultimo_andamento?: string
    pro_buscando_andamentos?: boolean
}

export interface Processo { 
    pro_id: number
    pro_cnj: string
    pro_titulo: string
    pro_external_id?: number
    pro_ultimo_andamento?: string
    pro_buscando_andamentos?: boolean
    andamentos?: Andamento[]
}

export interface CreateAndamento {
    and_descricao: string
    and_data: string
    and_external_id: number
    pro_id: number
}

export interface Andamento {
    and_id: number
    and_descricao: string
    and_data: string
    pro_id: number
}

export interface CreateUsuario {
    usu_oab: string
    usu_email: string
    usu_senha: string
    usu_tag: string
    usu_administrador: boolean
}

export interface EditarUsuario {
    usu_id: number
    usu_tag?: string
    usu_oab?: string
    usu_senha?: string
    usu_verificado?: boolean
    usu_administrador?: boolean
}

export interface Usuario {
    usu_id: number
    usu_tag: string
    usu_oab: string
    usu_email: string
    usu_senha: string
    usu_administrador: boolean
}

export interface CreateTarefa {
    tar_objetivo: string
    tar_data_cadastro: string
    tar_data_termino: string
    tar_situacao: boolean
    tar_pai_id?: number | null
    and_id?: number
    pro_id: number
}

export interface Tarefa {
    tar_id: number
    tar_objetivo: string
    tar_data_cadastro: string
    tar_data_termino: string
    tar_situacao: boolean
    pro_id: number
    tar_pai_id?: number | null
    and_id?: number
    subtarefas?: Tarefa[]
    processo?: Processo
}

export interface CreateNotificacao {
    not_aviso: string
    not_data_envio: string
    not_visto: boolean
    not_importancia: number
    pro_id: number
    tar_id?: number
    and_id?: number
    usu_id: number
}

export interface Notificacao {
    not_id: number
    not_aviso: string
    not_data_envio: string
    not_visto: boolean
    not_importancia: number
    pro_id: number
    tar_id?: number
    usu_id: number
}