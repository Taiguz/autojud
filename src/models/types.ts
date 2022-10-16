
import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize'



export interface ModelProcesso extends Model<InferAttributes<ModelProcesso>, InferCreationAttributes<ModelProcesso>> {
    pro_id: CreationOptional<number>
    pro_cnj: string
    pro_titulo: string
    pro_ultimo_andamento?: string
    pro_external_id?: number
}

export interface ModelAndamento extends Model<InferAttributes<ModelAndamento>, InferCreationAttributes<ModelAndamento>> {
    and_id: CreationOptional<number>
    and_descricao: string
    and_data: string
    and_external_id: number
    pro_id: number
}

export interface ModelUsuario extends Model<InferAttributes<ModelUsuario>, InferCreationAttributes<ModelUsuario>> {
    usu_id: CreationOptional<number>
    usu_tag: string
    usu_email: string
    usu_senha: string
    usu_administrador: boolean
    usu_verificado: boolean
    usu_oab: string
}

export interface ModelProcessoResponsavel extends Model<InferAttributes<ModelProcessoResponsavel>, InferCreationAttributes<ModelProcessoResponsavel>> {
    usu_id: number
    pro_id: number
}

export interface ModelTarefa extends Model<InferAttributes<ModelTarefa>, InferCreationAttributes<ModelTarefa>> {
    tar_id: CreationOptional<number>
    tar_objetivo: string
    tar_data_cadastro: string
    tar_data_termino: string
    tar_situacao: boolean
    tar_pai_id?: number | null
    and_id?: number
    pro_id: number
}

export interface ModelTarefaResponsavel extends Model<InferAttributes<ModelTarefaResponsavel>, InferCreationAttributes<ModelTarefaResponsavel>> {
    usu_id: number
    tar_id: number
}

export interface ModelNotificacao extends Model<InferAttributes<ModelNotificacao>, InferCreationAttributes<ModelNotificacao>> {
    not_id: CreationOptional<number>
    not_aviso: string
    not_data_envio: string
    not_visto: boolean
    not_importancia: number
    pro_id: number
    usu_id: number
    tar_id?: number
    and_id?: number
}